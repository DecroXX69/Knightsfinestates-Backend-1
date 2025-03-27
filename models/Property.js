const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
  bedrooms: {
    type: String, // e.g., "2BHK", "3BHK"
    required: true,
  },
  area: {
    type: String, // e.g., "718 sq.ft"
    required: true,
  },
  price: {
    type: Number, // Store price in base unit (e.g., lakhs or crores as a number)
    required: true,
  },
});

const propertySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  developer: {
    type: String,
    required: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  buildingName: {
    type: String,
    required: true,
  },
  location: {
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
  propertyType: {
    type: String,
    required: true,
    enum: ['Villa', 'Townhouse', 'Penthouse', 'Apartment'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  images: [String],
  description: {
    type: String,
    required: true,
  },
  subStatus: {
    type: String,
    enum: ['available', 'sold', 'Under Construction'],
    default: 'available',
  },
  Trend: {
    type: String,
    enum: ['normal', 'Hot'],
    default: 'normal',
  },
  coordinates: {
    lat: { type: Number, default: 25.276987 },
    lng: { type: Number, default: 55.296249 },
  },
  locality: {
    type: String,
    required: true,
  },
  amenities: [String],
  floorPlan: { type: [String], default: null },
  brochureURL: { type: String, default: null },
  LegalDocURL: { type: String, default: null },
  paymentPlan: {
    onBooking: Number,
    duringConstruction: Number,
    onHandover: Number,
    postHandover: Number,
  },
  slug: { type: String, unique: true },
  metaTitle: { type: String, default: null },
  metaDescription: { type: String, default: null },
  metaKeywords: [{ type: String }],
  reraApproved: { type: Boolean, default: false },
  reraNumber: { type: String, default: null },

  possessionDate: { // New field for possession date
    type: Date,
    default: null, // Only set when subStatus is "Under Construction"
  },
  
  // New field for multiple configurations
  configurations: [configurationSchema],
});

propertySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Property', propertySchema);