import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from '../configs/mongodb.js';

console.log("✅ api/index.js loaded");

const app = express();

app.use(express.json());
app.use(cors());

// Connect to DB once (outside handler)
let dbConnected = false;
const ensureDBConnection = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error.message);
      throw error;
    }
  }
};

// Optional: Ignore favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root route
app.get('/', async (req, res) => {
  try {
    await ensureDBConnection();
    res.json({
      success: true,
      message: "✅ API working and DB connected"
    });
  } catch (error) {
    console.error("❌ Error in GET /:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal Server Error",
      message: error.message 
    });
  }
});

// Add your other routes here
// Example: import bgRoutes from '../controllers/bgRemoval.js';
// app.use('/api/remove-bg', bgRoutes);

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Express error handler:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal Server Error' 
  });
});

// Export for Vercel
export default app;
