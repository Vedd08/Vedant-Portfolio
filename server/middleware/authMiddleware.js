import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;
  
  // Check if authorization header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user to request object
      req.user = decoded;
      
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      } else {
        return res.status(401).json({ message: 'Not authorized' });
      }
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Optional: Admin only middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};