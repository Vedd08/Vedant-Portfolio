import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Use your exact MONGO_URI from .env
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vedant_portfolio';

console.log('Connecting to:', MONGODB_URI);

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected to vedant_portfolio'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Admin User Schema
const adminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: { 
    type: Date 
  }
});

const Admin = mongoose.model('Admin', adminSchema);

const createAdmin = async () => {
  try {
    const email = 'sonawanevedant42@gmail.com';
    const password = 'vedant9807';
    
    console.log('\n📝 Creating/Updating admin user...');
    console.log('📧 Email:', email);
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (existingAdmin) {
      // Update password
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log('✅ Admin password updated successfully!');
    } else {
      // Create new admin
      const admin = new Admin({
        email,
        password: hashedPassword
      });
      await admin.save();
      console.log('✅ Admin user created successfully!');
    }
    
    console.log('\n🔐 Login Credentials:');
    console.log('   Email:   ', email);
    console.log('   Password:', password);
    console.log('\n✨ You can now login to the admin panel!');
    
    // Verify the user was created
    const verifyAdmin = await Admin.findOne({ email }).select('-password');
    console.log('\n📊 Admin record:', {
      id: verifyAdmin._id,
      email: verifyAdmin.email,
      createdAt: verifyAdmin.createdAt
    });
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    
    if (error.code === 11000) {
      console.log('   Duplicate key error - admin already exists');
    }
    
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();