const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const stripeLib = require('stripe');
const { router: authRouter } = require('./auth');
const profileRouter = require('./profile');
const db = require('./db');
const admin = require('firebase-admin');
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "canvas-app-sandbox"
  });
}
const firestore = admin.firestore();


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4242;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const stripe = stripeLib(process.env.STRIPE_SECRET_KEY || 'sk_test_12345');

// CORS Configuration
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Route for Stripe webhook must capture raw body for signature verification
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the completed checkout session
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, type, pointsAmount } = session.metadata;

    console.log(`Payment succeeded! Metadata: User: ${userId}, Type: ${type}, PointsAmount: ${pointsAmount}`);

    try {
      const profileRef = firestore.collection('artifacts').doc('masari-academic-decoder').collection('users').doc(userId);
      const profileDoc = await profileRef.get();
      
      if (!profileDoc.exists) {
        throw new Error("User profile does not exist in Firestore.");
      }

      const currentProfile = profileDoc.data();

      if (type === 'subscription') {
        const newPoints = (currentProfile.points || 0) + 100;
        await profileRef.update({ subscriptionTier: 'bro', points: newPoints });
      } else if (type === 'points') {
        const addedPoints = parseInt(pointsAmount, 10) || 0;
        const newPoints = (currentProfile.points || 0) + addedPoints;
        await profileRef.update({ points: newPoints });
      }

      console.log(`Successfully updated Firestore profile for user ${userId}`);
    } catch (dbErr) {
      console.error("Failed to update user profile in Firestore:", dbErr.message);
      return res.status(500).json({ error: "Failed to record payment in database." });
    }
  }

  res.json({ received: true });
});

// JSON body parser for normal API endpoints
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);

// Endpoint to create a Stripe checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  const { userId, type, pointsAmount, price } = req.body;

  if (!userId || !type) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    let lineItem = {};
    if (type === 'subscription') {
      lineItem = {
        price: 'price_1TgKNgCYJoLGhklqvQGGZmVB',
        quantity: 1
      };
    } else if (type === 'points') {
      const amountVal = parseInt(pointsAmount, 10);
      const unitAmountCents = Math.round(parseFloat(price) * 100);

      lineItem = {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${amountVal} Masari Credits Pack`,
            description: `Micro-credits top-up to run Live DeepSearch queries`,
          },
          unit_amount: unitAmountCents
        },
        quantity: 1
      };
    } else {
      return res.status(400).json({ error: 'Invalid checkout session type' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [lineItem],
      mode: type === 'subscription' ? 'subscription' : 'payment',
      success_url: `${FRONTEND_URL}/#success`, // Can route back to app homepage or sub page
      cancel_url: `${FRONTEND_URL}/#cancel`,
      metadata: {
        userId: userId,
        type: type,
        pointsAmount: pointsAmount ? pointsAmount.toString() : '0'
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Error creating Stripe session:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Stripe payments server running on port ${PORT}`);
});
