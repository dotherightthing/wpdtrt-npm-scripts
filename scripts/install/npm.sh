#!/bin/bash

# File: ./install/npm.sh
#
# Note:
# chmod a+x = Change access permissions of install.sh, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x install.sh
# sh install.sh
# ---

# This script should be run when wpdtrt-npm-scripts is not (yet) installed as an NPM dependency

echo "Install NPM dependencies" \
&& cd $INIT_CWD \
&& npm install eslint-config-airbnb-base \
&& npm install eslint-plugin-chai-friendly \
&& npm install eslint-plugin-cypress
