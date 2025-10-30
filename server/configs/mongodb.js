import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    // Fail fast with a clear message so the runtime logs show the real issue.
    throw new Error('MONGODB_URI environment variable is not set.');
  }

  // In serverless environments reuse existing connection if present.
  if (mongoose.connection.readyState === 1) {
    console.log('Using existing mongoose connection');
    return;
  }

  mongoose.connection.on('connected', () => {
    console.log('Database Connected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  // If MONGODB_URI is e.g. mongodb+srv://user:pass@host, avoid appending DB name blindly.
  const connectionString = uri.includes('/') ? uri : `${uri}/BG-REMOVAL`;

  await mongoose.connect(connectionString, {
    // recommended options, depending on mongoose version; adjust if needed
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDB;
