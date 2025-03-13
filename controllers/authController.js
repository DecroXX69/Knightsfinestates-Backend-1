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



const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// At the top of your authController.js file
require('dotenv').config({ path: '../.env' });
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'defined' : 'undefined');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`User found: ${user._id}, isAdmin: ${user.isAdmin}`);
    // console.log(`Stored hashed password: ${user.password}`); // Inspect the stored password

    // Verify password
    const isMatchDirect = await bcrypt.compare(password, user.password);
    console.log(`Direct bcrypt comparison: ${isMatchDirect}`);
    console.log(`Password attempted: ${password}`); // Log the attempted password

    if (!isMatchDirect) {
      return res.status(401).json({ error: 'Invalid credentials' });
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

    res.json({ token, user: { id: user._id, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};