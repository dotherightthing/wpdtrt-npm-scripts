#!/bin/bash

# File: ./scripts/compile/js.sh
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

node scripts/helpers/log.js 'compile' 'js' 'transpile es6 to es5' \
&& cd $INIT_CWD \
&& cat js/backend.js > js/backend-es5.js \
&& cat js/frontend.js > js/frontend-es5.js \
&& babel "js/backend-es5.js" --out-dir js \
&& babel "js/frontend-es5.js" --out-dir js
