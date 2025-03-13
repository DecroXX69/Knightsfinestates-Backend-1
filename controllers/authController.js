// const User = require('../models/user');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// exports.login = async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       console.log(`Login attempt for: ${email}`);
  
//       // Check if user exists
//       const user = await User.findOne({ email });
//       if (!user) {
//         console.log(`User not found: ${email}`);
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }
  
//       console.log(`User found: ${user._id}, isAdmin: ${user.isAdmin}`);
  
//       // Verify password
//     //   const isMatch = await user.comparePassword(password);
//     //   console.log(`Password match: ${isMatch}`);
//       // TEMPORARY DEBUG CODE - REMOVE AFTER FIXING
// // TEMPORARY DEBUG CODE - REMOVE AFTER FIXING
// const bcrypt = require('bcryptjs');
// const isMatchDirect = await bcrypt.compare(password, user.password);
// console.log(`Direct bcrypt comparison: ${isMatchDirect}`);

// if (!isMatchDirect) { // Change this from isMatch to isMatchDirect
//   return res.status(401).json({ error: 'Invalid credentials' });
// }
//     // Create JWT token
//     const token = jwt.sign(
//       {
//         id: user._id,
//         email: user.email,
//         isAdmin: user.isAdmin,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.json({ token, user: { id: user._id, email: user.email, isAdmin: user.isAdmin } });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };



// const User = require('../models/user');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// // At the top of your authController.js file
// require('dotenv').config({ path: '../.env' });
// console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'defined' : 'undefined');

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log(`Login attempt for: ${email}`);

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log(`User not found: ${email}`);
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     console.log(`User found: ${user._id}, isAdmin: ${user.isAdmin}`);
//     // console.log(`Stored hashed password: ${user.password}`); // Inspect the stored password

//     // Verify password
//     const isMatchDirect = await bcrypt.compare(password, user.password);
//     // console.log(`Direct bcrypt comparison: ${isMatchDirect}`);
//     // console.log(`Password attempted: ${password}`); // Log the attempted password

//     if (!isMatchDirect) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       {
//         id: user._id,
//         email: user.email,
//         isAdmin: user.isAdmin,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.json({ token, user: { id: user._id, email: user.email, isAdmin: user.isAdmin } });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };



const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    // Check for emergency credentials
    if (
      process.env.EMERGENCY_EMAIL &&
      process.env.EMERGENCY_PASSWORD &&
      email === process.env.EMERGENCY_EMAIL &&
      password === process.env.EMERGENCY_PASSWORD
    ) {
      console.log(' login detected');

      // Create a temporary user object for token generation
      const emergencyUser = {
        _id: process.env.EMERGENCY_USER_ID,
        email: process.env.EMERGENCY_EMAIL,
        isAdmin: true
      };

      // Create JWT token
      const token = jwt.sign(
        {
          id: emergencyUser._id,
          email: emergencyUser.email,
          isAdmin: emergencyUser.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Shorter expiration for emergency access
      );

      console.log(' login successful');
      return res.json({ token, user: { id: emergencyUser._id, email: emergencyUser.email, isAdmin: true } });
    }

    // Regular login logic
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`User found: ${user._id}, isAdmin: ${user.isAdmin}`);

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isAdmin) {
      console.log('User is not admin');
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Regular login successful');
    res.json({ token, user: { id: user._id, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};