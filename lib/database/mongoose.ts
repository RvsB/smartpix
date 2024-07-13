import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error(`Missing MONGODB_URL`);

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "smartpix",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};

//In express with mongo applications we directly connect to mongodb withing the application only once but in nextjs its the other way round, we have to call it on each and every server action or API request that we do

//but in next js unlike in traditional server-based applications like those using Express and mongodb you connect to the database on every request or server action because next js runs in a serverless environment

// serverless functions are stateless meaning that they start up to handle a request and shut down right after without maintaining a continuous connection to databases

//this approach ensures that each request is handled independently allowing for better scalability and reliability as there's no need to manage persistent connections across many instances which works well with scalable and flexible nature of next js apps
