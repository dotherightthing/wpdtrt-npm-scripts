#!/bin/bash

# File: ./lint/php.sh
#
# Note:
# chmod a+x = Change access permissions of this file, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x scripts/**/*.sh
# ---

echo "Lint PHP" \
&& cd $INIT_CWD \
&& composer validate \
&& ./vendor/bin/phpcs **/*.php --ignore=autoload.php,docs/*,node_modules/*,vendor/*,wp-content/* --standard=phpcs.xml
