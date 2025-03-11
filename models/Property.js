// models/Property.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  developer: {
    type: String,
    required: true,
  },
  buildingName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['sale', 'offplan'],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  bedrooms: {
    type: String,
    required: true,
  },
  baths: {
    type: String,
  
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['Villa', 'Townhouse', 'Penthouse', 'Apartment']
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  images: [String], // Array of image URLs
  description: {
    type: String,
    required: true,
  },
  // Add map coordinates field
  coordinates: {
    lat: {
      type: Number,
      default: 25.276987 // Default latitude (Dubai)
    },
    lng: {
      type: Number,
      default: 55.296249 // Default longitude (Dubai)
    }
  },
  locality: {
    type: String,
    required: true,
  },
  amenities: [String],
  floorPlans: [{
    type: String,
    planImage: String
  }],
  paymentPlan: {
    onBooking: Number,
    duringConstruction: Number,
    onHandover: Number,
    postHandover: Number
  }
});

module.exports = mongoose.model('Property', propertySchema);