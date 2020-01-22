#!/bin/bash

# File: ./uninstall/npm.sh
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

echo "Uninstall NPM dependencies" \
&& cd $INIT_CWD \
&& npm uninstall eslint-config-airbnb-base \
&& npm uninstall eslint-plugin-chai-friendly \
&& npm uninstall eslint-plugin-cypress
