import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Types.ObjectId,
      ref: "Tour",
      required: true
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      maxLength: [500, 'Review cannot be more than 500 characters']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5
    },
    photos: [{
      type: String
    }],
    likes: [{
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }],
    replies: [{
      user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
      },
      text: {
        type: String,
        required: true,
        trim: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    reported: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['active', 'hidden', 'deleted'],
      default: 'active'
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Prevent duplicate reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calcAverageRating = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId, status: 'active' }
    },
    {
      $group: {
        _id: '$tour',
        numRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      totalRatings: stats[0].numRatings
    });
  } else {
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      averageRating: 0,
      totalRatings: 0
    });
  }
};

// Call calcAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.tour);
});

// Call calcAverageRating before remove
reviewSchema.pre('remove', function() {
  this.constructor.calcAverageRating(this.tour);
});

export default mongoose.model("Review", reviewSchema);
