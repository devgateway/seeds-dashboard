#!/usr/bin/env bash
# set -e

export DOCKER_SCRIPTS_DIR=/docker-scripts

echo "upsert_users.sh"
bash $DOCKER_SCRIPTS_DIR/upsert_users.sh

echo "Launching official entrypoint..."
exec bash /entrypoint.sh mongod

