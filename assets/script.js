// assets/script.js
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.id;
  // 预加载JSON数据（优化加载体验）
  const preloadJSON = (url) => {
    return fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .catch(err => {
        console.error('Preload error:', err);
        return null;
      });
  };

  // 懒加载表格渲染
  const lazyRender = async (url, renderFn) => {
    const data = await preloadJSON(url);
    if (data) {
      renderFn(data);
    } else {
      const tbody = document.querySelector('tbody');
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="5" class="error-msg">Failed to load data. Please try again later.</td></tr>';
      }
    }
  };

  // 统一搜索逻辑（复用函数减少冗余）
  const initSearch = (searchId, data, filterFn, renderFn) => {
    const searchInput = document.getElementById(searchId);
    if (!searchInput || !data) return;

    // 防抖优化（避免频繁触发）
    let debounceTimer;
    searchInput.addEventListener('input', e => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const term = e.target.value.toLowerCase().trim();
        const filtered = term ? data.filter(filterFn(term)) : data;
        renderFn(filtered);
      }, 300);
    });

    // 回车清空搜索
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') e.preventDefault();
      if (e.key === 'Escape') searchInput.value = '';
    });
  };

  // 船东表格渲染
  const renderOwnersTable = (data) => {
    const tbody = document.querySelector('#owners-table tbody');
    if (!tbody) return;

    const render = (filteredData) => {
      tbody.innerHTML = '';
      if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No shipowners found matching your search.</td></tr>';
        return;
      }
      // 批量插入DOM（优化性能）
      const rows = filteredData.map(item => `
        <tr>
          <td>${item.company}</td>
          <td>${item.country}</td>
          <td>${item.fleet}</td>
          <td>${item.type}</td>
          <td><a href="${item.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></td>
        </tr>
      `).join('');
      tbody.innerHTML = rows;
    };

    render(data);
    // 初始化搜索
    initSearch('search', data, (term) => (item) => 
      item.company.toLowerCase().includes(term) || item.country.toLowerCase().includes(term),
    render);
  };

  // 船舶表格渲染
  const renderShipsTable = (data) => {
    const tbody = document.querySelector('#ships-table tbody');
    if (!tbody) return;

    const render = (filteredData) => {
      tbody.innerHTML = '';
      if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No ships found matching your search.</td></tr>';
        return;
      }
      // 批量插入DOM
      const rows = filteredData.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.imo}</td>
          <td>${item.owner}</td>
          <td>${item.type}</td>
          <td>${item.dwt.toLocaleString()}</td>
        </tr>
      `).join('');
      tbody.innerHTML = rows;
    };

    render(data);
    // 初始化搜索
    initSearch('search', data, (term) => (item) => 
      item.name.toLowerCase().includes(term) || item.owner.toLowerCase().includes(term),
    render);
  };

  // 页面初始化
  if (page === 'shipowners-page') {
    lazyRender('data/shipowners.json', renderOwnersTable);
  } else if (page === 'ships-page') {
    lazyRender('data/ships.json', renderShipsTable);
  }
});
