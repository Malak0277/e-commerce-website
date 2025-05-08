const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    cakeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cake',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

// Compound index to ensure one review per user per cake
reviewSchema.index({ userId: 1, cakeId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema); 