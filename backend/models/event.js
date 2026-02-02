const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  city: { type: String, default: 'Sydney' },
  location: String,
  description: String,
  url: String,
  status: { type: String, enum: ['new', 'updated', 'inactive', 'imported'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

eventSchema.index({ title: 1, date: 1 });

module.exports = mongoose.model('Event', eventSchema);
