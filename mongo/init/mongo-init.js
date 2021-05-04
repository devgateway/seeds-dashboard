print('Start #########Creating user for ' + ${MONGO_INITDB_DATABASE} + '...##########');

db = db.getSiblingDB('$MONGO_INITDB_DATABASE');
db.createUser(
  {
    user: '$TASAI_MONGO_USERNAME',
    pwd: '$TASAI_MONGO_PASSWORD',
    roles: [{ role: 'readWrite', db: '$MONGO_INITDB_DATABASE' }],
    mechanisms : [ "SCRAM-SHA-1", "SCRAM-SHA-256" ]
  },
);

db.createCollection('test');

print('END #################################################################');
