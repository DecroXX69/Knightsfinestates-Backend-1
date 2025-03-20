const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // Get the token from cookies instead of Authorization header
  const token = req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the user is an admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    // Attach the decoded user info to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Check if the error is due to an expired token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;