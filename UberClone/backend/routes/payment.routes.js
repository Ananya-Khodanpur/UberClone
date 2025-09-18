// Add to your existing route files or create new payment.routes.js

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const rideModel = require('../models/ride.model');
const authMiddleware = require('../middlewares/auth.middleware');

// Create Payment Intent
router.post('/create-payment-intent', authMiddleware.authUser, async (req, res) => {
    try {
        const { amount, rideId } = req.body;

        // Validate ride exists and belongs to user
        const ride = await rideModel.findById(rideId);
        if (!ride) {
            return res.status(404).json({ error: 'Ride not found' });
        }

        if (ride.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to paise
            currency: 'inr',
            metadata: {
                rideId: rideId,
                userId: req.user._id.toString()
            }
        });

        // Update ride with payment intent ID
        await rideModel.findByIdAndUpdate(rideId, {
            paymentId: paymentIntent.id
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error('Payment intent error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update Payment Status
router.post('/update-ride-payment', authMiddleware.authUser, async (req, res) => {
    try {
        const { 
            rideId, 
            paymentMethod, 
            paymentIntentId, 
            amount, 
            status 
        } = req.body;

        // Update ride with payment info
        const updatedRide = await rideModel.findByIdAndUpdate(
            rideId,
            {
                paymentId: paymentIntentId || 'cash_payment',
                paymentMethod: paymentMethod,
                paymentStatus: status,
                finalAmount: amount
            },
            { new: true }
        ).populate('user').populate('captain');

        if (!updatedRide) {
            return res.status(404).json({ error: 'Ride not found' });
        }

        res.json({
            success: true,
            ride: updatedRide
        });

    } catch (error) {
        console.error('Payment update error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;