print('Start #################################################################');

db = db.getSiblingDB('tasai');
db.createUser(
  {
    user: 'tasai',
    pwd: '$12345678',
    roles: [{ role: 'readWrite', db: 'tasai' }],
    mechanisms : [ "SCRAM-SHA-1", "SCRAM-SHA-256" ]
  },
);

db.createCollection('test');

print('END #################################################################');
