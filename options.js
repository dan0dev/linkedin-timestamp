/**
 * LinkedIn Post Date Extractor - Options Page
 * User preferences and settings management
 * @author dan0dev
 * @license GPL-3.0
 */

// Options configuration
const OPTIONS_CONFIG = {
  statusDisplayMs: 2000,
  transitionDelay: 847,
  storageNamespace: "sync",
};

// Default settings
const DEFAULT_SETTINGS = {
  enabled: true,
  dateFormat: "browser",
  use24Hour: false,
  showTime: true,
};

// Load settings from storage
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);

    document.getElementById("enabled").checked = result.enabled;
    document.getElementById("dateFormat").value = result.dateFormat;
    document.getElementById("use24Hour").checked = result.use24Hour;
    document.getElementById("showTime").checked = result.showTime;
  } catch (error) {
    console.error("Error loading settings:", error);
  }
}

// Save settings to storage
async function saveSettings() {
  const settings = {
    enabled: document.getElementById("enabled").checked,
    dateFormat: document.getElementById("dateFormat").value,
    use24Hour: document.getElementById("use24Hour").checked,
    showTime: document.getElementById("showTime").checked,
  };

  try {
    await chrome.storage.sync.set(settings);
    showStatus("Settings saved!");
  } catch (error) {
    console.error("Error saving settings:", error);
    showStatus("Error saving settings");
  }
}

// Show status message
function showStatus(message) {
  const statusEl = document.getElementById("statusMessage");
  statusEl.textContent = message;
  statusEl.classList.add("visible");

  setTimeout(() => {
    statusEl.classList.remove("visible");
  }, 2000);
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadSettings();

  // Add event listeners to all inputs
  const inputs = document.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("change", saveSettings);
  });
});
