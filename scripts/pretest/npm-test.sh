#!/bin/bash

# File: ./scripts/pretest/npm-test.sh
#
# Note:
# chmod a+x = Change access permissions of install.sh, to 'e[x]ecutable' for '[a]ll users'
#
# TODO:
# https://github.com/dotherightthing/wpdtrt-npm-scripts/issues/7
#
# Example:
# ---
# chmod a+x install.sh
# sh install.sh
# ---

# e: exit the script if any statement returns a non-true return value
# v: print shell input lines as they are read (including all comments!)
set -e

# This script should be run when wpdtrt-npm-scripts is not (yet) installed as an NPM dependency

node scripts/helpers/log.js 'pretest' 'npm' 'install test dependencies' \
&& cd $INIT_CWD \
&& npm install eslint-config-airbnb-base \
&& npm install eslint-plugin-chai-friendly \
&& npm install eslint-plugin-cypress
