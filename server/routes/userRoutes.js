import { clerkWebhooks } from "../controllers/userController"
import express from 'express'

const userRouter = express.Router()
userRouter.post('/webhooks',clerkWebhooks)

export default userRouter