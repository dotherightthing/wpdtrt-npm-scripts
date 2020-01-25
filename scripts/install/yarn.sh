#!/bin/bash

# File: ./install/yarn.sh
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

# install the fixtures specified in composer.json
# then cd into each fixture's directory and install its dependencies

echo "Install Yarn dependencies" \
&& yarn install --non-interactive \
&& echo npm config set wpdtrt-npm-scripts:wpdtrt_target vendor/dotherightthing/wpdtrt-dbth
