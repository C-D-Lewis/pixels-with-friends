#!/bin/bash

set -eu

COMMIT=${1:-"$(git rev-parse --short HEAD)"}

cd server
docker build . -t "pwf-server:$COMMIT"
