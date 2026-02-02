require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./config/passport');
const cron = require('node-cron');
const { updateDatabase } = require('./scraper/eventScraper');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/scraper', require('./routes/scraper'));

cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled scrape...');
  await updateDatabase();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
