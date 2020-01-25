#!/bin/bash

# File: ./lint/js.sh
#
# Note:
# chmod a+x = Change access permissions of this file, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x scripts/**/*.sh
# ---

echo "Lint JS" \
&& cd $INIT_CWD \
&& eslint './**/*.js'
