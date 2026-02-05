// server/routes/topics.js (updated)
const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const authMiddleware = require('../middleware/authMiddleware');

// GET all topics (public)
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single topic (public)
router.get('/:slug', async (req, res) => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new topic (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const topic = new Topic(req.body);
    await topic.save();
    res.status(201).json(topic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update topic (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    res.json(topic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE topic (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    res.json({ message: 'Topic deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;