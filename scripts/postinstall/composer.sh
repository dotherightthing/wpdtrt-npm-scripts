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
# then cd into each fixture's directory and install its dependencies

node scripts/helpers/log.js 'postinstall' 'composer' 'install php dependencies' \
&& cd $INIT_CWD \
&& composer config -g github-oauth.github.com $GH_TOKEN \
&& composer install --prefer-dist --no-interaction --no-suggest --verbose
