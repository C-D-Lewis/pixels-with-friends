#!/bin/bash

set -eu

BUCKET=s3://pixels.chrislewis.me.uk

echo "Using aws profile $AWS_PROFILE"

# Build
node client/scripts/createConfig.js
cd client && npm run build && cd -

# Push
aws s3 mb $BUCKET
aws s3 cp client/index.html $BUCKET
aws s3 cp client/dist $BUCKET/dist --recursive
aws s3 cp client/assets $BUCKET/assets --recursive
aws s3 cp client/styles $BUCKET/styles --recursive
aws s3 cp config.js $BUCKET

# Cleanup
rm config.js
