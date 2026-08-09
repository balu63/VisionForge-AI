// ============================================================
//  VISIONFORGE AI - GALLERY MANAGEMENT
// ============================================================

// ===== RENDER GALLERY =====
function renderGallery(container, items, type = 'all') {
  if (!items || !items.length) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-image" style="font-size:48px;color:var(--glow-purple);opacity:0.5;"></i>
        <h3>No creations yet</h3>
        <p>Your next masterpiece starts with a prompt.</p>
        <button class="btn-primary" style="margin-top:12px;" onclick="navigate('home')">
          <i class="fas fa-wand-magic-sparkles"></i> Create Something
        </button>
      </div>
    `;
    return;
  }
  
  const filtered = type === 'all' ? items : items.filter(i => i.type === type);
  
  if (!filtered.length) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-image" style="font-size:48px;color:var(--glow-purple);opacity:0.5;"></i>
        <h3>No ${type} creations</h3>
        <p>Generate some ${type}s first!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filtered.map(item => `
    <div class="gallery-card" onclick="viewCreation('${item.id}')">
      <img src="${item.media}" alt="${item.prompt}" loading="lazy" />
      <div class="card-body">
        <h4>${item.prompt.slice(0, 40)}${item.prompt.length > 40 ? '…' : ''}</h4>
        <p>${item.date} · ${item.timestamp || ''}</p>
        <span class="card-tag">${item.type === 'video' ? '🎬 Video' : '🖼️ Image'}</span>
      </div>
    </div>
  `).join('');
}

// ===== VIEW CREATION =====
function viewCreation(id) {
  const item = AppState.history.find(h => h.id === id);
  if (!item) return;
  
  AppState.result = item;
  DOM.resultArea.style.display = 'block';
  DOM.resultPreview.innerHTML = `<img src="${item.media}" alt="${item.prompt}" />`;
  DOM.resultMeta.innerHTML = `
    <span><i class="fas fa-robot"></i> AI Generated</span>
    <span><i class="fas fa-clock"></i> ${item.date}</span>
    <span><i class="fas fa-tag"></i> ${item.type === 'video' ? 'Video' : 'Image'}</span>
  `;
  
  navigate('home');
  DOM.resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('📂 Loaded creation', 'fa-folder-open');
}

// ===== UPDATE ALL GALLERIES =====
function updateAllGalleries() {
  // Image gallery
  const images = AppState.history.filter(h => h.type === 'image');
  renderGallery(document.getElementById('imageGallery'), images, 'image');
  
  // Video gallery
  const videos = AppState.history.filter(h => h.type === 'video');
  renderGallery(document.getElementById('videoGallery'), videos, 'video');
  
  // History
  const historyContainer = document.getElementById('historyList');
  if (!AppState.history.length) {
    historyContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-clock-rotate-left" style="font-size:48px;color:var(--glow-purple);opacity:0.5;"></i>
        <h3>No history</h3>
        <p>Your creations will appear here.</p>
      </div>
    `;
  } else {
    historyContainer.innerHTML = AppState.history.map(item => `
      <div style="display:flex;align-items:center;gap:14px;background:var(--glass-bg);padding:12px 16px;border-radius:12px;margin-bottom:8px;border:1px solid var(--glass-border);cursor:pointer;" onclick="viewCreation('${item.id}')">
        <img src="${item.media}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;flex-shrink:0;" />
        <div style="flex:1;min-width:0;">
          <strong style="font-size:14px;">${item.prompt.slice(0, 50)}${item.prompt.length > 50 ? '…' : ''}</strong>
          <br>
          <span style="color:var(--text-muted);font-size:12px;">
            ${item.type === 'video' ? '🎬 Video' : '🖼️ Image'} · ${item.date}
          </span>
        </div>
        <span style="background:#2d3045;padding:2px 12px;border-radius:40px;font-size:11px;flex-shrink:0;">${item.status || 'completed'}</span>
      </div>
    `).join('');
  }
  
  // Favorites
  const favoritesContainer = document.getElementById('favoritesList');
  const favItems = AppState.history.filter(h => AppState.favorites.includes(h.id));
  if (!favItems.length) {
    favoritesContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-heart" style="font-size:48px;color:var(--glow-purple);opacity:0.5;"></i>
        <h3>No favorites yet</h3>
        <p>Heart your favorite creations!</p>
        <button class="btn-primary" style="margin-top:12px;" onclick="navigate('home')">
          <i class="fas fa-wand-magic-sparkles"></i> Create Something
        </button>
      </div>
    `;
  } else {
    renderGallery(favoritesContainer, favItems, 'all');
  }
}

// ===== EXPOSE =====
window.viewCreation = viewCreation;