const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkDB() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(); // Database name from URI
    const records = await db.collection('records').find({}).toArray();
    console.log("Records in MongoDB:", records);
    await client.close();
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

checkDB();
