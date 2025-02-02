#!/bin/bash -e

#
# Usage:
# ./scripts/build-and-upload.sh <bucket-name> [--dryrun]
#

echo 'installing'
npm i
echo 'cleaning old builds'
npm run clean
echo 'building distribution'
npm run build

echo 'uploading build artifact'
aws s3 sync ./dist $1 $2