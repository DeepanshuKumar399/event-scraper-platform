const API_URL = 'http://localhost:3000';

async function loadEvents(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/api/events?${params}`, { credentials: 'include' });
    if (res.status === 401) return window.location.href = 'index.html';
    const events = await res.json();
    const tbody = document.querySelector('#eventsTable tbody');
    
    if (events.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="no-data">No events found</td></tr>';
      return;
    }
    
    tbody.innerHTML = events.map(e => `
      <tr>
        <td><input type="checkbox" class="eventCheck" data-id="${e._id}"></td>
        <td>${e.title}</td>
        <td>${new Date(e.date).toLocaleDateString()}</td>
        <td>${e.city || 'Sydney'}</td>
        <td>${e.location || '-'}</td>
        <td><span class="status ${e.status}">${e.status}</span></td>
        <td>${e.url ? `<a href="${e.url}" target="_blank">View</a>` : '-'}</td>
      </tr>
    `).join('');
    updateSelectedCount();
  } catch (err) {
    console.error('Error loading events:', err);
  }
}

function updateSelectedCount() {
  const count = document.querySelectorAll('.eventCheck:checked').length;
  document.getElementById('selectedCount').textContent = `${count} selected`;
}

document.getElementById('filterBtn').addEventListener('click', () => {
  const filters = {};
  const city = document.getElementById('cityFilter').value;
  const date = document.getElementById('dateFilter').value;
  const keyword = document.getElementById('keywordFilter').value;
  const status = document.getElementById('statusFilter').value;
  if (city) filters.city = city;
  if (date) filters.date = date;
  if (keyword) filters.keyword = keyword;
  if (status) filters.status = status;
  loadEvents(filters);
});

document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('cityFilter').value = 'Sydney';
  document.getElementById('dateFilter').value = '';
  document.getElementById('keywordFilter').value = '';
  document.getElementById('statusFilter').value = '';
  loadEvents();
});

document.getElementById('importBtn').addEventListener('click', async () => {
  const checked = [...document.querySelectorAll('.eventCheck:checked')];
  if (checked.length === 0) return alert('Please select events to import');
  
  const eventIds = checked.map(c => c.dataset.id);
  const res = await fetch(`${API_URL}/api/events/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ eventIds })
  });
  
  if (res.ok) {
    alert('Events imported successfully!');
    loadEvents();
  }
});

document.getElementById('runScraperBtn').addEventListener('click', async () => {
  if (!confirm('Run scraper now? This will update the database.')) return;
  
  document.getElementById('runScraperBtn').disabled = true;
  document.getElementById('runScraperBtn').textContent = 'Running...';
  
  const res = await fetch(`${API_URL}/api/scraper/run`, {
    method: 'POST',
    credentials: 'include'
  });
  
  document.getElementById('runScraperBtn').disabled = false;
  document.getElementById('runScraperBtn').textContent = 'Run Scraper Now';
  
  if (res.ok) {
    alert('Scraper completed!');
    loadEvents();
  } else {
    alert('Scraper failed');
  }
});

document.getElementById('selectAll').addEventListener('change', (e) => {
  document.querySelectorAll('.eventCheck').forEach(c => c.checked = e.target.checked);
  updateSelectedCount();
});

document.addEventListener('change', (e) => {
  if (e.target.classList.contains('eventCheck')) updateSelectedCount();
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  window.location.href = `${API_URL}/auth/logout`;
});

loadEvents();
