// scripts/seedDatabase.js
const mongoose = require('mongoose');
const Property = require('../models/Property');
require('dotenv').config();
const image1 = require('../assets/background1.jpg');
const image2 = require('../assets/background2.jpg');
const image3 = require('../assets/background3.jpg');

const sampleProperties = [
  {
    developer: "Binghatti",
    buildingName: "Binghatti Elite",
    price: 550000,
    location: "Dubai",
    area: "Dubai Marina",
    type: "sale",
    image: image1, // Replace with actual image URL
    bedrooms: "2",
    propertyType: "Apartment"
  },
  {
    developer: "Danube Properties",
    buildingName: "BAYZ 102",
    price: 1270000,
    location: "Dubai",
    area: "Business Bay",
    type: "offplan",
    image: image2, // Replace with actual image URL
    bedrooms: "3",
    propertyType: "Penthouse"
  },
  {
    developer: "Binghatti",
    buildingName: "Binghatti Skyrise",
    price: 975000,
    location: "Dubai",
    area: "Downtown Dubai",
    type: "sale",
    image: image3, // Replace with actual image URL
    bedrooms: "1",
    propertyType: "Apartment"
  },
  {
    developer: "Thailand Elite",
    buildingName: "Phuket Paradise",
    price: 450000,
    location: "Thailand",
    area: "Phuket",
    type: "sale",
    image: image1, // Replace with actual image URL
    bedrooms: "2",
    propertyType: "Villa"
  },
  {
    developer: "Bangkok Development",
    buildingName: "Sukhumvit Heights",
    price: 320000,
    location: "Bangkok",
    area: "Sukhumvit",
    type: "offplan",
    image: image2, // Replace with actual image URL
    bedrooms: "1",
    propertyType: "Apartment"
  },
  {
    developer: "Greek Developers",
    buildingName: "Santorini View",
    price: 890000,
    location: "Greece",
    area: "Santorini",
    type: "sale",
    image: image3, // Replace with actual image URL
    bedrooms: "3",
    propertyType: "Villa"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Clear existing properties
    await Property.deleteMany({});
    console.log('Cleared existing properties');

    // Insert sample properties
    await Property.insertMany(sampleProperties);
    console.log('Sample properties inserted successfully');

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();