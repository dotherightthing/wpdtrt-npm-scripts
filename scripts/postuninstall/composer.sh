#!/bin/bash

# File: ./scripts/postuninstall/composer.sh
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

&& node scripts/helpers/format-log.js 'postuninstall' 'composer' 'uninstall composer dependencies of host' \
&& cd $INIT_CWD \
&& composer config -g github-oauth.github.com $GH_TOKEN \
&& composer remove 'wp-coding-standards/wpcs:^0.14.1' --no-update \ 
&& composer remove 'dealerdirect/phpcodesniffer-composer-installer:^0.4.4' --no-update \ 
&& composer remove 'phpunit/phpunit:^7.5.14' --no-update \ 
&& composer remove 'psy/psysh:~0.6' --no-update \
&& composer remove 'wp-cli/wp-cli^2.3' --no-update \
&& composer update --no-interaction --no-suggest --lock
