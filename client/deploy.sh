#!/bin/bash

set -eu

BUCKET=s3://pixels.chrislewis.me.uk
CF_DIST_ID=E18GYL9VCU3IK5

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

# CloudFront invalidation
RES=$(aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*")
INVALIDATION_ID=$(echo $RES | jq -r '.Invalidation.Id')
echo "Waiting for invalidation-completed for $INVALIDATION_ID..."
aws cloudfront wait invalidation-completed --distribution-id $CF_DIST_ID --id $INVALIDATION_ID

# Cleanup
rm config.js

echo "Deployment complete"
