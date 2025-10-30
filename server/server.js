import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
import serverless from 'serverless-http';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send("API working");
});

// Do not call app.listen when running as a serverless function.
// Connect to DB once on module load (connectDB handles reuse/guards).
(async () => {
  try {
    await connectDB();
    console.log('DB connection attempted');
  } catch (error) {
    console.error('Failed to connect DB on startup:', error);
  }
})();

export const handler = serverless(app);
