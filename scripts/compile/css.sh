#!/bin/bash

# File: ./compile/css.sh
#
# Note:
# chmod a+x = Change access permissions of this file, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x scripts/**/*.sh
# ---

echo "Compile CSS" \
&& cd $INIT_CWD \
&& if [ -z ${CI+x} ]; then suffix=wp; else suffix=ci; fi \
&& echo "@import 'wpdtrt/dependencies-"${suffix}"';" > scss/_wpdtrt-import.scss \
&& node-sass scss --output css --recursive \
&& postcss css/**/*.css --replace
