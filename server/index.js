// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://techlearn-mu.vercel.app/'
  ],
  credentials: true,
}));

app.use(express.json());

// Mount routes
const topicsRouter = require('./routes/topics');
app.use('/api/topics', topicsRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.json({ message: 'TechLearn Server is running' });
});

// Use your Atlas connection string from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully');
  })
  .catch((err) => {
    console.error('MongoDB Atlas connection error:', err.message);
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});