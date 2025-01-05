import Booking from '../models/Booking.js'
import Tour from '../models/Tour.js'

// Create new booking
export const createBooking = async (req, res) => {
    try {
        const { tourName, guestSize, bookAt } = req.body;

        // Validate required fields
        if (!tourName || !guestSize || !bookAt) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if the tour exists and has available slots
        const tour = await Tour.findOne({ title: tourName });
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }

        // Check if the requested guest size exceeds max group size
        if (guestSize > tour.maxGroupSize) {
            return res.status(400).json({
                success: false,
                message: `Maximum group size for this tour is ${tour.maxGroupSize}`
            });
        }

        // Check if the booking date is in the past
        if (new Date(bookAt) < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot book for past dates'
            });
        }

        // Check if the tour is already fully booked for that date
        const existingBookings = await Booking.find({
            tourName,
            bookAt: new Date(bookAt).toISOString().split('T')[0]
        });

        const totalBooked = existingBookings.reduce((total, booking) => total + booking.guestSize, 0);
        if (totalBooked + parseInt(guestSize) > tour.maxGroupSize) {
            return res.status(400).json({
                success: false,
                message: 'Tour is fully booked for this date'
            });
        }

        const newBooking = new Booking({
            ...req.body,
            bookAt: new Date(bookAt).toISOString().split('T')[0]
        });

        const savedBooking = await newBooking.save();

        res.status(200).json({
            success: true,
            message: 'Your tour is booked successfully',
            data: savedBooking
        });
    } catch (err) {
        console.error('Booking error:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
};

// Get single booking
export const getBooking = async (req, res) => {
    const id = req.params.id;
    try {
        const book = await Booking.findById(id)
            .populate('userId', 'username email')
            .select('-__v');

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking found',
            data: book
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking'
        });
    }
};

// Get all bookings
export const getAllBooking = async (req, res) => {
    try {
        const books = await Booking.find()
            .populate('userId', 'username email')
            .select('-__v')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            message: 'Bookings found',
            count: books.length,
            data: books
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings'
        });
    }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
    const userId = req.params.userId;
    try {
        const userBookings = await Booking.find({ userId })
            .populate('userId', 'username email')
            .select('-__v')
            .sort('-bookAt');

        res.status(200).json({
            success: true,
            message: 'User bookings found',
            count: userBookings.length,
            data: userBookings
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user bookings'
        });
    }
};