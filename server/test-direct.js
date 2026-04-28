import nodemailer from 'nodemailer';

const testDirect = async () => {
  console.log('🔐 Testing with your exact credentials...\n');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sonawanevedant42@gmail.com',
      pass: 'aoul exmy ttjy ymkx'
    }
  });

  try {
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ Connected to Gmail SMTP\n');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: 'sonawanevedant42@gmail.com',
      to: 'sonawanevedant42@gmail.com',
      subject: 'DIRECT TEST - ' + new Date().toLocaleTimeString(),
      text: 'This is a direct test using your exact credentials.',
      html: '<h2>Direct Test</h2><p>If you see this, email works!</p><p>Time: ' + new Date().toLocaleString() + '</p>'
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('\n📧 Check ALL Gmail folders:');
    console.log('   - Primary Inbox');
    console.log('   - Spam/Junk');
    console.log('   - Promotions');
    console.log('   - Updates');
    console.log('   - Social');
    console.log('\n🔗 Search link: https://mail.google.com/mail/#search/DIRECT+TEST');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔐 Authentication failed!');
      console.error('Your App Password might be incorrect or expired.');
      console.error('Try creating a NEW App Password:');
      console.error('1. Go to: https://myaccount.google.com/apppasswords');
      console.error('2. Delete the old "Portfolio" app password');
      console.error('3. Create a new one named "Portfolio Contact"');
      console.error('4. Copy the 16-character code (no spaces)');
    }
  }
};

testDirect();