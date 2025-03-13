const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' }); // Specify the path to the .env file

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const resetPasswords = async () => {
  try {
    // Verify we have a MongoDB URI
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in .env file');
      process.exit(1);
    }
    
    // Define users to reset
    const users = [
      { email: 'knightsfinestates@gmail.com', password: 'knight123' },
      { email: 'atreusx1@gmail.com', password: 'atreus123' }
    ];
    
    // Process each user
    for (const user of users) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Update the user
      const result = await User.updateOne(
        { email: user.email },
        { $set: { password: hashedPassword } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`Password reset successful for ${user.email}`);
      } else {
        console.log(`User ${user.email} not found or password not changed`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting passwords:', error);
    process.exit(1);
  }
};

resetPasswords();