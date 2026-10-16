import mongoose from 'mongoose';
import net from 'net';

function checkPortOpen(port: number, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(800);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.connect(port, host);
  });
}


export async function connectDB(): Promise<string> {
  const mongoUri = process.env.MONGODB_URI?.trim();

  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is required.');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoUri;
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(
    `[DB] Connected to database: "${mongoose.connection.name}"`
  );

  return mongoUri;
}


export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
