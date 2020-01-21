#!/bin/bash

# File: ./uninstall-config.sh
#
# Note:
# chmod a+x = Change access permissions of install.sh, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x install.sh
# sh install.sh
# ---

echo "Uninstall config" \
&& cd $INIT_CWD
&& rm $npm_package_config_compile_js \
&& cp $npm_package_config_compile_postcss \
&& cp $npm_package_config_lint_css \
&& cp $npm_package_config_lint_js \
&& cp $npm_package_config_lint_php
