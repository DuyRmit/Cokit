/* CoKit shell: đọc window.COKIT_FEATURES (features/registry.js) và tự dựng tab, card, iframe. */
(function () {
  const features = window.COKIT_FEATURES || [];
  const nav = document.getElementById('nav');
  const cards = document.getElementById('cards');
  const frames = document.getElementById('frames');
  const home = document.getElementById('home');

  // Tab Home + tab từng feature
  nav.innerHTML =
    '<a href="#home" data-id="home"><span class="ic" style="background:#fdeaea">🏠</span>Home</a><span class="sep"></span>' +
    features.map(f => `<a href="#${f.id}" data-id="${f.id}"><span class="ic" style="background:${f.color || '#eef0f6'}">${f.icon || '🧩'}</span>${f.name}</a>`).join('');

  // Card ở Home
  cards.innerHTML = features.map(f =>
    `<a class="card" href="#${f.id}"><div class="ic" style="background:${f.color || '#eef0f6'}">${f.icon || '🧩'}</div><h3>${f.name}</h3><p>${f.description || ''}</p></a>`
  ).join('');

  function show(id) {
    const f = features.find(x => x.id === id);
    if (!f) id = 'home';
    home.classList.toggle('on', id === 'home');
    nav.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.id === id));
    frames.querySelectorAll('.frame').forEach(fr => fr.classList.toggle('on', fr.dataset.id === id));
    if (f && !frames.querySelector(`[data-id="${id}"]`)) {   // lazy-load lần đầu mở tab
      const fr = document.createElement('iframe');
      fr.className = 'frame on';
      fr.dataset.id = id;
      fr.title = f.name;
      fr.setAttribute('allow', 'clipboard-write; clipboard-read');
      fr.src = f.path;
      frames.appendChild(fr);
    }
    document.title = (f ? f.name + ' — ' : '') + 'CoKit';
  }

  window.addEventListener('hashchange', () => show(location.hash.slice(1) || 'home'));
  show(location.hash.slice(1) || 'home');
})();
