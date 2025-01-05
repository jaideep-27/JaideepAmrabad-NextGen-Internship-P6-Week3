import express from 'express';
import { 
    createTour,
    updateTour,
    deleteTour,
    getSingleTour,
    getAllTour,
    searchTours,
    getFeaturedTours,
    getTourStats
} from '../controllers/tourController.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// Create new tour (admin only)
router.post('/', verifyAdmin, createTour);

// Update tour (admin only)
router.put('/:id', verifyAdmin, updateTour);

// Delete tour (admin only)
router.delete('/:id', verifyAdmin, deleteTour);

// Get single tour
router.get('/:id', getSingleTour);

// Search and filter tours
router.get('/search/tours', searchTours);

// Get featured tours
router.get('/featured/all', getFeaturedTours);

// Get tour statistics (admin only)
router.get('/stats/all', verifyAdmin, getTourStats);

// Get all tours
router.get('/', getAllTour);

export default router;