#!/bin/sh
cd /opt/seeds-dashboard

docker-compose -f docker-compose-stage.yml down

docker-compose -f docker-compose-stage.yml up --build -d