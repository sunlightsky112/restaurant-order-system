const { MongoClient } = require('mongodb');

let db;

async function connectMongo() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db(process.env.MONGO_DB_NAME);
}

function getDB() {
  return db;
}

module.exports = { connectMongo, getDB };
