const mongoose = require('mongoose');
const User = require('../models/user'); // Note the correct path
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' }); // Specify the path to your .env file

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedAdmins = async () => {
  try {
    // Check if admins already exist
    const existingAdmins = await User.find({ isAdmin: true });
    if (existingAdmins.length > 0) {
      console.log('Admin users already exist. Exiting...');
      return;
    }

    // Hash passwords
    const hashedPassword1 = await bcrypt.hash('knight123', 10);
    const hashedPassword2 = await bcrypt.hash('atreus123', 10);

    // Create admin users
    await User.create([
      {
        email: 'knightsfinestates@gmail.com',
        password: hashedPassword1,
        isAdmin: true,
      },
      {
        email: 'atreusx1@gmail.com',
        password: hashedPassword2,
        isAdmin: true,
      },
    ]);

    console.log('Admin users created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin users:', error);
    process.exit(1);
  }
};

seedAdmins();