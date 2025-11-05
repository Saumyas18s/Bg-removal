// API Controller function to manage clerk user with database
// http:// localhost:4000/api/user/webhooks
// controllers/clerkController.js
import { Webhook } from 'svix';
import userModel from '../models/userModel.js';

const clerkWebhooks = async (req, res) => {
  try {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      console.error('Missing CLERK_WEBHOOK_SECRET');
      return res.status(500).json({ success: false, message: 'Server misconfiguration' });
    }

    // req.body is a Buffer because of express.raw in the route
    const rawBody = req.body instanceof Buffer ? req.body.toString('utf8') : JSON.stringify(req.body);

    const whook = new Webhook(secret);

    // svix expects the headers used by Clerk; include those present on the request
    const headers = {
      'svix-id': req.header('svix-id'),
      'svix-timestamp': req.header('svix-timestamp'),
      'svix-signature': req.header('svix-signature')
    };

    // Verify will throw if verification fails
    await whook.verify(rawBody, headers);

    // Now parse the payload
    const payload = JSON.parse(rawBody);
    const { data, type } = payload;

    if (!type || !data) {
      return res.status(400).json({ success: false, message: 'Invalid webhook payload' });
    }

    switch (type) {
      case 'user.created': {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses?.[0]?.email_address,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          photo: data.image_url || ''
        };

        try {
          await userModel.create(userData);
        } catch (err) {
          // E11000 duplicate key -> user already exists (idempotency)
          if (err.code === 11000) {
            console.warn('User already exists, skipping create', err.keyValue);
          } else {
            throw err;
          }
        }

        return res.status(200).json({ success: true });
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses?.[0]?.email_address,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          photo: data.image_url || ''
        };

        await userModel.findOneAndUpdate({ clerkId: data.id }, userData, { upsert: false });
        return res.status(200).json({ success: true });
      }

      case 'user.deleted': {
        await userModel.findOneAndDelete({ clerkId: data.id });
        return res.status(200).json({ success: true });
      }

      default:
        // Unhandled event type — reply 200 to acknowledge but log for inspection
        console.log('Unhandled webhook type:', type);
        return res.status(200).json({ success: true, message: 'Unhandled event type' });
    }
  } catch (error) {
    // Svix verify throws for signature/timestamp problems — return 401
    if (error && error.message && error.message.toLowerCase().includes('signature')) {
      console.error('Webhook verification failed:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    console.error('Webhook handler error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export { clerkWebhooks };