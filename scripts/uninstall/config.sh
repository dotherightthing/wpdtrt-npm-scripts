#!/bin/bash

# File: ./uninstall/config.sh
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
&& cd $INIT_CWD \
&& rm ../../js/backend.es5 \
&& rm ../../js/frontend.es5 \
&& rm -r ../../css \
&& rm -r ../../.babelrc \
&& rm -r ../../.browserslistrc \
&& rm -r ../../.eslintrc \
&& rm -r ../../.sass-lint.yml \
&& rm -r ../../phpcs.xml \
&& rm -r ../../postcss.config.js \
&& npm install --production
