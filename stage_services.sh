cp ui/.env.stage ui/.env
docker-compose -f docker-compose-stage.yml up  mysql tasai ui wordpress nginx