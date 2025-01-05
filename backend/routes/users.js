import express from 'express';
import { 
    updateUser,
    deleteUser,
    getSingleUser,
    getAllUser,
    getUserStats
} from '../controllers/userController.js';
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// Update user profile
router.put('/:id', verifyUser, updateUser);

// Delete user
router.delete('/:id', verifyUser, deleteUser);

// Get single user
router.get('/:id', verifyUser, getSingleUser);

// Get all users (admin only)
router.get('/', verifyAdmin, getAllUser);

// Get user stats (admin only)
router.get('/stats/all', verifyAdmin, getUserStats);

export default router;