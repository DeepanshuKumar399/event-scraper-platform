const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect(process.env.CLIENT_URL + '/dashboard.html');
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(process.env.CLIENT_URL);
  });
});

router.get('/user', (req, res) => {
  res.json(req.user || null);
});

module.exports = router;
