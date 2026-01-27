const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// SECURITY UPDATE: We strictly use the environment variable.
// If this is missing, the app should fail rather than using a hardcoded password.
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("CRITICAL ERROR: MONGODB_URI environment variable is not defined.");
    // We do not exit process here to allow Vercel build to pass, but runtime will fail if not set.
}

app.use(cors({
    origin: '*', 
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Cached connection for Serverless (prevents too many connections in lambda)
let cachedPromise = null;

const connectDB = async () => {
  if (!MONGO_URI) {
      throw new Error("Database URI is missing in environment variables");
  }

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
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
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