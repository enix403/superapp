#!/usr/bin/env bash

CONTAINER_NAME="superapp-api-mongodb"
DATABASE_NAME="superapp-api"

docker container stop $CONTAINER_NAME
docker container rm $CONTAINER_NAME

mkdir -p .vol-data.mongo

docker run -d \
  --rm -it \
  --name $CONTAINER_NAME \
  -v ./.vol-data.mongo:/data/db \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=user \
  -e MONGO_INITDB_ROOT_PASSWORD=pass \
  -e MONGO_INITDB_DATABASE=$DATABASE_NAME \
  mongo:6.0
