#!/usr/bin/env bash
# set -e

export DOCKER_SCRIPTS_DIR=/docker-scripts

echo "Copying init scripts ..."
cp $DOCKER_SCRIPTS_DIR/init_* /docker-entrypoint-initdb.d/

bash $DOCKER_SCRIPTS_DIR/upsert_users.sh

echo "Launching official entrypoint..."


exec bash /docker-entrypoint.sh mongod --fork --logpath /srv/logs/mongo.log --bind_ip 0.0.0.0

