import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set.");
  }

  // Avoid reconnecting if already connected
  if (mongoose.connection.readyState === 1) {
    console.log("✅ Using existing mongoose connection");
    return;
  }

  // Connection event listeners
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ Mongoose connection error:", err);
    // Optional: fail fast in serverless environments
    process.exit(1);
  });

  // Ensure TLS is explicitly enabled for SRV connections
  const connectionString = uri.includes("/") ? uri : `${uri}/BG-REMOVAL`;

  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // fail fast if can't connect
      tls: true, // explicitly enable TLS
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    throw err;
  }
};

export default connectDB;
