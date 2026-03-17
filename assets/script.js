// assets/script.js

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.id; // 通过 body id 判断当前页面

  if (page === 'shipowners-page') {
    loadJSON('data/shipowners.json', renderOwnersTable);
  } else if (page === 'ships-page') {
    loadJSON('data/ships.json', renderShipsTable);
  }

  function loadJSON(url, callback) {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => callback(data))
      .catch(err => {
        console.error('Error loading data:', err);
        document.querySelector('tbody').innerHTML = '<tr><td colspan="5">Failed to load data.</td></tr>';
      });
  }

  function renderOwnersTable(data) {
    const tbody = document.querySelector('#owners-table tbody');
    const searchInput = document.getElementById('search');

    function render(filteredData) {
      tbody.innerHTML = '';
      filteredData.forEach(item => {
        const row = `<tr>
          <td>${item.company}</td>
          <td>${item.country}</td>
          <td>${item.fleet}</td>
          <td>${item.type}</td>
          <td><a href="${item.website}" target="_blank">link</a></td>
        </tr>`;
        tbody.innerHTML += row;
      });
    }

    render(data);

    if (searchInput) {
      searchInput.addEventListener('input', e => {
        const term = e.target.value.toLowerCase();
        const filtered = data.filter(item =>
          item.company.toLowerCase().includes(term) ||
          item.country.toLowerCase().includes(term)
        );
        render(filtered);
      });
    }
  }

  function renderShipsTable(data) {
    const tbody = document.querySelector('#ships-table tbody');
    const searchInput = document.getElementById('search');

    function render(filteredData) {
      tbody.innerHTML = '';
      filteredData.forEach(item => {
        const row = `<tr>
          <td>${item.name}</td>
          <td>${item.imo}</td>
          <td>${item.owner}</td>
          <td>${item.type}</td>
          <td>${item.dwt}</td>
        </tr>`;
        tbody.innerHTML += row;
      });
    }

    render(data);

    if (searchInput) {
      searchInput.addEventListener('input', e => {
        const term = e.target.value.toLowerCase();
        const filtered = data.filter(item =>
          item.name.toLowerCase().includes(term) ||
          item.owner.toLowerCase().includes(term)
        );
        render(filtered);
      });
    }
  }
});