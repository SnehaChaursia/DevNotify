const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET /events → get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// ✅ DEV BYPASS middleware (replace real auth for now)
const adminBypassMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  if (token !== "yes") {
    return res.status(403).json({ error: "Invalid admin token" });
  }

  next();
};

// POST /events → create a new event
router.post('/', adminBypassMiddleware, async (req, res) => {
  const {
    name,
    type,
    date,
    duration,
    location,
    tags,
    teamSize,
    difficulty,
    isSaved,
    description,
    organizer,
    website,
    prizes
  } = req.body;

  try {
    const newEvent = new Event({
      name,
      type,
      date,
      duration,
      location,
      tags,
      teamSize,
      difficulty,
      isSaved,
      description,
      organizer,
      website,
      prizes
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create event' });
  }
});

module.exports = router;
