const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeEvents() {
  const url = "https://www.eventbrite.com.au/d/australia--sydney/events/";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  let events = [];

  $(".search-event-card-wrapper").each((i, el) => {
    const title = $(el).find("h3").text().trim();
    const date = $(el).find("time").text().trim();
    const link = $(el).find("a").attr("href");

    events.push({
      title,
      date,
      city: "Sydney",
      source: "Eventbrite",
      url: link,
      lastScraped: new Date()
    });
  });

  console.log(events);
}

scrapeEvents();
