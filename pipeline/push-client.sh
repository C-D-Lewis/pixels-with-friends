#!/usr/bin/env bash

set -eu

BUCKET=$1

# Build
cd client
node scripts/createConfig.js
npm run build

# Push
aws s3 cp index.html $BUCKET
aws s3 sync dist $BUCKET/dist
aws s3 sync assets $BUCKET/assets
aws s3 sync styles $BUCKET/styles
aws s3 cp config.js $BUCKET
rm config.js
cd -
