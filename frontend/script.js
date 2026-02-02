fetch("http://localhost:5000/events")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("events");
    data.forEach(e => {
      container.innerHTML += `
        <div class="card">
          <h3>${e.title}</h3>
          <p>${e.date}</p>
          <a href="${e.url}" target="_blank">GET TICKETS</a>
        </div>
      `;
    });
  });
