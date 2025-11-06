// API Controller function to manage clerk user with database
// http://localhost:4000/api/user/webhooks
import { Webhook } from 'svix';
import userModel from '../models/userModel.js';

const clerkWebhooks = async (req, res) => {
  try {
    console.log("🔔 Webhook received");
    
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      console.error('❌ Missing CLERK_WEBHOOK_SECRET');
      return res.status(500).json({ success: false, message: 'Server misconfiguration' });
    }

    // Get headers - Clerk sends these with svix- prefix
    const svixId = req.headers['svix-id'];
    const svixTimestamp = req.headers['svix-timestamp'];
    const svixSignature = req.headers['svix-signature'];

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('❌ Missing svix headers');
      return res.status(400).json({ success: false, message: 'Missing webhook headers' });
    }

    // req.body is a Buffer because of express.raw in the route
    const rawBody = req.body instanceof Buffer ? req.body.toString('utf8') : JSON.stringify(req.body);
    
    console.log("📦 Raw body length:", rawBody.length);

    const whook = new Webhook(secret);

    // Verify webhook signature
    let payload;
    try {
      payload = whook.verify(rawBody, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature
      });
      console.log("✅ Webhook signature verified");
    } catch (err) {
      console.error('❌ Webhook verification failed:', err.message);
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    const { data, type } = payload;

    if (!type || !data) {
      console.error('❌ Invalid webhook payload');
      return res.status(400).json({ success: false, message: 'Invalid webhook payload' });
    }

    console.log(`📨 Processing webhook type: ${type}`);

    switch (type) {
      case 'user.created': {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses?.[0]?.email_address,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          photo: data.image_url || ''
        };

        console.log("👤 Creating user:", userData.email);

        try {
          const newUser = await userModel.create(userData);
          console.log("✅ User created successfully:", newUser._id);
        } catch (err) {
          // E11000 duplicate key -> user already exists (idempotency)
          if (err.code === 11000) {
            console.warn('⚠️ User already exists, skipping create', err.keyValue);
          } else {
            console.error("❌ Error creating user:", err);
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

        console.log("👤 Updating user:", data.id);

        const updatedUser = await userModel.findOneAndUpdate(
          { clerkId: data.id }, 
          userData, 
          { new: true }
        );
        
        if (updatedUser) {
          console.log("✅ User updated successfully:", updatedUser._id);
        } else {
          console.warn("⚠️ User not found for update:", data.id);
        }

        return res.status(200).json({ success: true });
      }

      case 'user.deleted': {
        console.log("👤 Deleting user:", data.id);
        
        const deletedUser = await userModel.findOneAndDelete({ clerkId: data.id });
        
        if (deletedUser) {
          console.log("✅ User deleted successfully:", deletedUser._id);
        } else {
          console.warn("⚠️ User not found for deletion:", data.id);
        }

        return res.status(200).json({ success: true });
      }

      default:
        // Unhandled event type — reply 200 to acknowledge but log for inspection
        console.log('ℹ️ Unhandled webhook type:', type);
        return res.status(200).json({ success: true, message: 'Unhandled event type' });
    }
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error',
      error: error.message 
    });
  }
};

export { clerkWebhooks };