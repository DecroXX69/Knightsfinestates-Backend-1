// scripts/seedDatabase.js
const mongoose = require('mongoose');
const Property = require('../models/Property');
require('dotenv').config();
// import dubai1 from '../assets/dubai1.jpg';
// import dubai2 from '../assets/dubai2.jpg';
// import dubai3 from '../assets/dubai3.jpg';
// import dubai4 from '../assets/dubai4.jpg';
// import dubai5 from '../assets/dubai5.jpg';

const sampleProperties = [
  {
    developer: "Binghatti",
    buildingName: "Binghatti Elite",
    price: 550000,
    location: "Dubai",
    area: "Dubai Marina",
    type: "sale",
    image: "https://picsum.photos/800/600", // Replace with actual image URL
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
    image: "https://picsum.photos/800/600", // Replace with actual image URL
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
    image: "https://picsum.photos/800/600", // Replace with actual image URL
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
    image: "https://www.gettyimages.com/photos/dubai-properties", // Replace with actual image URL
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
    image: "https://unsplash.com/s/photos/dubai-house", // Replace with actual image URL
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
    image: "https://unsplash.com/s/photos/dubai-real-estate", // Replace with actual image URL
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