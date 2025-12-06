// db/file.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(); // Use the database from the URI (e.g., nodevault)
  }
  return db;
}

// Read all records
async function readDB() {
  const database = await connectDB();
  return database.collection('records').find({}).toArray();
}

// Write records (replace collection content)
async function writeDB(data) {
  const database = await connectDB();
  const collection = database.collection('records');
  await collection.deleteMany({}); // clear existing
  if (data.length > 0) {
    await collection.insertMany(data);
  }
}

module.exports = { readDB, writeDB };

