import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const diagnosticTest = async () => {
  console.log('🔍 EMAIL DIAGNOSTIC TEST\n');
  console.log('Configuration:');
  console.log('  EMAIL_USER:', process.env.EMAIL_USER);
  console.log('  EMAIL_PASS:', process.env.EMAIL_PASS ? '**** (set)' : 'NOT SET');
  console.log('  EMAIL_TO:', process.env.EMAIL_TO || process.env.EMAIL_USER);
  console.log('');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    // Test 1: Verify connection
    console.log('Test 1: Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified\n');

    // Test 2: Send a simple email
    console.log('Test 2: Sending test email...');
    const info = await transporter.sendMail({
      from: `"Portfolio Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: 'TEST EMAIL - ' + new Date().toLocaleTimeString(),
      text: 'This is a test email to verify delivery.',
      html: '<h2>Test Email</h2><p>If you see this, email sending works!</p><p>Time: ' + new Date().toLocaleString() + '</p>'
    });
    
    console.log('✅ Email accepted by Gmail!');
    console.log('  Message ID:', info.messageId);
    console.log('  Response:', info.response);
    console.log('');

    // Test 3: Check Gmail account directly
    console.log('Test 3: Delivery check');
    console.log('  📧 Check your Gmail inbox at: https://mail.google.com');
    console.log('  🔍 Look in ALL these places:');
    console.log('     - Primary Inbox');
    console.log('     - Spam/Junk folder');
    console.log('     - Promotions tab');
    console.log('     - Updates tab');
    console.log('     - Social tab');
    console.log('     - All Mail (search: "Portfolio Test")');
    console.log('');
    console.log('  🔗 Direct Gmail search link:');
    console.log('     https://mail.google.com/mail/#search/Portfolio+Test');
    console.log('');

    console.log('⏰ Email was sent at:', new Date().toLocaleString());
    console.log('⏱️  Sometimes Gmail takes 1-2 minutes to deliver.');
    console.log('');
    console.log('🔄 Try refreshing your Gmail after 1 minute.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔐 Authentication Error!');
      console.error('Your App Password may be incorrect.');
      console.error('Get a new App Password: https://myaccount.google.com/apppasswords');
    }
  }
};

diagnosticTest();