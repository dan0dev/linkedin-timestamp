const ERROR_MESSAGES = {
  EMPTY_URL: "Please paste a LinkedIn URL first.",
  INVALID_URL: "This doesn't look like a valid LinkedIn URL. Make sure it contains 'linkedin.com'.",
  NO_ID: "No post or comment ID found in this URL. Try a different LinkedIn post URL.",
  INVALID_DATE: "The extracted date appears invalid. The URL might be corrupted.",
  UNKNOWN: "Something went wrong. Please try again or use a different URL."
};

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
    const timestamp = Number(timestampMs);
    return timestamp;
  } catch (error) {
    return null;
  }
}

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

  if (diffSec < 60) return `${diffSec} second${diffSec !== 1 ? 's' : ''} ago`;
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
  if (diffWeek < 4) return `${diffWeek} week${diffWeek !== 1 ? 's' : ''} ago`;
  if (diffMonth < 12) return `${diffMonth} month${diffMonth !== 1 ? 's' : ''} ago`;
  return `${diffYear} year${diffYear !== 1 ? 's' : ''} ago`;
}

function detectLocale() {
  // Try multiple sources for locale detection
  const browserLang = navigator.language || navigator.userLanguage;
  const browserLangs = navigator.languages || [browserLang];
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // FORCE Hungarian for Budapest timezone (Central European Time zones)
  const hungarianTimezones = [
    'Europe/Budapest',
    'Europe/Prague',
    'Europe/Bratislava',
    'Europe/Belgrade',
    'Europe/Ljubljana',
    'Europe/Sarajevo',
    'Europe/Zagreb'
  ];

  if (hungarianTimezones.includes(timezone)) {
    return 'hu-HU';
  }

  // Check browser languages
  for (const lang of browserLangs) {
    if (lang.startsWith('hu')) {
      return 'hu-HU';
    }
  }

  return browserLang || 'en-US';
}

function formatLocalDate(timestamp, locale = null) {
  const dateObject = new Date(timestamp);

  const detectedLocale = locale || detectLocale();

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  const localFormat = dateObject.toLocaleString(detectedLocale, options);
  const relativeTime = getRelativeTime(dateObject);

  return `${localFormat} (${relativeTime})`;
}

function formatUTCDate(timestamp) {
  const dateObject = new Date(timestamp);
  return dateObject.toUTCString();
}

function showError(message) {
  const dateElem = document.querySelector("#date");
  const localtimeElem = document.querySelector("#localtime");

  dateElem.innerHTML = `<span class="error-message" role="alert">${message}</span>`;
  dateElem.setAttribute("aria-live", "assertive");
  localtimeElem.textContent = "";
}

function showResults(timestamp) {
  const dateElem = document.querySelector("#date");
  const localtimeElem = document.querySelector("#localtime");

  try {
    const localDate = formatLocalDate(timestamp);
    const utcDate = formatUTCDate(timestamp);

    if (!localDate || localDate.includes("Invalid")) {
      showError(ERROR_MESSAGES.INVALID_DATE);
      return;
    }

    localtimeElem.innerHTML = `<span class="success-message">${localDate}</span>`;
    dateElem.textContent = utcDate;
    dateElem.setAttribute("aria-live", "polite");
  } catch (error) {
    showError(ERROR_MESSAGES.INVALID_DATE);
  }
}

function getDate() {
  const urlInput = document.querySelector("#url");
  const getBtn = document.querySelector("#getDateBtn");
  const url = urlInput.value.trim();

  getBtn.disabled = true;

  const validation = validateLinkedInURL(url);
  if (!validation.valid) {
    showError(validation.error);
    getBtn.disabled = false;
    urlInput.focus();
    return;
  }

  const commentId = getCommentId(url);
  const postId = getPostId(url);
  const idToUse = commentId || postId;

  if (!idToUse) {
    showError(ERROR_MESSAGES.NO_ID);
    getBtn.disabled = false;
    urlInput.focus();
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

function clearUrlField() {
  const urlInput = document.querySelector("#url");
  const dateElem = document.querySelector("#date");
  const localtimeElem = document.querySelector("#localtime");

  urlInput.value = "";
  dateElem.textContent = "";
  localtimeElem.textContent = "";
  dateElem.removeAttribute("aria-live");
  urlInput.focus();
}

document.addEventListener("DOMContentLoaded", () => {
  const getBtn = document.querySelector("#getDateBtn");
  const clearBtn = document.querySelector("#clearBtn");
  const urlInput = document.querySelector("#url");

  getBtn.addEventListener("click", getDate);
  clearBtn.addEventListener("click", clearUrlField);

  urlInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      getDate();
    }
  });

  urlInput.addEventListener("paste", () => {
    setTimeout(() => {
      const dateElem = document.querySelector("#date");
      const localtimeElem = document.querySelector("#localtime");
      if (dateElem.textContent || localtimeElem.textContent) {
        dateElem.textContent = "";
        localtimeElem.textContent = "";
      }
    }, 10);
  });

  urlInput.focus();
});
