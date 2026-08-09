// ============================================================
//  VISIONFORGE AI - UI HELPERS & INIT
// ============================================================

// ===== LOAD SAVED SETTINGS =====
function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem('vf_settings'));
    if (saved) {
      Object.entries(saved).forEach(([key, value]) => {
        const el = document.getElementById(key);
        if (el) el.value = value;
      });
    }
  } catch (e) {}
}

// ===== SETUP AUTO-RESIZE TEXTAREA =====
function setupTextarea() {
  DOM.mainPrompt.addEventListener('input', () => {
    DOM.mainPrompt.style.height = 'auto';
    DOM.mainPrompt.style.height = Math.min(DOM.mainPrompt.scrollHeight, 200) + 'px';
  });
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  // Escape to close modal
  if (e.key === 'Escape') {
    closeModal();
  }
  
  // Ctrl+Enter to generate
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    const active = document.activeElement;
    if (active === DOM.mainPrompt) {
      e.preventDefault();
      handleGenerate();
    }
  }
});

// ===== DEMO CREATIONS =====
function createDemoCreations() {
  if (AppState.history.length > 0) return;
  
  const demos = [
    { prompt: 'Futuristic city at sunset with flying cars', type: 'image' },
    { prompt: 'Portrait of an astronaut in a glass helmet', type: 'image' },
    { prompt: 'Luxury sports car in a rainy neon city', type: 'image' },
    { prompt: 'Fantasy castle floating above clouds', type: 'image' }
  ];
  
  demos.forEach((demo, i) => {
    const seed = Date.now() + i;
    AppState.history.push({
      id: seed,
      prompt: demo.prompt,
      media: `https://picsum.photos/seed/${seed}/400/300`,
      type: demo.type,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toLocaleTimeString(),
      status: 'completed'
    });
  });
  
  localStorage.setItem('vf_history', JSON.stringify(AppState.history));
}

// ===== THEME PERSISTENCE =====
function loadTheme() {
  const saved = localStorage.getItem('vf_theme');
  if (saved === 'light') {
    document.body.style.background = '#f0f2f8';
    document.body.style.color = '#0b0d15';
    DOM.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    isDark = false;
  }
}

function saveTheme() {
  localStorage.setItem('vf_theme', isDark ? 'dark' : 'light');
}

// Override theme toggle to save
const originalToggle = DOM.themeToggle.click;
DOM.themeToggle.addEventListener('click', saveTheme);

// ===== INIT =====
function init() {
  // Load saved data
  loadTheme();
  loadSettings();
  
  // Create demo content if empty
  createDemoCreations();
  
  // Setup UI
  setupTextarea();
  renderSettings('image');
  navigate('home');
  updateAllGalleries();
  
  // Focus prompt
  DOM.mainPrompt.focus();
  
  // Set example prompt
  if (!DOM.mainPrompt.value) {
    DOM.mainPrompt.value = 'A cinematic portrait of a young Indian man standing on a city street during golden hour, wearing a stylish black shirt and jeans, natural hairstyle, realistic face, soft sunlight, beautiful blurred background, professional photography, shallow depth of field, realistic skin texture, sharp focus, 4K, ultra realistic, Instagram-worthy, natural pose, cinematic lighting.';
  }
  
  // Show welcome
  setTimeout(() => {
    showToast('🚀 VisionForge AI ready!', 'fa-rocket');
  }, 500);
  
  console.log('🚀 VisionForge AI · Full Working Application');
  console.log('   ✓ Real AI Image Generation');
  console.log('   ✓ Video Generation');
  console.log('   ✓ Download, Share, Favorite');
  console.log('   ✓ File Upload');
  console.log('   ✓ History & Gallery');
}

// ===== RUN =====
document.addEventListener('DOMContentLoaded', init);

// ===== EXPOSE =====
window.renderSettings = renderSettings;
window.setupUpload = setupUpload;
window.handleFileUpload = handleFileUpload;
window.loadSettings = loadSettings;
window.createDemoCreations = createDemoCreations;