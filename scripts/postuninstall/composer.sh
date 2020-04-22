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

node scripts/helpers/format-log.js 'postuninstall' 'composer' 'remove composer dependencies of wpdtrt-npm-scripts' \
node scripts/postuninstall/remove-composer-dependencies.js \
node scripts/helpers/format-log.js 'postuninstall' 'composer' 'uninstall composer dependencies of host' \
&& cd $INIT_CWD \
&& composer install --prefer-dist --no-interaction --no-dev --no-suggest
