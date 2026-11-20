import mongoose from 'mongoose';
import { config } from './config.js';

mongoose.set('strictQuery', true);

export async function connectDB() {
  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  });
  console.log('[db] MongoDB terhubung');
  return mongoose.connection;
}

export function dbReady() {
  return mongoose.connection.readyState === 1;
}
