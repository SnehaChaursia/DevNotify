const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  tags: [String],
  teamSize: { type: String },
  difficulty: { type: String },
  isSaved: { type: Boolean, default: false },
  description: { type: String, required: true },
  organizer: { type: String, required: true },
  website: { type: String, required: true },
  prizes: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
