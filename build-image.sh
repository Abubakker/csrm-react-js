#!/usr/bin/env bash

artifactId=xiaoma-admin-shop
version=1.0

docker build -t ${artifactId}:${version} -f ./Dockerfile .
