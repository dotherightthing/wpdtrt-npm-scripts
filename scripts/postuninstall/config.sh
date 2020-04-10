#!/bin/bash

# File: ./scripts/postuninstall/config.sh
#
# Note:
# chmod a+x = Change access permissions of install.sh, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x install.sh
# sh install.sh
# ---

# e: exit the script if any statement returns a non-true return value
# v: print shell input lines as they are read (including all comments!)
set -e

node scripts/helpers/format-log.js 'postuninstall' 'config' 'remove files from host repository' \
&& cd $INIT_CWD \
&& rm -r css \
&& rm -r .babelrc \
&& rm -r .browserslistrc \
&& rm -r .eslintrc \
&& rm -r .sass-lint.yml \
&& rm -r phpcs.xml \
&& rm -r nodemon.json \
&& rm -r phpunit.xml.dist \
&& rm -r postcss.config.js \
&& rm js/frontend-es5.js \
&& rm js/backend-es5.js \
&& npm install --production
