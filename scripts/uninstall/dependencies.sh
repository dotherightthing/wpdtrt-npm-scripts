#!/bin/bash

# File: ./uninstall/dependencies.sh
#
# Note:
# chmod a+x = Change access permissions of install.sh, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x install.sh
# sh install.sh
# ---

echo "Uninstall dependencies" \
&& cd $INIT_CWD \
&& npm uninstall eslint-config-airbnb-base \
&& npm uninstall eslint-plugin-chai-friendly \
&& npm uninstall eslint-plugin-cypress \
&& rm -r ../../node_modules \
&& rm -r ../../vendor
