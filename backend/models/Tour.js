import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    photos: [{
      type: String
    }],
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 1
    },
    category: {
      type: String,
      required: true,
      enum: ['adventure', 'cultural', 'historical', 'beach', 'nature', 'urban']
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'moderate', 'challenging']
    },
    startDates: [{
      type: Date
    }],
    highlights: [{
      type: String
    }],
    included: [{
      type: String
    }],
    notIncluded: [{
      type: String
    }],
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    tags: [{
      type: String
    }],
    languages: [{
      type: String,
      enum: ['English', 'Spanish', 'French', 'German', 'Italian', 'Chinese', 'Japanese']
    }],
    availability: {
      type: String,
      enum: ['available', 'almost_full', 'full'],
      default: 'available'
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create a 2dsphere index for location-based queries
tourSchema.index({ location: '2dsphere' });

// Create compound indexes for common search patterns
tourSchema.index({ price: 1, averageRating: -1 });
tourSchema.index({ category: 1, difficulty: 1 });
tourSchema.index({ 'startDates': 1 });

// Virtual populate reviews
tourSchema.virtual('reviewsData', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// Update average rating when reviews change
tourSchema.methods.updateAverageRating = async function() {
  const stats = await this.model('Review').aggregate([
    {
      $match: { tour: this._id }
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    this.averageRating = stats[0].avgRating;
    this.totalRatings = stats[0].count;
  } else {
    this.averageRating = 0;
    this.totalRatings = 0;
  }

  await this.save();
};

export default mongoose.model("Tour", tourSchema);
