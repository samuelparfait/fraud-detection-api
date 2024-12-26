import { type Db, MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL as string;
const client = new MongoClient(uri);

let db: Db;

export async function connectDB(database: string) {
  if (db) return db;

  try {
    await client.connect();
    console.log('Connected to Database 🚀');

    db = client.db(database);

    return db;
  } catch (error) {
    console.error('Database connection error:', error);

    throw error;
  }
}

export const getDB = () => db;
