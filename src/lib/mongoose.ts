import mongoose, { Mongoose } from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongooseDb: MongooseCache;
}

let cached = global.mongooseDb;

if (!cached) {
  cached = global.mongooseDb = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    if (MONGODB_URI) {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
      });
    } else {
      // FALLBACK: Use MongoDB Memory Server if no URI is provided (or if local mongo is down)
      console.log("⚠️ No MONGODB_URI found. Starting MongoDB Memory Server...");
      try {
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        cached.promise = mongoose.connect(uri, opts).then(async (m) => {
          console.log("✅ MongoDB Memory Server started at:", uri);

          // SEED: Create a default user for testing if it doesn't exist
          const User = m.models.User || m.model("User", new mongoose.Schema({
            email: { type: String, unique: true },
            password: { type: String, select: false },
            name: String,
            role: { type: String, default: "user" },
            plan: { type: String, default: "free" },
          }));

          const testEmail = "umad@gmail.com";
          const existing = await User.findOne({ email: testEmail });
          if (!existing) {
            const hashedPassword = await bcrypt.hash("password123", 10);
            await User.create({
              email: testEmail,
              password: hashedPassword,
              name: "Umad",
              plan: "pro", // Give pro for testing
              role: "admin",
            });
            console.log("👤 Seeded test user: umad@gmail.com / password123");
          }

          return m;
        });
      } catch (err) {
        console.error("❌ Failed to start MongoDB Memory Server:", err);
        throw new Error("Database connection failed and fallback unavailable.");
      }
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
