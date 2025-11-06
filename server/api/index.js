import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from '../configs/mongodb.js';
import userRouter from '../routes/userRoutes.js';

console.log("✅ api/index.js loaded");

const app = express();

// CORS should be first
app.use(cors());

// CRITICAL: Apply express.json() BEFORE routes, but the webhook route 
// will override this with express.raw() for that specific endpoint
app.use(express.json());

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

// Ensure DB connection on startup
ensureDBConnection().catch(err => {
  console.error("❌ Initial DB connection failed:", err);
});

// Optional: Ignore favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root route
app.get('/', async (req, res) => {
  try {
    await ensureDBConnection();
    res.json({
      success: true,
      message: "✅ API working and DB connected",
      mongoStatus: "connected"
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

// User routes (includes webhook)
app.use('/api/user', userRouter);

// Add your other routes here
// Example: import bgRoutes from '../controllers/bgRemoval.js';
// app.use('/api/remove-bg', bgRoutes);

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Express error handler:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Export for Vercel
export default app;