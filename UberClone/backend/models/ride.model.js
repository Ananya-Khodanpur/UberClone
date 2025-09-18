const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'ongoing', 'completed'],
        default: 'pending'
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain'
    },
    fare: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // seconds
    },
    distance: {
        type: Number, // meters
    },
    // Payment fields - Updated for better clarity
    paymentId: {
        type: String, // Stripe payment intent ID or 'cash_payment'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'wallet'],
        default: 'cash'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    finalAmount: {
        type: Number, // Final amount paid (might differ from fare due to discounts/tips)
    },
    paymentCompletedAt: {
        type: Date
    },
    // Legacy fields (remove if not using Razorpay)
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },
    otp: {
        type: String,
        select: false,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

const rideModel = mongoose.model('Ride', rideSchema);
module.exports = rideModel;