#!/bin/bash

set -eu

BUCKET=s3://pixels.chrislewis.me.uk

echo "Using aws profile $AWS_PROFILE"

# Build
node scripts/createConfig.js
npm run build

# Push
aws s3 cp index.html $BUCKET
aws s3 sync dist $BUCKET/dist
aws s3 sync assets $BUCKET/assets
aws s3 sync styles $BUCKET/styles
aws s3 cp config.js $BUCKET

# Cleanup
rm config.js
