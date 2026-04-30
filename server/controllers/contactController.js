import Contact from "../models/Contact.js";
import nodemailer from 'nodemailer';

// Use port 587 (TLS/STARTTLS) — Render blocks port 465 (SSL)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,       // false = STARTTLS (required for port 587)
  requireTLS: true,    // force upgrade to TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000,  // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000
});

// Send email in background — don't block the HTTP response
const sendEmailBackground = async (mailOptions, label) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ ${label} sent! Message ID:`, info.messageId);
  } catch (err) {
    console.error(`❌ ${label} failed:`, err.message);
  }
};

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log('\n📨 ===== NEW CONTACT FORM SUBMISSION =====');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    // Save to database first
    const contact = await Contact.create({ name, email, message });
    console.log('✅ Saved to database:', contact._id);

    // ✅ Respond to client IMMEDIATELY — don't wait for email
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! I will get back to you soon.',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt
      }
    });

    // Send emails in background (after response is already sent)
    const toMe = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `📬 New Contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <div style="background:#f5f5f5;padding:15px;border-radius:5px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <hr>
        <p style="color:#666;font-size:12px;">Sent from your portfolio contact form</p>
      `
    };

    const autoReply = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting me!',
      text: `Hi ${name},\n\nThank you for reaching out! I have received your message and will get back to you as soon as possible.\n\nBest regards,\nVedant Sonawane`,
      html: `
        <h2>Thank you for contacting me!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out! I will get back to you as soon as possible.</p>
        <p>Best regards,<br><strong>Vedant Sonawane</strong></p>
      `
    };

    sendEmailBackground(toMe, 'Notification email');
    sendEmailBackground(autoReply, `Auto-reply to ${email}`);

    console.log('📨 ===== END =====\n');

  } catch (error) {
    console.error('❌ Contact error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send message.' 
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};