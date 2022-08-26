#!/bin/bash

# File: ./scripts/docs/naturaldocs.sh
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

node scripts/helpers/format-log.mjs 'docs' 'generate documentation' 'naturaldocs' \
&& cd $INIT_CWD \
&& test -f bin/Natural\ Docs/NaturalDocs.exe && mono bin/Natural\ Docs/NaturalDocs.exe ./config/naturaldocs || echo 'Natural Docs not found, skipping'