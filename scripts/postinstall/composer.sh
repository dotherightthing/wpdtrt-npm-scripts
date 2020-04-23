#!/bin/bash

# File: ./scripts/postinstall/composer.sh
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

node scripts/helpers/format-log.js 'postinstall' 'composer' 'install composer dependencies of host' \
&& cd $INIT_CWD \
&& composer config -g github-oauth.github.com $GH_TOKEN \
&& composer require wp-coding-standards/wpcs:^0.14.1 --no-update \ 
&& composer require dealerdirect/phpcodesniffer-composer-installer:^0.4.4 --no-update \ 
&& composer require phpunit/phpunit:^7.5.14 --no-update \ 
&& composer require psy/psysh:~0.6 --no-update \
&& composer require wp-cli/wp-cli^2.3 --no-update \
&& composer update --no-interaction --no-suggest --lock \
&& composer install --no-interaction --no-suggest --no-scripts
