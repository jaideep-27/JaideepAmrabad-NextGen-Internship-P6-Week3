import User from '../models/User.js';
import bcrypt from 'bcryptjs';

//create new User
export const createUser = async (req,res)=>{
    const newUser = new User(req.body);

    try{
        const savedUser = await newUser.save();

        res.status(200).json({
            success:true,
            message:'Successfully created',
            data:savedUser,
        });

    }catch(err){
        res.status(500).json({success:false,message:'Failed to create. Try again'});
    }
};

//update User
export const updateUser = async (req, res) => {
    const id = req.params.id;
    
    try {
        // Check if updating password
        if (req.body.newPassword) {
            // Verify current password
            const user = await User.findById(id);
            const isPasswordCorrect = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            );

            if (!isPasswordCorrect) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.newPassword, salt);
        }

        // Remove password-related fields from update
        const updateData = { ...req.body };
        delete updateData.currentPassword;
        delete updateData.newPassword;
        delete updateData.confirmPassword;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: updateData
            },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Successfully updated',
            data: updatedUser
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update. ' + err.message
        });
    }
};

//delete User
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    
    try {
        await User.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Successfully deleted'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete'
        });
    }
};

//getSingle User
export const getSingleUser = async (req, res) => {
    const id = req.params.id;
    
    try {
        const user = await User.findById(id).select('-password');
        
        res.status(200).json({
            success: true,
            message: 'User found',
            data: user
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
};

//getAll User
export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort('-createdAt');
        
        res.status(200).json({
            success: true,
            message: 'Users found',
            data: users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
};

// Get user stats
export const getUserStats = async (req, res) => {
    try {
        const stats = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    verifiedUsers: {
                        $sum: { $cond: [{ $eq: ['$verified', true] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalUsers: 1,
                    verifiedUsers: 1,
                    unverifiedUsers: {
                        $subtract: ['$totalUsers', '$verifiedUsers']
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'User stats retrieved successfully',
            data: stats[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to get user stats'
        });
    }
};