const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // Approval status of the property listing
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  // Developer or company building the property
  developer: {
    type: String,
    required: true,
  },

  // Number of times the property has been viewed
  viewCount: {
    type: Number,
    default: 0
  },

  // Name of the building or project
  buildingName: {
    type: String,
    required: true,
  },

  // Property price 
  price: {
    type: Number,
    required: true,
  },

  // Location as a city or area name
  location: {
    type: String,
    required: true,
  },

  // Property area in square meters or square feet
  area: {
    type: String,
    required: true,
  },

  // Type of property listing: Sale or Off-plan
  type: {
    type: String,
    enum: ['sale', 'offplan'],
    required: true,
  },

  // Main image URL of the property
  image: {
    type: String,
    required: true,
  },

  // Number of bedrooms
  bedrooms: {
    type: String,
    required: true,
  },

  // Number of bathrooms
  baths: {
    type: String,
  },

  // Property category
  propertyType: {
    type: String,
    required: true,
    enum: ['Villa', 'Townhouse', 'Penthouse', 'Apartment']
  },

  // Date when the property was added
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Date when the property was last updated
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },

  // Additional images of the property
  images: [String], 

  // Detailed description of the property
  description: {
    type: String,
    required: true,
  },

  // Current availability status of the property
  subStatus: {
    type: String,
    enum: ['available', 'sold', 'Under Construction'],
    default: 'available'
  },

  // Property trend indicator (Normal or Hot deal)
  Trend: {
    type: String,
    enum: ['normal', 'Hot'],
    default: 'normal'
  },

  // Map coordinates for the property's location
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

  // Specific locality or neighborhood
  locality: {
    type: String,
    required: true,
  },

  // List of amenities available in the property including furnisihed or not
  amenities: [String],

  // Floor plan image URL
  floorPlan: { 
    type: String, 
    default: null 
  }, 

  // PDF brochure download link
  brochureURL: { 
    type: String, 
    default: null 
  }, 

  // Legal document download link
  LegalDocURL: { 
    type: String, 
    default: null 
  }, 

  // Payment plan details
  paymentPlan: {
    onBooking: Number,            // Payment due at booking
    duringConstruction: Number,   // Payment schedule during construction
    onHandover: Number,           // Payment due at handover
    postHandover: Number          // Payment plan after handover
  },

  // SEO-friendly URL slug for the property
  slug: { 
    type: String, 
    unique: true 
  },

  // Meta tags for SEO
  metaTitle: { type: String, default: null },
  metaDescription: { type: String, default: null },
  metaKeywords: [{ type: String }],

  // RERA (Real Estate Regulatory Authority) approval status
  reraApproved: { 
    type: Boolean, 
    default: false 
  },

  // RERA certification number
  reraNumber: { 
    type: String, 
    default: null 
  }
});

// Middleware to update updatedAt timestamp before saving
propertySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Property', propertySchema);