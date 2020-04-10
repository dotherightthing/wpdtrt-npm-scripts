#!/bin/bash

# File: ./scripts/pretest/fixtures.sh
#
# Note:
# chmod a+x = Change access permissions of this file, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x scripts/**/*.sh
# ---

# e: exit the script if any statement returns a non-true return value
# v: print shell input lines as they are read (including all comments!)
set -e

# install the fixtures specified in composer.json
# then cd into each fixture's directory and install its dependencies

node scripts/helpers/log.js 'pretest' 'test' 'install fixtures' \
&& composer install --prefer-dist --no-interaction --no-suggest --verbose \
node scripts/helpers/log.js 'pretest' 'test' 'install wpdtrt dependencies' \
&& cd ./vendor/dotherightthing/wpdtrt \
&& composer install --prefer-dist --no-interaction --no-suggest --verbose \
&& npm install --non-interactive \
node scripts/helpers/log.js 'pretest' 'test' 'install wpdtrt dependencies' \
&& cd ../wpdtrt-dbth \
&& composer install --prefer-dist --no-interaction --no-suggest --verbose \
&& npm install --non-interactive \
&& echo "---" \
node scripts/helpers/log.js 'pretest' 'test' 'install wpdtrt-gallery dependencies' \
&& cd ../wpdtrt-gallery \
&& composer config -g github-oauth.github.com $GH_TOKEN \
&& composer install --prefer-dist --no-interaction --no-suggest --verbose \
&& npm install --non-interactive \
node scripts/helpers/log.js 'pretest' 'test' 'install wpdtrt-plugin-boilerplate dependencies' \
&& cd ../wpdtrt-plugin-boilerplate \
&& composer install --prefer-dist --no-interaction --no-suggest --verbose \
&& npm install --non-interactive \
node scripts/helpers/log.js 'pretest' 'test' 'override config paths for testing' \
&& echo npm config set wpdtrt-npm-scripts:wpdtrt_target vendor/dotherightthing/wpdtrt-dbth \
&& echo "Install complete"
