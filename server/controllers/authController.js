import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Login admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }
    
    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email, 
        role: 'admin' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json(admin);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const admin = await Admin.findById(req.user.id);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};