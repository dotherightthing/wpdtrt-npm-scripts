#!/bin/bash

# File: ./install/fixtures.sh
#
# Note:
# chmod a+x = Change access permissions of this file, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x filename.sh
# sh filename.sh
# ---

# e: exit the script if any statement returns a non-true return value
# v: print shell input lines as they are read (including all comments!)
set -e

# install the fixtures specified in composer.json
# then cd into each fixture's directory and install its dependencies

echo "1/6. Install fixtures" \
&& composer install --prefer-dist --no-interaction --no-suggest --verbose \
&& echo "---" \
&& echo "2/6. Install wpdtrt dependencies" \
&& cd ./vendor/dotherightthing/wpdtrt \
&& composer install --prefer-dist --no-interaction --no-suggest --verbose \
&& yarn install --non-interactive \
&& echo "---" \
&& echo "3/6. Install wpdtrt-dbth dependencies" \
&& cd ../wpdtrt-dbth \
&& composer install --prefer-dist --no-interaction --no-suggest --verbose \
&& yarn install --non-interactive \
&& echo "---" \
&& echo "4/6. Install wpdtrt-gallery dependencies" \
&& cd ../wpdtrt-gallery \
&& composer config -g github-oauth.github.com $GH_TOKEN \
&& composer install --prefer-dist --no-interaction --no-suggest --verbose \
&& yarn install --non-interactive \
&& echo "---" \
&& echo "5/6. Install wpdtrt-plugin-boilerplate dependencies" \
&& cd ../wpdtrt-plugin-boilerplate \
&& composer install --prefer-dist --no-interaction --no-suggest --verbose \
&& yarn install --non-interactive \
&& echo "6/6. Override config paths for testing" \
&& echo npm config set wpdtrt-npm-scripts:wpdtrt_target vendor/dotherightthing/wpdtrt-dbth \
&& echo "Install complete"
