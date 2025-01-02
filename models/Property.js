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
    required: true
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['Villa', 'Townhouse', 'Penthouse', 'Apartment']
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Property', propertySchema);