import { clerkWebhooks } from "../controllers/userController.js"
import express from 'express'

const userRouter = express.Router()

// CRITICAL: Use raw body parser for webhook signature verification
userRouter.post('/webhooks', express.raw({ type: 'application/json' }), clerkWebhooks)

export default userRouter