print('Start #########Creating user for ' + ${MONGO_INITDB_DATABASE} + '...##########');

db = db.getSiblingDB('$MONGO_INITDB_DATABASE');
db.createUser(
  {
    user: '$TASAI_MONGO_USERNAME',
    pwd: '$TASAI_MONGO_PASSWORD',
    roles: [{ role: 'readWrite', db: 'a$MONGO_INITDB_DATABASE' }],
  },
);
db.createCollection('test');

print('END #################################################################');
