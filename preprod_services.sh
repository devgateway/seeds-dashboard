cp ui/.env.preprod ui/.env
docker-compose -f docker-compose-preprod.yml up mysql ui wordpress nginx