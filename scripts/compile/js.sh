#!/bin/bash

# File: ./compile/js.sh
#
# Note:
# chmod a+x = Change access permissions of this file, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x scripts/**/*.sh
# ---

# TODO for generated plugins, concatenate backend and frontend boileplate files
# `./${WORDPRESS_PLUGIN_BOILERPLATE_PATH}js/frontend.js`,
# `./${WORDPRESS_PLUGIN_BOILERPLATE_PATH}js/backend.js`

echo "Compile JS" \
&& cd $INIT_CWD \
&& cat js/backend.js > js/backend-es5.js \
&& cat js/frontend.js > js/frontend-es5.js \
&& babel "js/backend-es5.js" --out-dir js \
&& babel "js/frontend-es5.js" --out-dir js
