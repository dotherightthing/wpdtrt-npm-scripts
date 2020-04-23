#!/bin/bash

# File: ./scripts/test/phpunit.sh
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

node scripts/helpers/format-log.js 'test' 'phpunit' 'run unit tests' \
&& cd $INIT_CWD \
&& test -f ./vendor/bin/phpunit && ./vendor/bin/phpunit --configuration phpunit.xml.dist || echo "/vendor/bin/phpunit does not exist" \
&& echo ""
