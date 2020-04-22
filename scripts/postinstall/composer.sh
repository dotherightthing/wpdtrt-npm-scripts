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

node scripts/helpers/format-log.js 'postinstall' 'composer' 'require composer dependencies of wpdtrt-npm-scripts' \
&& node scripts/postinstall/require-composer-dependencies.js \
&& node scripts/helpers/format-log.js 'postinstall' 'composer' 'install composer dependencies of host' \
&& cd $INIT_CWD \
&& composer config -g github-oauth.github.com $GH_TOKEN \
&& composer install --prefer-dist --no-interaction --no-suggest
