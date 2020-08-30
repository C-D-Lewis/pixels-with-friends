#!/bin/bash

set -eu

echo "Using aws profile $AWS_PROFILE"
echo "Server is at $SERVER_URL"

COMMIT=$(git rev-parse --short HEAD)
BUCKET=s3://pixels.chrislewis.me.uk
PROJECT_NAME=pixels-with-friends

# Deploy infrastructure
cd terraform
terraform init
terraform apply
cd -

# Update client code
cd client
node scripts/createConfig.js
npm run build
aws s3 cp index.html $BUCKET
aws s3 sync dist $BUCKET/dist
aws s3 sync assets $BUCKET/assets
aws s3 sync styles $BUCKET/styles
aws s3 cp config.js $BUCKET
rm config.js
cd -

# CloudFront invalidation
CF_DIST_ID=$(aws cloudfront list-distributions | jq -r '.DistributionList.Items[] | select(.Aliases.Items[0] == "pixels.chrislewis.me.uk") | .Id')
RES=$(aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*")
INVALIDATION_ID=$(echo $RES | jq -r '.Invalidation.Id')
echo "Waiting for invalidation-completed for $INVALIDATION_ID..."
aws cloudfront wait invalidation-completed --distribution-id $CF_DIST_ID --id $INVALIDATION_ID

echo "Deployment complete"
