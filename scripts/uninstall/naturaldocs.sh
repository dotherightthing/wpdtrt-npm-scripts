#!/bin/bash

# File: ./uninstall/naturaldocs.sh
#
# Note:
# chmod a+x = Change access permissions of install.sh, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x install.sh
# sh install.sh
# ---

echo "Uninstall NaturalDocs dependencies" \
&& cd $INIT_CWD \
&& rm -r ../../tmp
