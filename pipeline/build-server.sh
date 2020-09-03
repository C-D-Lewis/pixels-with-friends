#!/bin/bash

ser -eu

COMMIT=$1

cd server
docker build . -t "pwf-server:$COMMIT"
