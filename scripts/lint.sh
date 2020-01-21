#!/bin/bash

# File: ./lint.sh
#
# Note:
# chmod a+x = Change access permissions of this file, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x filename.sh
# sh filename.sh
# ---

echo "Lint files" \
&& cd $INIT_CWD \
&& composer validate \
&& sass-lint '**/*.scss' --verbose --no-exit \
&& ./vendor/bin/phpcs **/*.php --ignore=autoload.php --standard=phpcs.xml \
&& eslint './js/**/*.js'
