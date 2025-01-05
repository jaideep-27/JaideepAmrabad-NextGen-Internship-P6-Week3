import express from 'express';
import { createBooking, getAllBooking, getBooking, getUserBookings } from '../controllers/bookingController.js';
import { verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

// Create new booking
router.post('/', verifyUser, createBooking);

// Get single booking
router.get('/:id', verifyUser, getBooking);

// Get all bookings (admin only)
router.get('/', verifyUser, getAllBooking);

// Get user bookings
router.get('/user/:userId', verifyUser, getUserBookings);

export default router;
