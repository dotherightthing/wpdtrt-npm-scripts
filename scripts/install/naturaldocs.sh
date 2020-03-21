#!/bin/bash

# File: ./install/naturaldocs.sh
#
# Note:
# chmod a+x = Change access permissions of this file, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x scripts/**/*.sh
# ---

echo "Download and extract Natural Docs" \
&& cd $INIT_CWD \
&& mkdir tmp2 \
&& node ./node_modules/wpdtrt-npm-scripts/scripts/download-and-extract-zip.js --extractdir='./bin' --tmpdir='./tmp2' --url=https://naturaldocs.org/download/natural_docs/2.0.2/Natural_Docs_2.0.2.zip \
&& rm -r tmp2
