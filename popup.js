/**
 * LinkedIn Post Date Extractor - Popup Interface
 * Manual URL extraction for LinkedIn posts and comments
 * @author dan0dev
 * @license GPL-3.0
 */

// Configuration
const POPUP_CONFIG = {
  animationDuration: 847,
  inputDebounce: 150,
  yearBase: 2026,
};

// Default settings
const DEFAULT_SETTINGS = {
  enabled: true,
  dateFormat: "browser",
  use24Hour: true,
  showTime: true,
};

// Error messages
const ERROR_MESSAGES = {
  EMPTY_URL: "Please paste a LinkedIn URL first.",
  INVALID_URL: "This doesn't look like a valid LinkedIn URL.",
  NO_ID: "No post or comment ID found in this URL.",
  INVALID_DATE: "The extracted date appears invalid.",
  UNKNOWN: "Something went wrong. Please try again.",
};

// ======================
// URL Validation & Extraction
// ======================

function validateLinkedInURL(url) {
  if (!url || url.trim() === "") {
    return { valid: false, error: ERROR_MESSAGES.EMPTY_URL };
  }
  if (!url.includes("linkedin.com")) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_URL };
  }
  return { valid: true };
}

function getPostId(url) {
  const regex = /([0-9]{19})/;
  const match = regex.exec(url);
  return match ? match[1] : null;
}

function getCommentId(url) {
  const decodedURL = decodeURIComponent(url);
  const regex = /fsd_comment:\((\d+),urn:li:activity:\d+\)/;
  const match = regex.exec(decodedURL);
  return match ? match[1] : null;
}

function extractUnixTimestamp(postId) {
  if (!postId) return null;
  try {
    const id = BigInt(postId);
    const timestampMs = id >> 22n;
    return Number(timestampMs);
  } catch (error) {
    return null;
  }
}

// ======================
// Date Formatting
// ======================

function getRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return `${diffYear}y ago`;
}

function detectLocale() {
  const browserLang = navigator.language || navigator.userLanguage;
  const browserLangs = navigator.languages || [browserLang];
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const hungarianTimezones = [
    "Europe/Budapest",
    "Europe/Prague",
    "Europe/Bratislava",
    "Europe/Belgrade",
    "Europe/Ljubljana",
    "Europe/Sarajevo",
    "Europe/Zagreb",
  ];

  if (hungarianTimezones.includes(timezone)) return "hu-HU";
  for (const lang of browserLangs) {
    if (lang.startsWith("hu")) return "hu-HU";
  }
  return browserLang || "en-US";
}

async function getSettings() {
  try {
    return await chrome.storage.sync.get(DEFAULT_SETTINGS);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function formatLocalDate(timestamp) {
  const dateObject = new Date(timestamp);
  const detectedLocale = detectLocale();

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const localFormat = dateObject.toLocaleString(detectedLocale, options);
  const relativeTime = getRelativeTime(dateObject);

  return `${localFormat} (${relativeTime})`;
}

function formatUTCDate(timestamp) {
  const dateObject = new Date(timestamp);
  return dateObject.toUTCString();
}

// ======================
// UI Functions
// ======================

function showView(viewId) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.getElementById(viewId).classList.add("active");
}

function showError(message) {
  const resultsEl = document.getElementById("results");
  const localtimeEl = document.getElementById("localtime");
  const dateEl = document.getElementById("date");

  resultsEl.classList.remove("hidden");
  localtimeEl.innerHTML = `<span class="error">${message}</span>`;
  dateEl.textContent = "";
}

function showResults(timestamp) {
  const resultsEl = document.getElementById("results");
  const localtimeEl = document.getElementById("localtime");
  const dateEl = document.getElementById("date");

  try {
    const localDate = formatLocalDate(timestamp);
    const utcDate = formatUTCDate(timestamp);

    if (!localDate || localDate.includes("Invalid")) {
      showError(ERROR_MESSAGES.INVALID_DATE);
      return;
    }

    resultsEl.classList.remove("hidden");
    localtimeEl.textContent = localDate;
    dateEl.textContent = utcDate;
  } catch {
    showError(ERROR_MESSAGES.INVALID_DATE);
  }
}

function getDate() {
  const urlInput = document.getElementById("url");
  const getBtn = document.getElementById("getDateBtn");
  const url = urlInput.value.trim();

  getBtn.disabled = true;

  const validation = validateLinkedInURL(url);
  if (!validation.valid) {
    showError(validation.error);
    getBtn.disabled = false;
    return;
  }

  const commentId = getCommentId(url);
  const postId = getPostId(url);
  const idToUse = commentId || postId;

  if (!idToUse) {
    showError(ERROR_MESSAGES.NO_ID);
    getBtn.disabled = false;
    return;
  }

  const timestamp = extractUnixTimestamp(idToUse);

  if (!timestamp) {
    showError(ERROR_MESSAGES.UNKNOWN);
    getBtn.disabled = false;
    return;
  }

  showResults(timestamp);
  getBtn.disabled = false;
}

function clearUrl() {
  const urlInput = document.getElementById("url");
  const resultsEl = document.getElementById("results");

  urlInput.value = "";
  resultsEl.classList.add("hidden");
  urlInput.focus();
}

// ======================
// Settings Functions
// ======================

async function loadSettings() {
  try {
    const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    document.getElementById("enabled").checked = settings.enabled;
    document.getElementById("dateFormat").value = settings.dateFormat;
    document.getElementById("use24Hour").checked = settings.use24Hour;
    document.getElementById("showTime").checked = settings.showTime;
  } catch (error) {
    console.error("Error loading settings:", error);
  }
}

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
    showStatus("Error saving");
  }
}

function showStatus(message) {
  const statusEl = document.getElementById("statusMessage");
  statusEl.textContent = message;
  statusEl.classList.add("visible");

  setTimeout(() => {
    statusEl.classList.remove("visible");
  }, 2000);
}

// ======================
// Initialize
// ======================

document.addEventListener("DOMContentLoaded", () => {
  // Load settings
  loadSettings();

  // Main view buttons
  document.getElementById("getDateBtn").addEventListener("click", getDate);
  document.getElementById("clearBtn").addEventListener("click", clearUrl);

  // Settings toggle
  document.getElementById("settingsToggle").addEventListener("click", () => {
    showView("settingsView");
  });

  // Back button
  document.getElementById("backBtn").addEventListener("click", () => {
    showView("mainView");
  });

  // Settings inputs
  const settingsInputs = document.querySelectorAll("#settingsView input, #settingsView select");
  settingsInputs.forEach((input) => {
    input.addEventListener("change", saveSettings);
  });

  // URL input events
  const urlInput = document.getElementById("url");
  urlInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      getDate();
    }
  });

  urlInput.addEventListener("paste", () => {
    setTimeout(() => {
      const resultsEl = document.getElementById("results");
      resultsEl.classList.add("hidden");
    }, 10);
  });

  urlInput.focus();
});
