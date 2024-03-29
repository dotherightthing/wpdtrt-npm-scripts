#!/usr/bin/env bash
# this file is run by create-wp-test-environment.mjs

if [ $# -lt 1 ]; then
	echo "usage: $0 <tmp-dir> <db-name> [wp-version] [skip-database-creation]"
	exit 1
fi

# macOS: echo $TMPDIR -> /var/folders/y4/x0wxcjc97qdg6wmwn8wvll7w0000gn/T/
# Github Actions: $RUNNER_TEMP -> /home/runner/work/_temp
TMP_DIR=$1 # added in 8d4270dbe43e29383ddc5264be33bb1d19ff76ad; before this it was hardcoded as '/tmp/'
DB_NAME=$2
WP_VERSION=${3-latest}
SKIP_DB_CREATE=${4-false}

# Environmental variables - $VARIABLE_NAME
# See https://github.com/dotherightthing/wpdtrt-plugin-boilerplate/wiki/Testing-&-Debugging#environmental-variables 
# See http://timmurphy.org/2010/05/19/checking-for-empty-string-in-bash/
# See https://www.cyberciti.biz/faq/linux-unix-howto-check-if-bash-variable-defined-not/
# -z operator returns TRUE if the Length of STRING is zero
# 
if [[ -z "$WPUNIT_DB_USER" ]]; then
	echo "WPUNIT_DB_USER not found. Please add export statement to your ~/.bash_profile"
	exit 1
else
	DB_USER=$WPUNIT_DB_USER
fi

if [[ -z "$WPUNIT_DB_PASS" ]]; then
	echo "WPUNIT_DB_PASS not found & set to ''"
	DB_PASS=""
else
	DB_PASS=$WPUNIT_DB_PASS
fi

if [[ -z "$WPUNIT_DB_HOST" ]]; then
	echo "WPUNIT_DB_HOST not found. Please add export statement to your ~/.bash_profile"
	exit 1
else
	DB_HOST=$WPUNIT_DB_HOST
fi

# macOS: echo $TMPDIR -> /var/folders/y4/x0wxcjc97qdg6wmwn8wvll7w0000gn/T/
# Github Actions: $RUNNER_TEMP -> /home/runner/work/_temp
TMPDIR=$(echo $TMP_DIR | sed -e "s/\/$//") # strip trailing slash
WP_TESTS_DIR=${WP_TESTS_DIR-$TMPDIR/wordpress-tests-lib} # create the variable, if it doesn't already exist (WP_TESTS_DIR-)
WP_CORE_DIR=${WP_CORE_DIR-$TMPDIR/wordpress/} # create the variable, if it doesn't already exist (WP_CORE_DIR-)

download() {
    if [ `which curl` ]; then
        curl -s "$1" > "$2";
    elif [ `which wget` ]; then
        wget -nv -O "$2" "$1"
    fi
}

if [[ $WP_VERSION =~ ^[0-9]+\.[0-9]+$ ]]; then
	WP_TESTS_TAG="branches/$WP_VERSION"
elif [[ $WP_VERSION =~ [0-9]+\.[0-9]+\.[0-9]+ ]]; then
	if [[ $WP_VERSION =~ [0-9]+\.[0-9]+\.[0] ]]; then
		# version x.x.0 means the first release of the major version, so strip off the .0 and download version x.x
		WP_TESTS_TAG="tags/${WP_VERSION%??}"
	else
		WP_TESTS_TAG="tags/$WP_VERSION"
	fi
elif [[ $WP_VERSION == 'nightly' || $WP_VERSION == 'trunk' ]]; then
	WP_TESTS_TAG="trunk"
else
	# http serves a single offer, whereas https serves multiple. we only want one
	download http://api.wordpress.org/core/version-check/1.7/ $TMPDIR/wp-latest.json
	grep '[0-9]+\.[0-9]+(\.[0-9]+)?' $TMPDIR/wp-latest.json
	LATEST_VERSION=$(grep -o '"version":"[^"]*' $TMPDIR/wp-latest.json | sed 's/"version":"//')
	if [[ -z "$LATEST_VERSION" ]]; then
		echo "Latest WordPress version could not be found"
		exit 1
	fi
	WP_TESTS_TAG="tags/$LATEST_VERSION"
fi

set -ex

install_wp() {

	if [ -d $WP_CORE_DIR ]; then
		return;
	fi

	mkdir -p $WP_CORE_DIR

	if [ ! -d $WP_CORE_DIR ]; then
		echo "WP_CORE_DIR was not created at" $WP_CORE_DIR
		exit 1
	fi

	if [[ $WP_VERSION == 'nightly' || $WP_VERSION == 'trunk' ]]; then
		mkdir -p $TMPDIR/wordpress-nightly
		download https://wordpress.org/nightly-builds/wordpress-latest.zip $TMPDIR/wordpress-nightly/wordpress-nightly.zip
		unzip -q $TMPDIR/wordpress-nightly/wordpress-nightly.zip -d $TMPDIR/wordpress-nightly/
		mv $TMPDIR/wordpress-nightly/wordpress/* $WP_CORE_DIR
	else
		if [ $WP_VERSION == 'latest' ]; then
			local ARCHIVE_NAME='latest'
		elif [[ $WP_VERSION =~ [0-9]+\.[0-9]+ ]]; then
			# https serves multiple offers, whereas http serves single.
			download https://api.wordpress.org/core/version-check/1.7/ $TMPDIR/wp-latest.json
			if [[ $WP_VERSION =~ [0-9]+\.[0-9]+\.[0] ]]; then
				# version x.x.0 means the first release of the major version, so strip off the .0 and download version x.x
				LATEST_VERSION=${WP_VERSION%??}
			else
				# otherwise, scan the releases and get the most up to date minor version of the major release
				local VERSION_ESCAPED=`echo $WP_VERSION | sed 's/\./\\\\./g'`
				LATEST_VERSION=$(grep -o '"version":"'$VERSION_ESCAPED'[^"]*' $TMPDIR/wp-latest.json | sed 's/"version":"//' | head -1)
			fi
			if [[ -z "$LATEST_VERSION" ]]; then
				local ARCHIVE_NAME="wordpress-$WP_VERSION"
			else
				local ARCHIVE_NAME="wordpress-$LATEST_VERSION"
			fi
		else
			local ARCHIVE_NAME="wordpress-$WP_VERSION"
		fi
		download https://wordpress.org/${ARCHIVE_NAME}.tar.gz  $TMPDIR/wordpress.tar.gz
		tar --strip-components=1 -zxmf $TMPDIR/wordpress.tar.gz -C $WP_CORE_DIR
	fi

	download https://raw.github.com/markoheijnen/wp-mysqli/master/db.php $WP_CORE_DIR/wp-content/db.php
}

install_test_suite() {
	# portable in-place argument for both GNU sed and Mac OSX sed
	if [[ $(uname -s) == 'Darwin' ]]; then
		local ioption='-i .bak'
	else
		local ioption='-i'
	fi

	# set up testing suite if it doesn't yet exist
	if [ ! -d $WP_TESTS_DIR ]; then
		# set up testing suite
		mkdir -p $WP_TESTS_DIR

		if [ ! -d $WP_TESTS_DIR ]; then
			echo "WP_TESTS_DIR was not created at" $WP_TESTS_DIR
			exit 1
		fi

		svn co --quiet https://develop.svn.wordpress.org/${WP_TESTS_TAG}/tests/phpunit/includes/ $WP_TESTS_DIR/includes
		svn co --quiet https://develop.svn.wordpress.org/${WP_TESTS_TAG}/tests/phpunit/data/ $WP_TESTS_DIR/data
	fi

	if [ ! -f wp-tests-config.php ]; then
		download https://develop.svn.wordpress.org/${WP_TESTS_TAG}/wp-tests-config-sample.php "$WP_TESTS_DIR"/wp-tests-config.php
		# remove all forward slashes in the end
		WP_CORE_DIR=$(echo $WP_CORE_DIR | sed "s:/\+$::")
		sed $ioption "s:dirname( __FILE__ ) . '/src/':'$WP_CORE_DIR/':" "$WP_TESTS_DIR"/wp-tests-config.php
		sed $ioption "s/youremptytestdbnamehere/$DB_NAME/" "$WP_TESTS_DIR"/wp-tests-config.php
		sed $ioption "s/yourusernamehere/$DB_USER/" "$WP_TESTS_DIR"/wp-tests-config.php
		sed $ioption "s/yourpasswordhere/$DB_PASS/" "$WP_TESTS_DIR"/wp-tests-config.php
		sed $ioption "s|localhost|${DB_HOST}|" "$WP_TESTS_DIR"/wp-tests-config.php

		# http://www.grymoire.com/Unix/Sed.html#uh-1
		# https://github.com/dotherightthing/wpdtrt-gallery/issues/72
		# => define( 'WP_TESTS_DOMAIN', '127.0.0.1' );
		# => define( 'WP_TESTS_EMAIL', 'admin@127.0.0.1' );
		# sed $ioption "s/example.org/127.0.0.1/" "$WP_TESTS_DIR"/wp-tests-config.php
	fi

}

install_db() {

	if [ ${SKIP_DB_CREATE} = "true" ]; then
		return 0
	fi

	# parse DB_HOST for port or socket references
	local PARTS=(${DB_HOST//\:/ })
	local DB_HOSTNAME=${PARTS[0]};
	local DB_SOCK_OR_PORT=${PARTS[1]};
	local EXTRA=""

	if ! [ -z $DB_HOSTNAME ] ; then
		if [ $(echo $DB_SOCK_OR_PORT | grep -e '^[0-9]\{1,\}$') ]; then
			EXTRA=" --host=$DB_HOSTNAME --port=$DB_SOCK_OR_PORT --protocol=tcp"
		elif ! [ -z $DB_SOCK_OR_PORT ] ; then
			EXTRA=" --socket=$DB_SOCK_OR_PORT"
		elif ! [ -z $DB_HOSTNAME ] ; then
			EXTRA=" --host=$DB_HOSTNAME --protocol=tcp"
		fi
	fi

	# create database
	# Warning: Using a password on the command line interface can be insecure.
	mysqladmin create $DB_NAME --user="$DB_USER" --password="$DB_PASS"$EXTRA
}

install_wp
install_test_suite
install_db
