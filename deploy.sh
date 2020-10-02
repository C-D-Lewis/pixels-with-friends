#!/bin/bash

set -eu

COMMIT=$(git rev-parse --short HEAD)
BUCKET=s3://pixels.chrislewis.me.uk
PROJECT_NAME=pixels-with-friends
ECR_NAME=$PROJECT_NAME-server-ecr
SITE_URL=pixels.chrislewis.me.uk

export SERVER_URL=https://$PROJECT_NAME-api.chrislewis.me.uk
export AWS_DEFAULT_REGION=us-east-1

echo "Using aws profile $AWS_PROFILE"
echo "Server is at $SERVER_URL"

# Deploy infrastructure
./pipeline/deploy-infra.sh

# Deploy server container image
./pipeline/build-server.sh $PROJECT_NAME $COMMIT

# Push to ECR
$(aws ecr get-login --region $AWS_DEFAULT_REGION --no-include-email)
RES=$(aws ecr describe-repositories --repository-names $ECR_NAME)
ECR_URI="$(echo $RES | jq -r '.repositories[0].repositoryUri')"
./pipeline/push-server.sh $PROJECT_NAME $ECR_URI $COMMIT

# Update client code
./pipeline/push-client.sh $BUCKET

# CloudFront invalidation
./pipeline/invalidation.sh $SITE_URL

echo "Deployment complete"
