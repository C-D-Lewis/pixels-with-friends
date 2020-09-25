#!/usr/bin/env bash

set -eu

IMAGE_NAME=$1
ECR_URI=$2
COMMIT=$3

IMAGE="$IMAGE_NAME:$COMMIT"
TARGET="$ECR_URI:master"  # Only want one image in the repo

docker tag $IMAGE $TARGET

echo "Pushing to ECR: $TARGET"
docker push $TARGET
