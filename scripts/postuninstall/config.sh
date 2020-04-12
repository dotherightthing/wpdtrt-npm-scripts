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
&& rm -r config/naturaldocs \
&& rm -r css \
&& rm -r release* \
&& rm .babelrc \
&& rm .browserslistrc \
&& rm .eslintrc \
&& rm .stylelint* \
&& rm js/*-es5.js \
&& rm nodemon.json \
&& rm phpcs.xml \
&& rm phpunit.xml.dist \
&& rm postcss.config.js \
&& rm scss/_wpdtrt-import.scss
