import { handler } from '../server.js';

export default async function wrappedHandler(req, res) {
  try {
    await handler(req, res);
  } catch (err) {
    console.error("❌ Uncaught error in handler:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
