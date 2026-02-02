const axios = require('axios');
const cheerio = require('cheerio');
const Event = require('../models/Event');

async function scrapeSydneyEvents() {
  const events = [];
  
  try {
    const { data } = await axios.get('https://www.eventbrite.com.au/d/australia--sydney/events/');
    const $ = cheerio.load(data);
    
    $('.event-card').each((i, el) => {
      const title = $(el).find('.event-title').text().trim();
      const date = $(el).find('.event-date').text().trim();
      const location = $(el).find('.event-location').text().trim();
      const url = $(el).find('a').attr('href');
      
      if (title) {
        events.push({
          title,
          date: new Date(date),
          city: 'Sydney',
          location,
          url,
          status: 'new'
        });
      }
    });
  } catch (err) {
    console.log('Scraping error:', err.message);
  }
  
  return events;
}

async function updateDatabase() {
  const scrapedEvents = await scrapeSydneyEvents();
  
  for (const event of scrapedEvents) {
    const existing = await Event.findOne({ title: event.title, date: event.date });
    
    if (!existing) {
      await Event.create(event);
    } else if (existing.status !== 'imported') {
      existing.status = 'updated';
      await existing.save();
    }
  }
  
  const allEvents = await Event.find({ status: { $ne: 'imported' } });
  const scrapedTitles = scrapedEvents.map(e => e.title);
  
  for (const event of allEvents) {
    if (!scrapedTitles.includes(event.title)) {
      event.status = 'inactive';
      await event.save();
    }
  }
}

module.exports = { scrapeSydneyEvents, updateDatabase };
