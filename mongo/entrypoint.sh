#!/usr/bin/env bash
# set -e

export DOCKER_SCRIPTS_DIR=/docker-scripts

echo "Copying init scripts ..."
cp $DOCKER_SCRIPTS_DIR/init_* /docker-entrypoint-initdb.d/

bash $DOCKER_SCRIPTS_DIR/upsert_users.sh

echo "Launching official entrypoint..."
# `exec` here is important to pass signals to the database server process;
# without `exec`, the server will be terminated abruptly with SIGKILL (see #276)
exec bash /entrypoint.sh mongod
