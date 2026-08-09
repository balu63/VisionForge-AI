// ============================================================
//  VISIONFORGE AI - SETTINGS & UI
// ============================================================

// ===== RENDER SETTINGS =====
function renderSettings(mode) {
  let html = '';
  
  if (mode === 'image') {
    html = `
      <div class="setting-card">
        <label><i class="fas fa-arrows-left-right"></i> Aspect Ratio</label>
        <select id="aspectRatio">
          <option value="1:1">1:1 Square</option>
          <option value="16:9" selected>16:9 Widescreen</option>
          <option value="9:16">9:16 Portrait</option>
          <option value="4:3">4:3 Standard</option>
        </select>
      </div>
      <div class="setting-card">
        <label><i class="fas fa-palette"></i> Style</label>
        <select id="styleSelect">
          <option value="realistic">Realistic</option>
          <option value="cinematic" selected>Cinematic</option>
          <option value="anime">Anime</option>
          <option value="3d">3D</option>
          <option value="digital">Digital Art</option>
          <option value="fantasy">Fantasy</option>
        </select>
      </div>
      <div class="setting-card">
        <label><i class="fas fa-star"></i> Quality</label>
        <select id="qualitySelect">
          <option value="standard">Standard</option>
          <option value="hd" selected>HD</option>
          <option value="ultra">Ultra HD</option>
        </select>
      </div>
      <div class="setting-card">
        <label><i class="fas fa-copy"></i> Number</label>
        <select id="numberSelect">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="4">4</option>
        </select>
      </div>
      <div class="setting-card">
        <label><i class="fas fa-ban"></i> Negative Prompt</label>
        <input type="text" placeholder="Things to avoid..." id="negativePrompt" />
      </div>
    `;
  } else if (mode === 'video') {
    html = `
      <div class="setting-card">
        <label><i class="fas fa-clock"></i> Duration</label>
        <select>
          <option value="5">5 sec</option>
          <option value="10" selected>10 sec</option>
          <option value="15">15 sec</option>
        </select>
      </div>
      <div class="setting-card">
        <label><i class="fas fa-arrows-left-right"></i> Aspect Ratio</label>
        <select id="aspectRatio">
          <option value="16:9" selected>16:9</option>
          <option value="9:16">9:16</option>
          <option value="1:1">1:1</option>
        </select>
      </div>
      <div class="setting-card">
        <label><i class="fas fa-palette"></i> Style</label>
        <select>
          <option value="cinematic" selected>Cinematic</option>
          <option value="realistic">Realistic</option>
          <option value="animation">Animation</option>
          <option value="3d">3D</option>
        </select>
      </div>
      <div class="setting-card">
        <label><i class="fas fa-camera"></i> Camera Movement</label>
        <select>
          <option value="static">Static</option>
          <option value="pan">Pan</option>
          <option value="tilt">Tilt</option>
          <option value="zoom" selected>Zoom</option>
          <option value="orbit">Orbit</option>
        </select>
      </div>
      <div class="setting-card">
        <label><i class="fas fa-gauge-high"></i> Motion Strength</label>
        <select>
          <option value="low">Low</option>
          <option value="medium" selected>Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    `;
  } else {
    // Image to Video
    html = `
      <div class="setting-card">
        <label><i class="fas fa-clock"></i> Duration</label>
        <select>
          <option value="5">5 sec</option>
          <option value="10" selected>10 sec</option>
        </select>
      </div>
      <div class="setting-card">
        <label><i class="fas fa-camera"></i> Camera Movement</label>
        <select>
          <option value="static">Static</option>
          <option value="pan">Pan</option>
          <option value="tilt">Tilt</option>
          <option value="zoom" selected>Zoom</option>
        </select>
      </div>
      <div class="setting-card">
        <label><i class="fas fa-gauge-high"></i> Motion Strength</label>
        <select>
          <option value="low">Low</option>
          <option value="medium" selected>Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div style="grid-column: span 2;">
        <label><i class="fas fa-upload"></i> Upload Image</label>
        <div class="upload-zone" id="uploadZone">
          <i class="fas fa-cloud-upload-alt"></i>
          <p>Drop an image here or click to browse</p>
          <div class="file-types">PNG · JPG · WEBP (Max 5MB)</div>
        </div>
        <div class="upload-preview" id="uploadPreview">
          <img id="uploadedImagePreview" src="" alt="Uploaded" />
          <button class="remove-file" id="removeUploadBtn"><i class="fas fa-times"></i> Remove</button>
        </div>
      </div>
    `;
    
    // Setup upload after render
    setTimeout(setupUpload, 100);
  }
  
  DOM.settingsPanel.innerHTML = html;
}

// ===== SETUP UPLOAD =====
function setupUpload() {
  const zone = document.getElementById('uploadZone');
  const preview = document.getElementById('uploadPreview');
  const previewImg = document.getElementById('uploadedImagePreview');
  const removeBtn = document.getElementById('removeUploadBtn');
  
  if (!zone) return;
  
  // Click to upload
  zone.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp';
    input.onchange = (e) => handleFileUpload(e.target.files[0]);
    input.click();
  });
  
  // Drag and drop
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  
  zone.addEventListener('dragleave', () => {
    zone.classList.remove('dragover');
  });
  
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  });
  
  // Remove upload
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      AppState.uploadedImage = null;
      preview.style.display = 'none';
      zone.style.display = 'block';
      showToast('Image removed', 'fa-times');
    });
  }
}

// ===== HANDLE FILE UPLOAD =====
function handleFileUpload(file) {
  if (!file) return;
  
  const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    showToast('Please upload PNG, JPG, or WEBP.', 'fa-exclamation-circle');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    showToast('File too large. Max 5MB.', 'fa-exclamation-circle');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    AppState.uploadedImage = e.target.result;
    
    const preview = document.getElementById('uploadPreview');
    const previewImg = document.getElementById('uploadedImagePreview');
    const zone = document.getElementById('uploadZone');
    
    previewImg.src = e.target.result;
    preview.style.display = 'block';
    zone.style.display = 'none';
    
    showToast('📸 Image uploaded successfully!', 'fa-check-circle');
  };
  reader.readAsDataURL(file);
}

// ===== EXPOSE =====
window.renderSettings = renderSettings;
window.setupUpload = setupUpload;
window.handleFileUpload = handleFileUpload;