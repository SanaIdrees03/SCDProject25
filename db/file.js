// db/file.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nodevault'; // default if env not set
const client = new MongoClient(MONGO_URI);
let db;

async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      const dbName = process.env.MONGO_DB_NAME || 'nodevault'; // fallback database name
      db = client.db(dbName);
      console.log(`Connected to MongoDB database: ${dbName}`);
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      throw err;
    }
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

