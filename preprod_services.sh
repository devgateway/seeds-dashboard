cp ui/.env.preprod ui/.env
cp wp-react-blocks-plugin/.env.preprod wp-react-blocks-plugin/.env
docker-compose -f docker-compose-preprod.yml up mysql ui metabase wordpress nginx
