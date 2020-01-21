#!/bin/bash

# File: ./compile-js.sh
#
# Note:
# chmod a+x = Change access permissions of this file, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x filename.sh
# sh filename.sh
# ---

echo "Compile JavaScript" \
&& cd $INIT_CWD \
&& cat $npm_package_config_compile_js_backend > js/backend-es5.js \
&& cat $npm_package_config_compile_js_frontend > js/frontend-es5.js \
&& babel "js/backend-es5.js" --out-dir js \
&& babel "js/frontend-es5.js" --out-dir js
