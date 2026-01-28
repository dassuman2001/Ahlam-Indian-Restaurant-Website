const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://root:root@cluster0.orxbd04.mongodb.net/ahlam_db';

// --- Email Configuration ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // Your App Password
  }
});

const sendEmail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("EMAIL SKIPPED: Missing EMAIL_USER or EMAIL_PASS in environment variables.");
    return;
  }
  try {
    await transporter.sendMail({
      from: `"Ahlam Restaurant" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
  }
};

app.use(cors({
    origin: '*', 
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Cached connection for Serverless
let cachedPromise = null;

const connectDB = async () => {
  if (cachedPromise) {
    return cachedPromise;
  }
  
  cachedPromise = mongoose.connect(MONGO_URI)
    .then((mongoose) => {
        console.log('MongoDB Connected');
        return mongoose;
    });
  return cachedPromise;
};

// Middleware to ensure DB is connected on every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// --- Schemas ---

const MenuSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
  image: String,
  category: String,
  isVegan: Boolean,
  isChefSpecial: Boolean,
});

MenuSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

const BookingSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  date: String,
  time: String,
  guests: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Number, default: Date.now }
});

BookingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

const MenuItem = mongoose.model('MenuItem', MenuSchema);
const Booking = mongoose.model('Booking', BookingSchema);

// --- Routes ---

app.get('/', (req, res) => {
    res.send('Ahlam Restaurant API is running');
});

app.get('/api/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/menu', async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    const saved = await newItem.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/menu/:id', async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/menu/:id', async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const saved = await newBooking.save();
    console.log(`[New Booking] ${saved.fullName} for ${saved.guests} guests.`);

    // NOTE: Removed Admin Email Notification as requested.
    // The Admin will now rely on the Dashboard Notification Sound.

    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });

    // Notify USER via Email if status changed
    if (updated && updated.email) {
      let subject = "";
      let message = "";

      if (status === 'confirmed') {
        subject = "Booking Confirmed - Ahlam Restaurant";
        message = `
          <h3>Your Booking is Confirmed</h3>
          <p>Dear ${updated.fullName},</p>
          <p>We look forward to welcoming you.</p>
          <p><strong>Date:</strong> ${updated.date} at ${updated.time}</p>
          <p><strong>Guests:</strong> ${updated.guests}</p>
          <p>Address: 217 Streatham High Rd, London SW16 6EG</p>
        `;
      } else if (status === 'declined') {
        subject = "Update regarding your booking - Ahlam Restaurant";
        message = `
          <h3>Booking Status Update</h3>
          <p>Dear ${updated.fullName},</p>
          <p>Unfortunately, we cannot fulfill your request for ${updated.date} at ${updated.time}.</p>
          <p>Please call us at +44 20 3011 3039 to arrange an alternative time.</p>
        `;
      }

      if (subject) {
        await sendEmail(updated.email, subject, message);
      }
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the app for Vercel
module.exports = app;

// Only run the server if executed directly (Local Development)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}