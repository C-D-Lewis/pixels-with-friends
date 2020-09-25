#!/usr/bin/env bash

set -eu

IMAGE_NAME=$1
COMMIT=$2

cd server
docker build . -t "$IMAGE_NAME:$COMMIT"
