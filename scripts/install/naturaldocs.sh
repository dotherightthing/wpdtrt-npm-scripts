#!/bin/bash

# File: ./install/naturaldocs.sh
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

# TODO update Travis & Bitbucket
# https://github.com/jayrambhia/Install-OpenCV/pull/41/commits/feb959a4fcf36b3d132f35a8eaad5593ec4f27e7

# TODO - not working
# OpenSSL: error:1407742E:SSL routines:SSL23_GET_SERVER_HELLO:tlsv1 alert protocol version
#
# wget --version
# GNU Wget 1.16.3 built on darwin14.4.0.
#
# php -i | grep OpenSSL
# SSL Version => OpenSSL/1.0.2o
# OpenSSL support => enabled
# OpenSSL Library Version => OpenSSL 1.0.2o  27 Mar 2018
# OpenSSL Header Version => OpenSSL 1.0.2o  27 Mar 2018
# Openssl default config => /Applications/MAMP/Library/OpenSSL/openssl.cnf
# OpenSSL support => enabled

echo "Install Natural Docs" \
&& wget -O Natural_Docs.zip https://naturaldocs.org/download/natural_docs/2.0.2/Natural_Docs_2.0.2.zip
