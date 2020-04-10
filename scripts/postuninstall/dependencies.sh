#!/bin/bash

# File: ./scripts/postuninstall/dependencies.sh
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

node scripts/helpers/format-log.js 'postuninstall' 'dependencies' 'remove development dependencies files from host repository' \
&& cd $INIT_CWD \
&& npm uninstall eslint-config-airbnb-base \
&& npm uninstall eslint-plugin-chai-friendly \
&& npm uninstall eslint-plugin-cypress
