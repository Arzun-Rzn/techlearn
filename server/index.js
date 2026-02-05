const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',       // local frontend
    'https://techlearn-mu.vercel.app'  // deployed frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // optional
}));

app.use(express.json());

// Mount routes
const topicsRouter = require('./routes/topics');
app.use('/api/topics', topicsRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'TechLearn Server is running' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully'))
  .catch(err => console.error('MongoDB Atlas connection error:', err.message));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
