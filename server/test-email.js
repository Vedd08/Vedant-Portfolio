import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
  console.log('Testing email configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '****' : 'NOT SET');
  console.log('EMAIL_TO:', process.env.EMAIL_TO);

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('\nVerifying transporter...');
    await transporter.verify();
    console.log('✅ Transporter verified successfully!');

    // Send test email
    console.log('\nSending test email...');
    const info = await transporter.sendMail({
      from: `"Portfolio Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: 'Test Email from Portfolio',
      text: 'This is a test email to verify email sending works.',
      html: '<h2>Test Email</h2><p>This is a test email from your portfolio contact form.</p>'
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('❌ Email sending failed!');
    console.error('Error details:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔐 Authentication failed. Check your EMAIL_PASS.');
      console.error('Make sure you are using an App Password, not your regular Gmail password.');
      console.error('Get App Password at: https://myaccount.google.com/apppasswords');
    }
  }
};

testEmail();