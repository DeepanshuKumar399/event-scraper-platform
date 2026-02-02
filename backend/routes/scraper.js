const express = require('express');
const { updateDatabase } = require('../scraper/eventScraper');
const router = express.Router();

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Unauthorized' });
};

router.post('/run', isAuth, async (req, res) => {
  try {
    await updateDatabase();
    res.json({ success: true, message: 'Scraper completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
