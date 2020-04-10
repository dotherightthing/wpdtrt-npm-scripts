#!/bin/bash

# File: ./scripts/test/npm-install.sh
#
# Note:
# chmod a+x = Change access permissions of this file, to 'e[x]ecutable' for '[a]ll users'
#
# TODO:
# https://github.com/dotherightthing/wpdtrt-npm-scripts/issues/7
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

node scripts/helpers/log.js 'test' 'install' 'install npm dependencies' \
&& cd $INIT_CWD \
&& npm install --non-interactive \
&& echo npm config set wpdtrt-npm-scripts:wpdtrt_target vendor/dotherightthing/wpdtrt-dbth
