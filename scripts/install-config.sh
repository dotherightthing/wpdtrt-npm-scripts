#!/bin/bash

# File: ./install-config.sh
#
# Note:
# chmod a+x = Change access permissions of this file, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x filename.sh
# sh filename.sh
# ---
#
# babel: .babelrc .browserslistrc
# sass-lint: .sass-lint.yml
# postcss: postcss.config.js .browserslistrc
# eslint: .eslintrc
# phpcs: phpcs.xml

echo "Install config" \
&& cp -a config/. $INIT_CWD
