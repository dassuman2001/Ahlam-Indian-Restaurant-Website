const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();

// Hosting services provide the PORT variable. Fallback to 5000 for local.
const PORT = process.env.PORT || 5000;

//  MONGODB_URI variable.
// Fallback to local DB if not provided.
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://root:root@cluster0.orxbd04.mongodb.net/ahlam_db';

// Middleware
app.use(cors()); // Allow Frontend to talk to Backend
app.use(express.json({ limit: '10mb' })); // Support base64 images

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log(`Connected to MongoDB: ${MONGO_URI.includes('127.0.0.1') ? 'Local' : 'Cloud'}`))
  .catch(err => console.error('Could not connect to MongoDB', err));

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

// To match Frontend 'id' (string) with MongoDB '_id' (ObjectId)
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

// 1. Get Menu
app.get('/api/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Add Menu Item
app.post('/api/menu', async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    const saved = await newItem.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Update Menu Item
app.put('/api/menu/:id', async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Delete Menu Item
app.delete('/api/menu/:id', async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Get Bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Create Booking
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

// 7. Update Booking Status
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));