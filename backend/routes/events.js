const express = require('express');
const Event = require('../models/Event');
const router = express.Router();

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Unauthorized' });
};

router.get('/', isAuth, async (req, res) => {
  const { city, date, keyword, status } = req.query;
  const filter = {};
  if (city) filter.city = new RegExp(city, 'i');
  if (date) filter.date = new Date(date);
  if (keyword) filter.title = new RegExp(keyword, 'i');
  if (status) filter.status = status;
  const events = await Event.find(filter);
  res.json(events);
});

router.post('/import', isAuth, async (req, res) => {
  const { eventIds } = req.body;
  await Event.updateMany({ _id: { $in: eventIds } }, { status: 'imported' });
  res.json({ success: true });
});

module.exports = router;
