const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    console.log(`Login attempt for: ${email}`);

    // Check for emergency credentials
    if (
      process.env.EMERGENCY_EMAIL &&
      process.env.EMERGENCY_PASSWORD &&
      email === process.env.EMERGENCY_EMAIL &&
      password === process.env.EMERGENCY_PASSWORD
    ) {
      console.log('Emergency login detected');

      // Create a temporary user object for token generation
      const emergencyUser = {
        _id: process.env.EMERGENCY_USER_ID,
        email: process.env.EMERGENCY_EMAIL,
        isAdmin: true
      };

      // Create access and refresh tokens
      const accessToken = jwt.sign(
        {
          id: emergencyUser._id,
          email: emergencyUser.email,
          isAdmin: emergencyUser.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Shorter expiration for emergency access
      );
      
      const refreshToken = jwt.sign(
        {
          id: emergencyUser._id,
          tokenType: 'refresh'
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      // Set httpOnly cookies for both tokens
      setTokenCookies(res, accessToken, refreshToken, rememberMe);

      console.log('Emergency login successful');
      return res.json({ 
        success: true, 
        user: { 
          id: emergencyUser._id, 
          email: emergencyUser.email, 
          isAdmin: true 
        },
        expiresIn: 3600 // 1 hour in seconds
      });
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

    // Create access and refresh tokens
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const refreshToken = jwt.sign(
      {
        id: user._id,
        tokenType: 'refresh'
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: rememberMe ? '30d' : '7d' }
    );

    // Store refresh token in database (optional but recommended)
    user.refreshToken = refreshToken;
    await user.save();

    // Set httpOnly cookies for both tokens
    setTokenCookies(res, accessToken, refreshToken, rememberMe);

    console.log('Regular login successful');
    res.json({ 
      success: true, 
      user: { 
        id: user._id, 
        email: user.email, 
        isAdmin: user.isAdmin 
      },
      expiresIn: 3600 // 1 hour in seconds
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not found' });
    }
    
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Check if it's really a refresh token
    if (decoded.tokenType !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }
    
    // Find the user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Optionally verify the refresh token matches what's stored in the database
    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    // Create new access token
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Set the new access token as a cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    
    res.json({ 
      success: true,
      expiresIn: 3600 // 1 hour in seconds
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
  } catch (error) {
    console.error('Error clearing refresh token from DB:', error);
  }

  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  res.json({ success: true });
};

// Helper function to set token cookies
function setTokenCookies(res, accessToken, refreshToken, rememberMe) {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false, // Must be true in production for cross-origin
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Use 'none' for cross-origin in production
    maxAge: 60 * 60 * 1000 // 1 hour
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000 // 30 days or 7 days
  });
}