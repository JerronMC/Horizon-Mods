/* Horizon Mods — fan-made community demo
 * Static-host friendly. Accounts and uploads live in this browser's IndexedDB only.
 * A real shared registry requires a trusted server/backend; see README.md.
 */
(() => {
  'use strict';

  const DB_NAME = 'horizon-mods-community';
  const DB_VERSION = 1;
  const MAX_PROJECT_BYTES = 64 * 1024 * 1024;
  const MAX_ICON_BYTES = 256 * 1024;
  const MAX_SCREENSHOT_BYTES = 1024 * 1024;
  const MAX_SCREENSHOTS = 8;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const iconPaths = {
    house: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z"/>',
    'plus-square': '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/>',
    'user-round': '<circle cx="12" cy="8" r="4"/><path d="M5 21v-1a7 7 0 0 1 14 0v1"/>',
    'sun-moon': '<path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4m0-12.8L17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="4"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
    'search-x': '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5m-7.5-10-4 4m0-4 4 4"/>',
    'arrow-up-right': '<path d="M7 17 17 7M7 7h10v10"/>',
    'arrow-right': '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    upload: '<path d="M12 16V4m-5 5 5-5 5 5"/><path d="M4 16v4h16v-4"/>',
    'shield-check': '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    package: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    blocks: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/>',
    'cloud-upload': '<path d="M20 16.2A4.8 4.8 0 0 0 18 7h-1.3A7 7 0 1 0 5 17h2"/><path d="M12 12v9m-4-5 4-4 4 4"/>',
    'wand-sparkles': '<path d="m15 4 5 5M4 20 17 7"/><path d="m5 7 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Zm12 8 1.2 2.3L20 18.5l-1.8.8L17 22l-1.2-2.7-1.8-.8 2.8-1.2L17 15Z"/>',
    'file-up': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M12 18v-6m-3 3 3-3 3 3"/>',
    'image-plus': '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21m14-8v6m-3-3h6"/>',
    images: '<rect x="3" y="3" width="14" height="14" rx="2"/><path d="m3 13 4-4 3 3 2-2 5 5"/><path d="M8 21h11a2 2 0 0 0 2-2V8"/>',
    github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.1-1.5 6.1-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6S17.5 1.2 14 3.5a13.3 13.3 0 0 0-7 0C3.5 1.2 2.3 1.5 2.3 1.5a4.8 4.8 0 0 0-.1 3.6A5.2 5.2 0 0 0 .8 8.7c0 5.2 3.1 6.4 6.1 6.7A3.4 3.4 0 0 0 6 18.1V22" transform="translate(2 0)"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'grid-2x2': '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
    box: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/>',
    'code-2': '<path d="m8 17-5-5 5-5m8 10 5-5-5-5m-2-7-4 20"/>',
    boxes: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/><path d="m7 5.8 10 5.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 22a10 10 0 1 1 10-10c0 1.7-1.3 3-3 3h-1.8a1.2 1.2 0 0 0-.9 2c.6.7.8 1.2.7 2-.2 1.8-1.8 3-5 3Z"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/>',
    'package-open': '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9m-6-12 12-6"/>',
    zap: '<path d="m13 2-3 9h7l-6 11 1-9H5l8-11Z"/>',
    'hard-drive': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 15h.01M11 15h.01M3 10h18"/>',
    'badge-check': '<path d="M12 3 15 5l4-.1.7 3.8 2.3 3.3-2.3 3.3-.7 3.8-4-.1-3 2-3-2-4 .1-.7-3.8L2 12l2.3-3.3L5 4.9l4 .1 3-2Z"/><path d="m8.5 12 2.3 2.3 4.7-4.7"/>',
    'log-in': '<path d="M10 17 15 12 10 7m5 5H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',
    'log-out': '<path d="m14 7 5 5-5 5m5-5H9"/><path d="M13 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/>',
    'lock-keyhole': '<circle cx="12" cy="16" r="1"/><path d="M5 10h14v11H5zM8 10V7a4 4 0 1 1 8 0v3"/>',
    x: '<path d="m18 6-12 12M6 6l12 12"/>',
    'upload-cloud': '<path d="M20 16.2A4.8 4.8 0 0 0 18 7h-1.3A7 7 0 1 0 5 17h2"/><path d="M12 21v-9m-4 4 4-4 4 4"/>',
    'external-link': '<path d="M14 3h7v7m0-7L10 14"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5"/><path d="M4 19v2h16v-2"/>',
    'calendar-days': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8m-8 4h8"/>'
  };
  const icon = (name, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.package}</svg>`;
  $$('[data-icon]').forEach(node => { node.innerHTML = icon(node.dataset.icon); });

  const demoProjects = [
    {id:'zoom',name:'Zoom',kind:'Native mod',version:'2.0.0',author:'Horizon',summary:'Hold a key to zoom in; use the mouse wheel to zoom further while you hold it.',categories:['Utility'],tags:['zoom','camera','native mod'],theme:'cover-cyan',origin:'registry',source:'https://playhorizon.dev/mods',description:'A Horizon native mod that lets you zoom in while holding a key. This is a reference listing from the official Horizon registry.'},
    {id:'fps-counter',name:'FPS Counter',kind:'Native mod',version:'2.0.0',author:'Horizon',summary:'Shows your frame rate, including the minimum and 1% low FPS.',categories:['Utility','Optimization'],tags:['fps','performance','hud'],theme:'cover-green',origin:'registry',source:'https://playhorizon.dev/mods',description:'A performance HUD for Horizon. This is a reference listing from the official Horizon registry.'},
    {id:'wisdom-shaders-v3-lite',name:'Wisdom Shaders V3 Lite',kind:'Shader pack',version:'1.3.7',author:'bobcao3, tomasmendes01',summary:'A lighter Wisdom Shaders V3 port for Horizon, designed for more FPS.',categories:['Visuals','Optimization'],tags:['shader','visuals','lite'],theme:'cover-pink',origin:'registry',source:'https://playhorizon.dev/mods',description:'A lightweight Horizon port of Wisdom Shaders V3. This is a reference listing from the official Horizon registry.'},
    {id:'daybreak',name:'Daybreak',kind:'Shader pack',version:'0.2.0',author:'hildlabs',summary:'Sun shadows, reflective water, waving plants and coloured light, tuned for low GPU cost.',categories:['Visuals','Optimization'],tags:['shader','water','shadows'],theme:'cover-amber',origin:'registry',source:'https://playhorizon.dev/mods',description:'A shader pack designed to balance atmospheric visuals with performance. This is a reference listing from the official Horizon registry.'}
  ];

  let db;
  const blobUrlCache = new WeakMap();
  let currentUser = null;
  let localProjects = [];
  let homeFilter = 'All';
  let discoveryType = 'All';
  let discoverySearchTerm = '';
  let afterAuth = null;
  let authMode = 'signin';
  let currentIconBlob = null;
  let screenshotBlobs = [];
  let projectFileBlob = null;
  let screenshotUrls = [];

  function openDatabase() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) return reject(new Error('This browser does not support local project storage.'));
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains('users')) database.createObjectStore('users', {keyPath:'username'});
        if (!database.objectStoreNames.contains('projects')) database.createObjectStore('projects', {keyPath:'id'});
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Could not open local storage.'));
      request.onblocked = () => reject(new Error('Local storage is blocked by another browser tab.'));
    });
  }
  function storeRequest(store, mode, action) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, mode);
      const req = action(tx.objectStore(store));
      let result;
      req.onsuccess = () => { result = req.result; };
      req.onerror = () => reject(req.error || new Error('Storage request failed.'));
      tx.oncomplete = () => resolve(result);
      tx.onabort = () => reject(tx.error || new Error('Storage transaction failed.'));
      tx.onerror = () => reject(tx.error || new Error('Storage transaction failed.'));
    });
  }
  const getAll = store => storeRequest(store, 'readonly', s => s.getAll());
  const getOne = (store, key) => storeRequest(store, 'readonly', s => s.get(key));
  const putOne = (store, value) => storeRequest(store, 'readwrite', s => s.put(value));

  function bytesToBase64(bytes) { let binary=''; bytes.forEach(byte => binary += String.fromCharCode(byte)); return btoa(binary); }
  function base64ToBytes(value) { return Uint8Array.from(atob(value), c => c.charCodeAt(0)); }
  async function passwordDigest(password, saltBytes) {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({name:'PBKDF2', salt:saltBytes, iterations:150000, hash:'SHA-256'}, material, 256);
    return new Uint8Array(bits);
  }
  function objectUrl(blob) { if (!blob) return ''; let url = blobUrlCache.get(blob); if (!url) { url = URL.createObjectURL(blob); blobUrlCache.set(blob,url); } return url; }
  function safeText(value='') { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
  function showToast(message, type='success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    $('#toastRegion').append(toast);
    window.setTimeout(() => toast.remove(), 3400);
  }
  function switchView(view) {
    const allowed = ['home','discovery','post','profile'];
    if (!allowed.includes(view)) view = 'home';
    $$('.view').forEach(section => section.classList.toggle('active', section.id === `view-${view}`));
    $$('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === view));
    if (view === 'post' && !currentUser) {
      openAuth('signin', () => { showToast('You can now finish your project post.'); });
    }
    if (view === 'profile') renderProfile();
    if (view === 'discovery') renderDiscovery();
    window.scrollTo({top:0,behavior:'smooth'});
    $('#mobileMenuButton')?.setAttribute('aria-label', 'Open navigation');
  }
  function setAccountUI() {
    const label = currentUser ? currentUser.username : 'Sign in';
    $('#accountButtonText').textContent = label;
    $('#accountAvatar').textContent = currentUser ? currentUser.username.charAt(0).toUpperCase() : 'J';
    $('#profileName').textContent = currentUser?.username || 'Creator';
    $('#profileEmail').textContent = currentUser?.email || 'creator@example.com';
    $('#profileBigAvatar').textContent = currentUser ? currentUser.username.charAt(0).toUpperCase() : 'J';
    $('#profileLoggedOut').classList.toggle('hidden', Boolean(currentUser));
    $('#profileLoggedIn').classList.toggle('hidden', !currentUser);
  }
  async function refreshProjects() {
    localProjects = (await getAll('projects')).sort((a,b) => (b.publishedAt || 0) - (a.publishedAt || 0));
    renderHome();
    renderDiscovery();
    if (currentUser) renderProfile();
  }
  function mergedProjects() { return [...localProjects.map(p => ({...p, origin:'local'})), ...demoProjects]; }
  function iconMarkup(project, small=false) {
    if (project.iconBlob) {
      const url = objectUrl(project.iconBlob);
      return `<img src="${url}" alt="${safeText(project.name)} icon">`;
    }
    const name = project.kind === 'Shader pack' ? 'sun' : project.kind === 'Native mod' ? 'code-2' : project.kind === 'Resource pack' ? 'palette' : 'package';
    return icon(name);
  }
  function projectCard(project, index=0) {
    const local = project.origin === 'local';
    const author = project.authors || project.author || 'Community creator';
    const kindShort = project.kind === 'Native mod' ? 'NATIVE MOD' : project.kind.toUpperCase();
    const published = local ? '<span class="project-published">PUBLISHED</span>' : '';
    const actionText = local ? 'View details' : 'Official registry';
    const version = project.version || '1.0.0';
    return `<article class="project-card" data-project-card="${safeText(project.id)}">
      <div class="project-cover ${project.theme || ['','cover-cyan','cover-pink','cover-green','cover-amber'][index%5]}"><span class="type-tag">${safeText(kindShort)}</span>${published}<div class="project-icon">${iconMarkup(project)}</div></div>
      <div class="project-card-body"><div class="project-card-title-row"><div><h3>${safeText(project.name)}</h3><div class="project-id">${safeText(project.projectId || project.id)}</div></div></div>
      <p class="project-summary">${safeText(project.summary)}</p>
      <div class="project-card-meta"><span class="project-author"><span class="author-dot">${safeText(author.charAt(0).toUpperCase())}</span><span>${safeText(author)}</span></span><span class="project-version">v${safeText(version)}</span></div>
      <div class="project-card-actions"><button class="button button-secondary" data-open-project="${safeText(project.id)}" data-origin="${local?'local':'registry'}">${icon('eye')}${actionText}</button>${local ? `<button class="button button-primary" data-download-project="${safeText(project.id)}">${icon('download')}Download</button>` : `<button class="button button-primary" data-open-registry>${icon('arrow-up-right')}Browse</button>`}</div></div></article>`;
  }
  function renderHome() {
    const query = ($('#homeSearch').value || '').trim().toLowerCase();
    const projects = mergedProjects().filter(p => (homeFilter === 'All' || p.kind === homeFilter) && (!query || [p.name,p.summary,p.id,p.authors,p.author,(p.tags||[]).join(' ')].join(' ').toLowerCase().includes(query)));
    $('#homeProjectGrid').innerHTML = projects.map(projectCard).join('');
    $('#homeEmpty').classList.toggle('hidden', projects.length > 0);
    $('#statProjects').textContent = String(localProjects.length + demoProjects.length);
    $('#statCreators').textContent = String(new Set(localProjects.map(p=>p.owner)).size);
    $('#countAll').textContent = String(mergedProjects().length);
  }
  function renderDiscovery() {
    const sort = $('#sortSelect')?.value || 'popular';
    const checkedCats = $$('#categoryFilters input:checked').map(input => input.value);
    const projects = mergedProjects().filter(project => {
      const searchable = [project.name,project.summary,project.id,project.authors,project.author,(project.tags||[]).join(' ')].join(' ').toLowerCase();
      return (discoveryType === 'All' || project.kind === discoveryType) && (!discoverySearchTerm || searchable.includes(discoverySearchTerm)) && (!checkedCats.length || checkedCats.some(cat => (project.categories || []).includes(cat)));
    });
    if (sort === 'name') projects.sort((a,b)=>a.name.localeCompare(b.name));
    if (sort === 'newest') projects.sort((a,b)=>(b.publishedAt||0)-(a.publishedAt||0));
    if (sort === 'popular') projects.sort((a,b)=> (a.origin==='local'?1:0)-(b.origin==='local'?1:0));
    $('#discoveryProjectGrid').innerHTML = projects.map(projectCard).join('');
    $('#resultsCount').textContent = `${projects.length} project${projects.length===1?'':'s'}`;
    $('#discoveryEmpty').classList.toggle('hidden', projects.length>0);
    $('#countAll').textContent = String(mergedProjects().length);
  }
  async function renderProfile() {
    setAccountUI();
    if (!currentUser) return;
    const mine = localProjects.filter(project => project.owner === currentUser.username);
    $('#profileProjectCount').textContent = String(mine.length);
    $('#profileProjectGrid').innerHTML = mine.map(projectCard).join('');
    $('#profileEmpty').classList.toggle('hidden', mine.length>0);
  }
  function openAuth(mode='signin', callback=null) {
    authMode = mode;
    afterAuth = callback;
    $('#authError').textContent = '';
    $('#authForm').reset();
    updateAuthMode();
    $('#authModal').classList.remove('hidden');
  }
  function closeModal(modal) { modal.classList.add('hidden'); }
  function updateAuthMode() {
    $$('.auth-tab').forEach(tab => tab.classList.toggle('active',tab.dataset.authTab===authMode));
    $('#authUsernameField').classList.toggle('hidden',authMode==='signin');
    $('#authUsername').required = authMode === 'signup';
    $('#authSubmit').textContent = authMode==='signin' ? 'Sign in' : 'Create local account';
    $('#authPassword').autocomplete = authMode==='signin' ? 'current-password' : 'new-password';
    $('#authModalTitle').textContent = authMode==='signin' ? 'Welcome back' : 'Create your account';
  }
  async function handleAuthSubmit(event) {
    event.preventDefault();
    const email = $('#authEmail').value.trim().toLowerCase();
    const password = $('#authPassword').value;
    const username = $('#authUsername').value.trim().replace(/\s+/g,'');
    const error = $('#authError');
    error.textContent = '';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { error.textContent='Enter a valid email address.'; return; }
    if (password.length < 8) { error.textContent='Use a password with at least 8 characters.'; return; }
    if (!crypto?.subtle) { error.textContent='Secure browser cryptography is not available. Use a modern browser over HTTPS.'; return; }
    const submit = $('#authSubmit'); submit.disabled=true; submit.textContent='Please wait…';
    try {
      if (authMode === 'signup') {
        if (!/^[A-Za-z0-9_ -]{3,24}$/.test(username)) throw new Error('Username must be 3–24 letters, numbers, spaces, or underscores.');
        const key = username.toLowerCase().replace(/\s/g,'');
        const users = await getAll('users');
        if (users.some(user => user.username === key)) throw new Error('That username is already taken on this browser.');
        if (users.some(user => user.email === email)) throw new Error('An account with that email already exists on this browser.');
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const digest = await passwordDigest(password,salt);
        const user = {username:key, displayName:username, email, salt:bytesToBase64(salt), passwordHash:bytesToBase64(digest), createdAt:Date.now()};
        await putOne('users',user);
        currentUser = {username:key, displayName:username, email};
      } else {
        const users = await getAll('users');
        const user = users.find(item => item.email === email);
        if (!user) throw new Error('No local account with that email. Create an account first.');
        const digest = await passwordDigest(password,base64ToBytes(user.salt));
        const expected = base64ToBytes(user.passwordHash);
        if (digest.length !== expected.length || !digest.every((value,index)=>value===expected[index])) throw new Error('The email or password is incorrect.');
        currentUser = {username:user.username, displayName:user.displayName || user.username, email:user.email};
      }
      localStorage.setItem('horizon-mods-session',JSON.stringify(currentUser));
      setAccountUI();
      closeModal($('#authModal'));
      showToast(authMode==='signup'?'Your local creator account is ready.':'You are signed in.');
      await renderProfile();
      if (afterAuth) { const cb=afterAuth; afterAuth=null; cb(); }
      if ($('#view-post').classList.contains('active')) $('#projectAuthors').value = currentUser.displayName || currentUser.username;
      renderLivePreview();
    } catch (err) {
      error.textContent = err.message || 'Unable to sign in right now.';
    } finally {
      submit.disabled=false;
      updateAuthMode();
    }
  }
  function logout() {
    currentUser = null;
    localStorage.removeItem('horizon-mods-session');
    setAccountUI();
    renderHome();
    showToast('You have signed out.');
    switchView('profile');
  }
  function selectedCategories() { return $$('#projectCategories input:checked').map(input=>input.value); }
  function renderLivePreview() {
    $('#liveNamePreview').textContent = $('#projectName').value.trim() || 'My Mod';
    $('#liveKindPreview').textContent = $('#projectKind').value;
    $('#liveVersionPreview').textContent = $('#projectVersion').value.trim() || '1.0.0';
    $('#liveSummaryPreview').textContent = $('#projectSummary').value.trim() || 'Your project summary will appear here.';
    $('#liveAuthorPreview').textContent = $('#projectAuthors').value.trim() || currentUser?.displayName || 'Creator';
    const holder = $('#liveIconPreview');
    holder.innerHTML = currentIconBlob ? `<img src="${objectUrl(currentIconBlob)}" alt="Project icon preview">` : icon('package');
  }
  function getAcceptForKind(kind) {
    return ({'Mod':'.hmod','Native mod':'.hnmod','Modpack':'.hpack','Shader pack':'.hshader','Compatible shader pack':'.zip','Resource pack':'.zip','Data pack':'.zip'})[kind] || '*';
  }
  function validateZip(file, kind) {
    return new Promise(async (resolve,reject) => {
      try {
        const buffer = await file.slice(Math.max(0,file.size-65557),file.size).arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const view = new DataView(buffer);
        let eocd = -1;
        for (let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--) {
          if (view.getUint32(i,true)===0x06054b50) {eocd=i;break;}
        }
        if (eocd<0) return reject(new Error('This ZIP file does not have a valid end-of-directory record.'));
        const entryCount = view.getUint16(eocd+10,true);
        const centralSize = view.getUint32(eocd+12,true);
        const centralOffset = view.getUint32(eocd+16,true);
        if (!entryCount || entryCount>50000 || centralSize===0 || centralOffset+centralSize>file.size) return reject(new Error('This ZIP archive appears to be empty or malformed.'));
        const cdStart = centralOffset;
        const cdBuffer = await file.slice(cdStart,cdStart+centralSize).arrayBuffer();
        const cd = new DataView(cdBuffer);
        const decoder = new TextDecoder();
        let pos=0; const names=[];
        while (pos+46<=cd.byteLength && names.length<entryCount) {
          if (cd.getUint32(pos,true)!==0x02014b50) break;
          const nameLen=cd.getUint16(pos+28,true), extraLen=cd.getUint16(pos+30,true), commentLen=cd.getUint16(pos+32,true);
          if (pos+46+nameLen+extraLen+commentLen>cd.byteLength) break;
          names.push(decoder.decode(new Uint8Array(cdBuffer,pos+46,nameLen)).replace(/\\/g,'/'));
          pos += 46+nameLen+extraLen+commentLen;
        }
        if (!names.length) return reject(new Error('Could not read file names inside this ZIP archive.'));
        const lower=names.map(n=>n.toLowerCase());
        if (kind==='Mod' && !(lower.includes('horizon-mod.toml') && lower.some(n=>n.startsWith('assets/')) && lower.some(n=>n.startsWith('data/')))) return reject(new Error('Content .hmod files need horizon-mod.toml plus assets/ and data/ folders at the archive root.'));
        if (kind==='Modpack' && !lower.includes('horizon-modpack.toml')) return reject(new Error('Modpack .hpack files must contain horizon-modpack.toml at the archive root.'));
        if (kind==='Data pack' && !(lower.includes('pack.mcmeta') && lower.some(n=>n.startsWith('data/')))) return reject(new Error('Data pack ZIP needs pack.mcmeta and a data/ folder at its root.'));
        if (kind==='Compatible shader pack' && !lower.some(n=>n.startsWith('shaders/'))) return reject(new Error('Compatible shader ZIP needs a shaders/ folder at its root.'));
        if (kind==='Resource pack' && !lower.includes('pack.mcmeta')) return reject(new Error('Resource pack ZIP needs pack.mcmeta at the archive root.'));
        resolve({entryCount,names});
      } catch (err) { reject(new Error('Could not inspect this ZIP file. Please try another valid ZIP.')); }
    });
  }
  async function validateProjectFile(file,kind) {
    if (!file) throw new Error('Choose a project file to upload.');
    if (file.size===0) throw new Error('The selected file is empty.');
    if (file.size>MAX_PROJECT_BYTES) throw new Error('Project file is larger than 64 MB.');
    const extension=getAcceptForKind(kind);
    if (!file.name.toLowerCase().endsWith(extension)) throw new Error(`For ${kind}, select a ${extension} file.`);
    if (extension==='.zip' || extension==='.hpack' || extension==='.hmod') await validateZip(file,kind);
    else {
      const header=new Uint8Array(await file.slice(0,4).arrayBuffer());
      if (header.length<4) throw new Error('This project file is too small to be valid.');
      if (extension==='.hpack' && !(header[0]===0x50 && header[1]===0x4b)) throw new Error('This .hpack file does not look like a ZIP-based archive.');
    }
    return true;
  }
  async function validateImage(file,kind) {
    if (!file) throw new Error(kind==='icon'?'Upload a project icon.':'Select a screenshot.');
    if (kind==='icon') {
      if (file.type!=='image/png' || !file.name.toLowerCase().endsWith('.png')) throw new Error('Project icon must be a PNG file.');
      if (file.size>MAX_ICON_BYTES) throw new Error('Project icon must be 256 KiB or smaller.');
    } else {
      if (!['image/png','image/jpeg'].includes(file.type)) throw new Error('Screenshots must be PNG or JPEG images.');
      if (file.size>MAX_SCREENSHOT_BYTES) throw new Error(`${file.name} is larger than 1 MiB.`);
    }
    let bitmap;
    try { bitmap=await createImageBitmap(file); } catch { throw new Error(`${file.name} is not a readable image.`); }
    const {width,height}=bitmap; bitmap.close();
    if (kind==='icon') {
      if (width<64 || height<64 || width>1024 || height>1024 || width!==height) throw new Error('Icon must be square and between 64×64 and 1024×1024 pixels.');
    } else if (width<320 || height<180 || width>3840 || height>2160) throw new Error(`${file.name} must be between 320×180 and 3840×2160 pixels.`);
    return {width,height};
  }
  function bindDropZone(zone,input,callback) {
    if (!zone) return;
    ['dragenter','dragover'].forEach(eventName=>zone.addEventListener(eventName,event=>{event.preventDefault();zone.classList.add('dragover');}));
    ['dragleave','drop'].forEach(eventName=>zone.addEventListener(eventName,event=>{event.preventDefault();zone.classList.remove('dragover');}));
    zone.addEventListener('drop',event=>{if(event.dataTransfer?.files?.length){const dt=new DataTransfer();[...event.dataTransfer.files].forEach(f=>dt.items.add(f));input.files=dt.files;callback();}});
  }
  function resetPostForm() {
    $('#publishForm').reset();
    $('#projectId').value='my_mod';$('#projectVersion').value='1.0.0';$('#minecraftVersion').value='26.3';$('#projectAuthors').value=currentUser?.displayName||currentUser?.username||'JerronMC';
    $('#changelog').value='Initial release.\n\n- Added new features.\n- Improved performance.\n- Fixed known issues.\n- Added compatibility improvements.';
    $('#projectDescription').value='# My Mod\n\nWelcome to My Mod!\n\nA Minecraft modification designed to improve your gameplay with new features, enhancements and optimizations.\n\n## Features\n\n- New gameplay features\n- Improved performance\n- Optimized resource usage\n- Smooth gameplay experience\n- Easy installation\n- Horizon compatibility\n\n## How to Install\n\n1. Download the file.\n2. Open Horizon.\n3. Import the downloaded file.\n4. Enable the mod or pack.\n5. Launch Minecraft.\n\n## Compatibility\n\n- Minecraft: 26.3\n- Launcher: Horizon\n\n## Requirements\n\n- Horizon Launcher\n- Compatible Minecraft version\n\n## Credits\n\nCreated by JerronMC.\n\n## Version\n\n1.0.0 — Initial Release';
    currentIconBlob=null;screenshotBlobs=[];projectFileBlob=null;
    $('#projectFileName').textContent='No file selected';$('#projectIconName').textContent='Choose PNG';$('#screenshotsName').textContent='0 selected';$('#screenshotPreview').innerHTML='';$('#publishError').textContent='';
    $('#projectIconZone').classList.remove('has-file');$('#projectFileZone').classList.remove('has-file');$('#screenshotsZone').classList.remove('has-file');
    $('#summaryCount').textContent='0';
    renderLivePreview();
  }
  async function handlePublish(event) {
    event.preventDefault();
    const error=$('#publishError');error.textContent='';
    if (!currentUser) { openAuth('signin',()=>showToast('Sign in complete. Submit your project when ready.')); return; }
    const kind=$('#projectKind').value;
    const file=$('#projectFile').files[0];
    const iconFile=$('#projectIcon').files[0];
    const screenshots=[...$('#projectScreenshots').files];
    const id=$('#projectId').value.trim().toLowerCase();
    const name=$('#projectName').value.trim();
    const summary=$('#projectSummary').value.trim();
    const version=$('#projectVersion').value.trim();
    const mcVersion=$('#minecraftVersion').value.trim();
    const categories=selectedCategories();
    const tags=$('#projectTags').value.split(',').map(tag=>tag.trim().toLowerCase()).filter(Boolean);
    const source=$('#projectSource').value.trim();
    const agreements=$$('.agreement-check').every(input=>input.checked);
    if(!/^[a-z0-9_]{1,64}$/.test(id)){error.textContent='Project ID must be 1–64 lowercase letters, numbers or underscores.';return;}
    if(!name||name.length>64){error.textContent='Project name is required and must be 64 characters or fewer.';return;}
    if(!$('#projectAuthors').value.trim()){error.textContent='At least one author is required.';return;}
    if(!summary||summary.length>160){error.textContent='A summary of up to 160 characters is required.';return;}
    if(!version||!mcVersion){error.textContent='Version and Minecraft version are required.';return;}
    if(!$('#changelog').value.trim()){error.textContent='Add a changelog before publishing.';return;}
    if(!$('#projectDescription').value.trim()){error.textContent='Add a project description.';return;}
    if(categories.length<1||categories.length>3){error.textContent='Choose between 1 and 3 categories.';return;}
    if(tags.length>10){error.textContent='You can add up to 10 tags.';return;}
    if(tags.some(tag=>!/^[a-z0-9][a-z0-9-]{0,23}$/.test(tag))){error.textContent='Tags must be lowercase letters, numbers or hyphens, up to 24 characters each.';return;}
    if(!/^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+\/?$/.test(source)||/YOUR_USERNAME|YOUR_REPOSITORY/i.test(source)){error.textContent='Enter a valid GitHub source repository URL instead of the example placeholder.';return;}
    if(!agreements){error.textContent='Please accept all four agreement statements.';return;}
    const submit=$('.button-publish');submit.disabled=true;submit.innerHTML=`${icon('upload-cloud')} VALIDATING…`;
    try {
      await validateProjectFile(file,kind);
      await validateImage(iconFile,'icon');
      if(screenshots.length>MAX_SCREENSHOTS) throw new Error('You can upload up to 8 screenshots.');
      for(const screenshot of screenshots) await validateImage(screenshot,'screenshot');
      const existing=localProjects.find(p=>p.id===id);
      if(existing) throw new Error('That project ID is already published in this browser. Choose another ID.');
      const project={
        id,projectId:id,name,kind,version,minecraftVersion:mcVersion,authors:$('#projectAuthors').value.trim()||currentUser.displayName||currentUser.username,
        license:$('#projectLicense').value,summary,description:$('#projectDescription').value.trim(),changelog:$('#changelog').value.trim(),
        categories,tags,source,owner:currentUser.username,fileBlob:file,fileName:file.name,fileSize:file.size,iconBlob:iconFile,
        screenshots:screenshots.map(item=>({blob:item,name:item.name,type:item.type})),publishedAt:Date.now(),status:'PUBLISHED',theme:'cover-cyan'
      };
      await putOne('projects',project);
      await refreshProjects();
      showToast('Your project is PUBLISHED and available in this browser.');
      resetPostForm();
      switchView('profile');
      openDetail(project.id,'local');
    } catch(err) {
      error.textContent=err.message||'Could not publish this project.';
    } finally {
      submit.disabled=false;submit.innerHTML=`${icon('upload-cloud')} POST PROJECT`;
    }
  }
  function openDetail(id,origin) {
    const project = origin==='local' ? localProjects.find(p=>p.id===id) : demoProjects.find(p=>p.id===id);
    if(!project) return;
    const isLocal=origin==='local';
    const author=project.authors||project.author||'Community creator';
    const shots=isLocal?(project.screenshots||[]):[];
    const screenMarkup=shots.length?`<div class="detail-screenshots">${shots.map(item=>`<img src="${URL.createObjectURL(item.blob)}" alt="${safeText(item.name)}">`).join('')}</div>`:'';
    const fileLabel=isLocal?safeText(project.fileName):'Official registry listing';
    const description=safeText(project.description||project.summary).replace(/^### (.+)$/gm,'<strong>$1</strong>').replace(/^## (.+)$/gm,'<strong>$1</strong>').replace(/^# (.+)$/gm,'<strong>$1</strong>').replace(/^[-*] (.+)$/gm,'• $1').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
    $('#detailContent').innerHTML=`<div class="detail-cover ${project.theme||''}"><div class="project-icon">${iconMarkup(project)}</div></div>
      <div class="detail-content-head"><div><div class="detail-badges"><span>${safeText(project.kind)}</span><span>v${safeText(project.version)}</span>${isLocal?'<span style="color:#86dfbd">PUBLISHED</span>':'<span>REGISTRY PICK</span>'}</div><h2 id="detailTitle">${safeText(project.name)}</h2><p>${safeText(project.summary)}</p></div><div class="detail-download-actions">${isLocal?`<button class="button button-primary" data-download-project="${safeText(project.id)}">${icon('download')}Download</button>`:`<button class="button button-primary" data-open-registry>${icon('arrow-up-right')}Official registry</button>`}</div></div>
      ${screenMarkup}<div class="detail-body-grid"><div class="detail-description">${description}</div><aside class="detail-side-info"><h3>Project information</h3><div><span>Author</span><strong>${safeText(author)}</strong></div><div><span>For Minecraft</span><strong>${safeText(project.minecraftVersion||'26.3')}</strong></div><div><span>Licence</span><strong>${safeText(project.license||'See source')}</strong></div><div><span>Source</span><strong><a href="${safeText(project.source||'https://playhorizon.dev/mods')}" target="_blank" rel="noopener">GitHub ↗</a></strong></div><div><span>File</span><strong>${fileLabel}</strong></div><div><span>File size</span><strong>${isLocal?formatBytes(project.fileSize):'—'}</strong></div><div><span>Published</span><strong>${isLocal?new Date(project.publishedAt).toLocaleDateString():'Official registry'}</strong></div></aside></div>`;
    $('#detailModal').classList.remove('hidden');
  }
  function formatBytes(bytes) { if(!Number.isFinite(bytes))return '—';const units=['B','KB','MB','GB'];let n=bytes,i=0;while(n>=1024&&i<units.length-1){n/=1024;i++;}return `${n.toFixed(i?1:0)} ${units[i]}`; }
  function downloadProject(id) {
    const project=localProjects.find(p=>p.id===id);
    if(!project?.fileBlob){showToast('Project file is unavailable in this browser.','error');return;}
    const url=URL.createObjectURL(project.fileBlob);const anchor=document.createElement('a');anchor.href=url;anchor.download=project.fileName||`${project.projectId||id}`;document.body.append(anchor);anchor.click();anchor.remove();window.setTimeout(()=>URL.revokeObjectURL(url),2000);
    showToast('Download started.');
  }
  function navigateToOfficial() { window.open('https://playhorizon.dev/mods','_blank','noopener'); }

  // Navigation and global buttons
  $$('[data-view]').forEach(button=>button.addEventListener('click',()=>switchView(button.dataset.view)));
  $$('[data-go]').forEach(button=>button.addEventListener('click',()=>switchView(button.dataset.go)));
  $('#accountButton').addEventListener('click',()=>currentUser?switchView('profile'):openAuth('signin'));
  $('#profileSignIn').addEventListener('click',()=>openAuth('signin'));
  $('#signOutButton').addEventListener('click',logout);
  $('#mobileMenuButton').addEventListener('click',()=>switchView('discovery'));
  $('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('horizon-mods-theme',document.body.classList.contains('light')?'light':'dark');});
  if(localStorage.getItem('horizon-mods-theme')==='light')document.body.classList.add('light');
  $$('[data-auth-tab]').forEach(button=>button.addEventListener('click',()=>{authMode=button.dataset.authTab;$('#authError').textContent='';updateAuthMode();}));
  $$('[data-close-modal]').forEach(button=>button.addEventListener('click',()=>closeModal(button.closest('.modal-backdrop'))));
  $$('.modal-backdrop').forEach(modal=>modal.addEventListener('click',event=>{if(event.target===modal)closeModal(modal);}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')$$('.modal-backdrop:not(.hidden)').forEach(closeModal);if(event.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){event.preventDefault();if($('#view-discovery').classList.contains('active'))$('#discoverySearch').focus();else $('#homeSearch').focus();}});
  $('#authForm').addEventListener('submit',handleAuthSubmit);

  // Search and filter controls
  $('#homeSearch').addEventListener('input',renderHome);
  $('#clearHomeSearch').addEventListener('click',()=>{$('#homeSearch').value='';homeFilter='All';$$('#homeFilters .filter-pill').forEach(p=>p.classList.toggle('selected',p.dataset.filter==='All'));renderHome();});
  $$('#homeFilters .filter-pill').forEach(button=>button.addEventListener('click',()=>{homeFilter=button.dataset.filter;$$('#homeFilters .filter-pill').forEach(p=>p.classList.toggle('selected',p===button));renderHome();}));
  $('#discoverySearch').addEventListener('input',event=>{discoverySearchTerm=event.target.value.trim().toLowerCase();renderDiscovery();});
  $('#sortSelect').addEventListener('change',renderDiscovery);
  $$('#typeFilters .sidebar-option').forEach(button=>button.addEventListener('click',()=>{discoveryType=button.dataset.filter;$$('#typeFilters .sidebar-option').forEach(p=>p.classList.toggle('selected',p===button));renderDiscovery();}));
  $$('#categoryFilters input').forEach(input=>input.addEventListener('change',renderDiscovery));
  $('#clearFilters').addEventListener('click',()=>{discoveryType='All';discoverySearchTerm='';$('#discoverySearch').value='';$$('#typeFilters .sidebar-option').forEach(button=>button.classList.toggle('selected',button.dataset.filter==='All'));$$('#categoryFilters input').forEach(input=>input.checked=false);renderDiscovery();});

  // Event delegation for cards and project detail actions
  document.addEventListener('click',event=>{
    const openButton=event.target.closest('[data-open-project]');
    const downloadButton=event.target.closest('[data-download-project]');
    if(openButton)openDetail(openButton.dataset.openProject,openButton.dataset.origin);
    if(downloadButton)downloadProject(downloadButton.dataset.downloadProject);
    if(event.target.closest('[data-open-registry]'))navigateToOfficial();
  });

  // Form behavior, file validation and live preview
  $('#publishForm').addEventListener('submit',handlePublish);
  ['projectName','projectKind','projectVersion','projectSummary','projectAuthors'].forEach(id=>$(`#${id}`).addEventListener('input',renderLivePreview));
  $('#projectSummary').addEventListener('input',()=>$('#summaryCount').textContent=String($('#projectSummary').value.length));
  $('#projectKind').addEventListener('change',()=>{$('#projectFile').accept=getAcceptForKind($('#projectKind').value);$('#projectFile').value='';projectFileBlob=null;$('#projectFileName').textContent=`Choose ${getAcceptForKind($('#projectKind').value)} file`;renderLivePreview();});
  $('#projectFile').addEventListener('change',()=>{const file=$('#projectFile').files[0];projectFileBlob=file||null;$('#projectFileName').textContent=file?`${file.name} · ${formatBytes(file.size)}`:'No file selected';$('#projectFileZone').classList.toggle('has-file',Boolean(file));});
  $('#projectIcon').addEventListener('change',()=>{currentIconBlob=$('#projectIcon').files[0]||null;$('#projectIconName').textContent=currentIconBlob?`${currentIconBlob.name} · ${formatBytes(currentIconBlob.size)}`:'Choose PNG';$('#projectIconZone').classList.toggle('has-file',Boolean(currentIconBlob));renderLivePreview();});
  $('#projectScreenshots').addEventListener('change',()=>{
    screenshotBlobs=[...$('#projectScreenshots').files];
    $('#screenshotsName').textContent=`${screenshotBlobs.length} selected`;
    $('#screenshotsZone').classList.toggle('has-file',screenshotBlobs.length>0);
    screenshotUrls.forEach(url=>URL.revokeObjectURL(url));screenshotUrls=[];
    $('#screenshotPreview').innerHTML=screenshotBlobs.map(file=>{const url=URL.createObjectURL(file);screenshotUrls.push(url);return `<img class="screenshot-thumb" src="${url}" alt="Selected screenshot">`;}).join('');
  });
  bindDropZone($('#projectFileZone'),$('#projectFile'),()=>$('#projectFile').dispatchEvent(new Event('change')));
  bindDropZone($('#projectIconZone'),$('#projectIcon'),()=>$('#projectIcon').dispatchEvent(new Event('change')));
  bindDropZone($('#screenshotsZone'),$('#projectScreenshots'),()=>$('#projectScreenshots').dispatchEvent(new Event('change')));

  // Startup
  async function init() {
    try {
      db=await openDatabase();
      const session=JSON.parse(localStorage.getItem('horizon-mods-session')||'null');
      if(session?.username){
        const user=await getOne('users',session.username);
        if(user)currentUser={username:user.username,displayName:user.displayName||user.username,email:user.email};
        else localStorage.removeItem('horizon-mods-session');
      }
      setAccountUI();
      $('#projectFile').accept=getAcceptForKind($('#projectKind').value);
      renderLivePreview();
      await refreshProjects();
    } catch(err) {
      showToast(err.message||'Local storage is unavailable in this browser.','error');
      $('#publishForm').querySelectorAll('input,textarea,select,button').forEach(control=>{if(control.type!=='button')control.disabled=true;});
    }
  }
  init();
})();
