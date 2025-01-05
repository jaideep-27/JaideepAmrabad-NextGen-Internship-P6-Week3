import Tour from '../models/Tour.js';

// Create new tour
export const createTour = async (req, res) => {
    try {
        if (req.body.coordinates) {
            req.body.location = {
                type: 'Point',
                coordinates: req.body.coordinates
            };
        }

        const newTour = new Tour(req.body);
        const savedTour = await newTour.save();

        res.status(200).json({
            success: true,
            message: 'Successfully created',
            data: savedTour,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to create. ' + err.message
        });
    }
};

// Update tour
export const updateTour = async (req, res) => {
    const id = req.params.id;
    
    try {
        if (req.body.coordinates) {
            req.body.location = {
                type: 'Point',
                coordinates: req.body.coordinates
            };
        }

        const updatedTour = await Tour.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Successfully updated',
            data: updatedTour,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update. ' + err.message
        });
    }
};

// Delete tour
export const deleteTour = async (req, res) => {
    const id = req.params.id;
    
    try {
        await Tour.findByIdAndDelete(id);
        
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

// Get single tour
export const getSingleTour = async (req, res) => {
    const id = req.params.id;
    
    try {
        const tour = await Tour.findById(id)
            .populate('reviews')
            .populate('reviewsData');

        res.status(200).json({
            success: true,
            message: 'Tour found',
            data: tour
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: 'Tour not found'
        });
    }
};

// Advanced search and filter
export const searchTours = async (req, res) => {
    try {
        const {
            keyword,
            category,
            difficulty,
            minPrice,
            maxPrice,
            duration,
            rating,
            location,
            distance,
            startDate,
            languages,
            availability,
            sort,
            page = 1,
            limit = 8
        } = req.query;

        // Build query
        const query = {};
        
        // Text search
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { desc: { $regex: keyword, $options: 'i' } },
                { city: { $regex: keyword, $options: 'i' } },
                { tags: { $in: [new RegExp(keyword, 'i')] } }
            ];
        }

        // Category and difficulty
        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;

        // Price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Duration
        if (duration) query.duration = Number(duration);

        // Rating
        if (rating) query.averageRating = { $gte: Number(rating) };

        // Location-based search
        if (location && distance) {
            const [lng, lat] = location.split(',').map(Number);
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    },
                    $maxDistance: Number(distance) * 1000 // Convert km to meters
                }
            };
        }

        // Date availability
        if (startDate) {
            query.startDates = {
                $gte: new Date(startDate)
            };
        }

        // Languages
        if (languages) {
            query.languages = {
                $in: languages.split(',')
            };
        }

        // Availability
        if (availability) query.availability = availability;

        // Build sort
        let sortQuery = {};
        if (sort) {
            const sortFields = sort.split(',');
            sortFields.forEach(field => {
                const [key, order] = field.split(':');
                sortQuery[key] = order === 'desc' ? -1 : 1;
            });
        } else {
            sortQuery = { createdAt: -1 };
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;
        
        const tours = await Tour.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(Number(limit))
            .populate('reviews');

        const total = await Tour.countDocuments(query);

        res.status(200).json({
            success: true,
            count: tours.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: tours
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error searching tours: ' + err.message
        });
    }
};

// Get featured tours
export const getFeaturedTours = async (req, res) => {
    try {
        const tours = await Tour.find({ featured: true })
            .populate('reviews')
            .sort('-averageRating')
            .limit(8);

        res.status(200).json({
            success: true,
            count: tours.length,
            data: tours
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch featured tours'
        });
    }
};

// Get tour stats
export const getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $group: {
                    _id: null,
                    totalTours: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                    avgRating: { $avg: '$averageRating' },
                    totalReviews: { $sum: '$totalRatings' },
                    categories: { $addToSet: '$category' },
                    cities: { $addToSet: '$city' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to get tour statistics'
        });
    }
};

// Get all tours
export const getAllTour = async(req,res)=>{

    // for pagination
    const page = parseInt(req.query.page);

    try {
        
        const tours = await Tour.find({}).populate('reviews')
        .skip(page *8).limit(8)

        res.status(200).json({
            success:true,
            count:tours.length,
            message:'Successfully find all',
            data:tours
        })

    } catch (err) {
        res.status(404).json({
            success:false,
            message:'no data found',
        });

    }
    
}

// Get tour by search
export const getTourBySearch = async(req,res)=>{

    console.log(req.query)
    // here 'i' means case sensitive
    const city = new RegExp(req.query.city, 'i')
    const distance = parseInt(req.query.distance)
    const maxGroupSize = parseInt(req.query.maxGroupSize)

    try {
        
        // gte means greater than equal
        const tours =await Tour.find({city, distance:{$gte:distance},
        maxGroupSize:{$gte:maxGroupSize}}).populate('reviews')
        if(tours.length>0)
        {
            res.status(200).json({
                success:true,
                message:'Successfully find all',
                data:tours
            })
        }
        else
        {
            res.status(404).json({
                success:false,
                message:'no result found',
                data:tours
            })  
        }

    } catch (err) {
        res.status(404).json({
            success:false,
            message:'no data found',
        });
        
    }

}

// Get tour counts
export const getTourCount = async(req,res)=>{
    try {
        const tourCount = await Tour.estimatedDocumentCount()

    
        res.status(200).json({success:true, data:tourCount});
    } catch (err) {
        res.status(200).json({success:true, message:"failed to featch"}) 
    }
}