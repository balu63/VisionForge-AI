// ============================================================
//  VISIONFORGE AI - HISTORY MANAGEMENT
// ============================================================

// ===== CLEAR HISTORY =====
function clearHistory() {
  if (!AppState.history.length) {
    showToast('No history to clear.', 'fa-exclamation-circle');
    return;
  }
  
  openModal(`
    <h2><i class="fas fa-trash" style="color:#f87171;"></i> Clear History?</h2>
    <p style="color:var(--text-muted);margin:12px 0;">This will permanently delete all your creations from history.</p>
    <div class="modal-actions">
      <button class="btn-outline danger" onclick="confirmClearHistory()">Yes, Clear All</button>
      <button class="btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

function confirmClearHistory() {
  AppState.history = [];
  localStorage.setItem('vf_history', JSON.stringify(AppState.history));
  closeModal();
  updateAllGalleries();
  showToast('🗑️ History cleared.', 'fa-trash');
}

// ===== DELETE ALL DATA =====
function deleteAllData() {
  openModal(`
    <h2><i class="fas fa-triangle-exclamation" style="color:#f87171;"></i> Delete All Data?</h2>
    <p style="color:var(--text-muted);margin:12px 0;">This will permanently delete all your history, favorites, and settings.</p>
    <div class="modal-actions">
      <button class="btn-outline danger" onclick="confirmDeleteAll()">Yes, Delete Everything</button>
      <button class="btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

function confirmDeleteAll() {
  AppState.history = [];
  AppState.favorites = [];
  localStorage.removeItem('vf_history');
  localStorage.removeItem('vf_favorites');
  closeModal();
  updateAllGalleries();
  showToast('🗑️ All data deleted.', 'fa-trash');
}

// ===== EVENT BINDINGS =====
DOM.clearHistoryBtn.addEventListener('click', clearHistory);
DOM.clearAllBtn.addEventListener('click', deleteAllData);

// ===== EXPOSE =====
window.clearHistory = clearHistory;
window.confirmClearHistory = confirmClearHistory;
window.deleteAllData = deleteAllData;
window.confirmDeleteAll = confirmDeleteAll;