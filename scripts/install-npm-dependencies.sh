#!/bin/bash

# File: ./install-npm-dependencies.sh
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
&& cd $INIT_CWD
&& npm install $npm_package_config_lint_js_eslint
