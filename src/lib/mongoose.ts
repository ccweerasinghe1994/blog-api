import { APP_CONFIG } from '@/config';
import { Logger } from '@/lib/winston';
import type { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose';

const clientOptions: ConnectOptions = {
  dbName: 'blog-db',
  appName: 'blog-api',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

const connectToDatabase: () => Promise<void> = async () => {
  if (!APP_CONFIG.MONOGO_URI) {
    throw new Error('MongoDB URI is not defined in the environment variables.');
  }

  try {
    await mongoose.connect(APP_CONFIG.MONOGO_URI, clientOptions);
    Logger.info('Connected to MongoDB successfully', {
      uri: APP_CONFIG.MONOGO_URI,
      clientOptions,
    });
  } catch (error) {
    Logger.error('Error connecting to MongoDB:', error);
    if (error instanceof Error) {
      throw new Error(`MongoDB connection error: ${error.message}`);
    }
  }
};

const disconnectFromDatabase: () => Promise<void> = async () => {
  try {
    await mongoose.disconnect();
    Logger.info('Disconnected from MongoDB successfully', {
      uri: APP_CONFIG.MONOGO_URI,
      clientOptions,
    });
  } catch (error) {
    Logger.error('Error disconnecting from MongoDB:', error);
    if (error instanceof Error) {
      throw new Error(`MongoDB disconnection error: ${error.message}`);
    }
  }
};

export { connectToDatabase, disconnectFromDatabase };
