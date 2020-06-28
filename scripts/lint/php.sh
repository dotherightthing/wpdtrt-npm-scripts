#!/bin/bash

# File: ./scripts/lint/php.sh
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

node scripts/helpers/format-log.js 'lint' 'php' \
&& cd $INIT_CWD \
&& test -f ./composer.json && composer validate || echo 'no composer.json, skipping test' \
&& test -f ./vendor/bin/phpcs && ./vendor/bin/phpcs **/*.php --ignore=autoload.php,docs/*,node_modules/*,vendor/*,wp-content/* --standard=phpcs.xml || echo 'no ./vendor/bin/phpcs, skipping tests'
