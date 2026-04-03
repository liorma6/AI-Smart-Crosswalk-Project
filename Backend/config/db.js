import mongoose from 'mongoose';

export const dbStatus = {
  isConnected: false,
  connectionError: null,
};

export const isDatabaseReady = () =>
  dbStatus.isConnected && mongoose.connection.readyState === 1;

// Function to handle database connection
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    const error = new Error("MONGO_URI is not configured");
    dbStatus.isConnected = false;
    dbStatus.connectionError = error;
    console.error(`[System] ${error.message}. Using fallback data.`);
    return false;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    dbStatus.isConnected = true;
    dbStatus.connectionError = null;
    console.log(`[System] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    dbStatus.isConnected = false;
    dbStatus.connectionError = error;
    console.error(
      `[System] MongoDB unavailable: ${error.message}. Using fallback data.`,
    );
    return false;
  }
};

export default connectDB;
