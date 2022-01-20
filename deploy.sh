#!/bin/sh
cd /opt/mysql-backups
wpbackdate=$(date '+%Y-%m-%d-%H-%M-%S')
wpbackfilename=wp-backup.sql
mysqldump --extended-insert=true -u wordpress --port=3308 --protocol=TCP -pwordpress wordpress > $wpbackdate-$wpbackfilename

docker cp seeds-dashboard-ui_wordpress_1:/var/www/html/wp-content/uploads ./uploads

cd /opt/seeds-dashboard-ui

docker-compose -f docker-compose-stage.yml down

docker-compose -f docker-compose-stage.yml up --build -d