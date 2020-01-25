#!/bin/bash

# File: ./lint/css.sh
#
# Note:
# chmod a+x = Change access permissions of this file, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x scripts/**/*.sh
# ---

echo "Lint SCSS" \
&& cd $INIT_CWD \
&& sass-lint '**/*.scss' --verbose --no-exit
