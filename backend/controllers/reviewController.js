import Review from '../models/Review.js';
import Tour from '../models/Tour.js';

// Create new review
export const createReview = async (req, res) => {
    try {
        const tourId = req.params.tourId;
        const userId = req.user.id;

        // Check if user has already reviewed this tour
        const existingReview = await Review.findOne({ tour: tourId, user: userId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this tour'
            });
        }

        // Check if user has booked this tour
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }

        // Create review
        const newReview = new Review({
            ...req.body,
            tour: tourId,
            user: userId
        });

        const savedReview = await newReview.save();
        await savedReview.populate('user', 'username photo');

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: savedReview
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit review: ' + err.message
        });
    }
};

// Update review
export const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user.id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user owns the review
        if (review.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own reviews'
            });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate('user', 'username photo');

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: updatedReview
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update review: ' + err.message
        });
    }
};

// Delete review
export const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user.id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user owns the review or is admin
        if (review.user.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own reviews'
            });
        }

        await review.remove();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete review: ' + err.message
        });
    }
};

// Get reviews for a tour
export const getTourReviews = async (req, res) => {
    try {
        const tourId = req.params.tourId;
        const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

        const reviews = await Review.find({ 
            tour: tourId,
            status: 'active'
        })
        .populate('user', 'username photo')
        .populate('replies.user', 'username photo')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));

        const total = await Review.countDocuments({ 
            tour: tourId,
            status: 'active'
        });

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: reviews
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews: ' + err.message
        });
    }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const reviews = await Review.find({ user: userId })
            .populate('tour', 'title photo price')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Review.countDocuments({ user: userId });

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: reviews
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user reviews: ' + err.message
        });
    }
};

// Like/Unlike review
export const toggleReviewLike = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user.id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const isLiked = review.likes.includes(userId);
        const update = isLiked
            ? { $pull: { likes: userId } }
            : { $addToSet: { likes: userId } };

        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            update,
            { new: true }
        ).populate('user', 'username photo');

        res.status(200).json({
            success: true,
            message: isLiked ? 'Review unliked' : 'Review liked',
            data: updatedReview
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update review like: ' + err.message
        });
    }
};

// Add reply to review
export const addReviewReply = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user.id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const reply = {
            user: userId,
            text: req.body.text
        };

        review.replies.push(reply);
        await review.save();

        const updatedReview = await Review.findById(reviewId)
            .populate('user', 'username photo')
            .populate('replies.user', 'username photo');

        res.status(200).json({
            success: true,
            message: 'Reply added successfully',
            data: updatedReview
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to add reply: ' + err.message
        });
    }
};

// Report review
export const reportReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        
        const review = await Review.findByIdAndUpdate(
            reviewId,
            { 
                reported: true,
                status: 'hidden'
            },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review reported successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to report review: ' + err.message
        });
    }
};

// Get review statistics for a tour
export const getReviewStats = async (req, res) => {
    try {
        const tourId = req.params.tourId;

        // Get average rating and total reviews
        const stats = await Review.aggregate([
            {
                $match: {
                    tour: mongoose.Types.ObjectId(tourId),
                    status: 'active'
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        // Get rating distribution
        const distribution = await Review.aggregate([
            {
                $match: {
                    tour: mongoose.Types.ObjectId(tourId),
                    status: 'active'
                }
            },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format distribution data
        const ratingDistribution = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        };
        distribution.forEach(({ _id, count }) => {
            ratingDistribution[_id] = count;
        });

        res.status(200).json({
            success: true,
            data: {
                averageRating: stats[0]?.averageRating || 0,
                totalReviews: stats[0]?.totalReviews || 0,
                ratingDistribution
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch review statistics: ' + err.message
        });
    }
};