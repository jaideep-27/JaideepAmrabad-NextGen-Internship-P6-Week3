import express from 'express';
import {
    createReview,
    updateReview,
    deleteReview,
    getTourReviews,
    getUserReviews,
    toggleReviewLike,
    addReviewReply,
    reportReview
} from '../controllers/reviewController.js';
import { verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

// Create new review for a tour
router.post('/:tourId', verifyUser, createReview);

// Update review
router.put('/:id', verifyUser, updateReview);

// Delete review
router.delete('/:id', verifyUser, deleteReview);

// Get reviews for a tour
router.get('/tour/:tourId', getTourReviews);

// Get user's reviews
router.get('/user/:userId?', verifyUser, getUserReviews);

// Like/Unlike review
router.post('/:id/like', verifyUser, toggleReviewLike);

// Add reply to review
router.post('/:id/reply', verifyUser, addReviewReply);

// Report review
router.post('/:id/report', verifyUser, reportReview);

export default router;