import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("❌ MONGODB_URI environment variable is not set.");
  }

  // Avoid reconnecting if already connected
  if (mongoose.connection.readyState === 1) {
    console.log("✅ Using existing mongoose connection");
    return;
  }

  // Connection event listeners
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ Mongoose connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB disconnected");
  });

  // Extract database name from URI or use default
  const connectionString = uri.includes("?") 
    ? uri 
    : `${uri}/eventsphere?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000, // fail fast if can't connect
      socketTimeoutMS: 45000,
    });
    console.log("🎉 MongoDB connection established");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    throw err;
  }
};

export default connectDB;