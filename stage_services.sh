cp ui/.env.stage ui/.env
cp wp-react-blocks-plugin/.env.stage wp-react-blocks-plugin/.env
docker-compose -f docker-compose-stage.yml up  mysql tasai ui wordpress nginx