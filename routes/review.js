const express = require('express');
const router = express.Router();
const Review = require('../schemas/Review');
const Cake = require('../schemas/Cake');
const authMiddleware = require('../middlewares/authMiddleware');
const createError = require('../utils/createError');

// Get all reviews for a specific cake
router.get('/cake/:cakeId', async (req, res, next) => {
    try {
        const reviews = await Review.find({ cakeId: req.params.cakeId })
            .populate('userId', 'first_name last_name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        next(createError(500, error.message));
    }
});

// Get all reviews by a specific user
router.get('/user', authMiddleware, async (req, res, next) => {
    try {
        const reviews = await Review.find({ userId: req.user.id })
            .populate('cakeId', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        next(createError(500, error.message));
    }
});

// Create a new review
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const { cakeId, rating, comment } = req.body;

        // Check if cake exists
        const cake = await Cake.findById(cakeId);
        if (!cake) {
            return next(createError(404, "Cake not found"));
        }

        // Check if user has already reviewed this cake
        const existingReview = await Review.findOne({
            userId: req.user.id,
            cakeId: cakeId
        });

        if (existingReview) {
            return next(createError(400, "You have already reviewed this cake"));
        }

        const review = new Review({
            userId: req.user.id,
            cakeId,
            rating,
            comment
        });

        await review.save();

        // Update cake's average rating
        const allReviews = await Review.find({ cakeId });
        const averageRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
        await Cake.findByIdAndUpdate(cakeId, { averageRating });

        res.status(201).json(review);
    } catch (error) {
        next(createError(400, error.message));
    }
});

// Update a review
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return next(createError(404, "Review not found"));
        }

        // Check if user owns the review
        if (review.userId.toString() !== req.user.id) {
            return next(createError(403, "Not authorized to update this review"));
        }

        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Update cake's average rating
        const allReviews = await Review.find({ cakeId: review.cakeId });
        const averageRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
        await Cake.findByIdAndUpdate(review.cakeId, { averageRating });

        res.json(updatedReview);
    } catch (error) {
        next(createError(400, error.message));
    }
});

// Delete a review
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return next(createError(404, "Review not found"));
        }

        // Check if user owns the review
        if (review.userId.toString() !== req.user.id) {
            return next(createError(403, "Not authorized to delete this review"));
        }

        await Review.findByIdAndDelete(req.params.id);

        // Update cake's average rating
        const allReviews = await Review.find({ cakeId: review.cakeId });
        const averageRating = allReviews.length > 0 
            ? allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length 
            : 0;
        await Cake.findByIdAndUpdate(review.cakeId, { averageRating });

        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        next(createError(500, error.message));
    }
});

module.exports = router;
