import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
import serverless from 'serverless-http';

const app = express();

app.use(express.json());
app.use(cors());

// Optional: Ignore favicon requests to prevent 500s
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root route
app.get('/', async (req, res) => {
  try {
    await connectDB(); // Ensure DB is connected before responding
    res.send("✅ API working and DB connected");
  } catch (error) {
    console.error("❌ Error in GET /:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Avoid app.listen in serverless
export const handler = serverless(app);
