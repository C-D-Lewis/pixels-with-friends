#!/bin/bash

set -eu

export AWS_PROFILE=personal_s3

BUCKET=s3://pixels.chrislewis.me.uk

node client/scripts/createConfig.js

aws s3 mb $BUCKET
aws s3 cp client/index.html $BUCKET
aws s3 cp client/dist $BUCKET/dist --recursive
aws s3 cp client/assets $BUCKET/assets --recursive
aws s3 cp client/styles $BUCKET/styles --recursive
aws s3 cp config.js $BUCKET

rm config.js
