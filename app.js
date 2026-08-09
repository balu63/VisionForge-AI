// ============================================================
//  VISIONFORGE AI - MAIN APPLICATION
//  API Key: sk_NlWfWnfky5XJ59EE9NCAa2YHApbpBOSl
// ============================================================

// ===== STATE =====
const AppState = {
  mode: 'image',
  currentPage: 'home',
  history: JSON.parse(localStorage.getItem('vf_history')) || [],
  favorites: JSON.parse(localStorage.getItem('vf_favorites')) || [],
  result: null,
  isGenerating: false,
  uploadedImage: null
};

// ===== DOM REFS =====
const DOM = {
  sidebar: document.getElementById('sidebar'),
  hamburger: document.getElementById('hamburgerBtn'),
  mainPrompt: document.getElementById('mainPrompt'),
  modeTabs: document.getElementById('modeTabs'),
  generateBtn: document.getElementById('generateBtn'),
  enhanceBtn: document.getElementById('enhanceBtn'),
  clearPromptBtn: document.getElementById('clearPromptBtn'),
  settingsPanel: document.getElementById('settingsPanel'),
  resultArea: document.getElementById('resultArea'),
  resultPreview: document.getElementById('resultPreview'),
  resultImg: document.getElementById('resultImg'),
  resultMeta: document.getElementById('resultMeta'),
  favResultBtn: document.getElementById('favResultBtn'),
  downloadBtn: document.getElementById('downloadBtn'),
  regenerateBtn: document.getElementById('regenerateBtn'),
  editPromptBtn: document.getElementById('editPromptBtn'),
  shareBtn: document.getElementById('shareBtn'),
  modalOverlay: document.getElementById('modalOverlay'),
  modalContent: document.getElementById('modalContent'),
  toastContainer: document.getElementById('toastContainer'),
  themeToggle: document.getElementById('themeToggle'),
  upgradeBtn: document.getElementById('upgradeBtn'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),
  clearAllBtn: document.getElementById('clearAllBtn'),
  apiStatusText: document.getElementById('apiStatusText')
};

// ===== API KEY STATUS DISPLAY =====
if (DOM.apiStatusText) {
  const apiKey = 'sk_NlWfWnfky5XJ59EE9NCAa2YHApbpBOSl';
  if (apiKey && apiKey.startsWith('sk_')) {
    DOM.apiStatusText.textContent = 'API Key: Active ✅';
    DOM.apiStatusText.style.color = '#4ade80';
  } else {
    DOM.apiStatusText.textContent = 'API Key: Missing ❌';
    DOM.apiStatusText.style.color = '#f87171';
  }
}

console.log('🔑 API Key Configured: ' + (API_CONFIG && API_CONFIG.API_KEY ? '✅ Yes' : '❌ No'));
console.log('🔐 Key: ' + (API_CONFIG && API_CONFIG.API_KEY ? API_CONFIG.API_KEY.substring(0, 10) + '...' : 'None'));

// ===== TOAST SYSTEM =====
function showToast(message, icon = 'fa-check-circle') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
  DOM.toastContainer.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(20px)';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

// ===== MODAL SYSTEM =====
function openModal(html) {
  DOM.modalContent.innerHTML = html;
  DOM.modalOverlay.classList.add('open');
}

function closeModal() {
  DOM.modalOverlay.classList.remove('open');
}

DOM.modalOverlay.addEventListener('click', (e) => {
  if (e.target === DOM.modalOverlay) closeModal();
});

// ===== NAVIGATION =====
function navigate(page) {
  AppState.currentPage = page;
  
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');
  
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
  
  if (window.innerWidth <= 768) DOM.sidebar.classList.remove('open');
  
  if (page === 'home') renderSettings(AppState.mode);
  if (['images', 'videos', 'history', 'favorites'].includes(page)) {
    updateAllGalleries();
  }
}

document.querySelectorAll('.sidebar-nav a').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    navigate(a.dataset.page);
  });
});

// ===== HAMBURGER =====
DOM.hamburger.addEventListener('click', () => {
  DOM.sidebar.classList.toggle('open');
});

// ===== THEME TOGGLE =====
let isDark = true;
DOM.themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.body.style.background = isDark ? '#0b0d15' : '#f0f2f8';
  document.body.style.color = isDark ? '#eef2fb' : '#0b0d15';
  DOM.themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  showToast(isDark ? 'Dark mode' : 'Light mode', 'fa-palette');
});

// ===== UPGRADE MODAL =====
DOM.upgradeBtn.addEventListener('click', () => {
  openModal(`
    <h2><i class="fas fa-rocket" style="color:var(--glow-purple);"></i> Upgrade to Pro</h2>
    <div style="background:var(--glass-bg);padding:16px;border-radius:var(--radius-md);margin:12px 0;">
      <p><strong>Free</strong> · 10 generations · standard quality</p>
      <p style="margin-top:8px;"><strong>Pro</strong> · unlimited · HD · advanced controls</p>
    </div>
    <div class="modal-actions">
      <button class="btn-primary" onclick="closeModal();showToast('⚡ Upgrade demo (no payment)','fa-rocket');">Upgrade to Pro</button>
      <button class="btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  `);
});

// ===== EXPOSE GLOBALLY =====
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.navigate = navigate;
window.AppState = AppState;
window.DOM = DOM;