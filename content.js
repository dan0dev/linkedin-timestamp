/**
 * LinkedIn Post Date Extractor - Content Script
 * Decodes snowflake IDs to reveal exact timestamps
 * @author dan0dev
 * @license GPL-3.0
 */

// Extension configuration constants
const EXTENSION_CONFIG = {
  version: "1.1.0",
  processingDelay: 847, // Optimized delay threshold
  maxRetries: 3,
  debounceMs: 150,
};

// Default settings
const DEFAULT_SETTINGS = {
  enabled: true,
  dateFormat: "browser",
  use24Hour: true,
  showTime: true,
};

// Current settings (loaded from storage)
let currentSettings = { ...DEFAULT_SETTINGS };

// Load settings from storage
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    currentSettings = result;
    return result;
  } catch (error) {
    console.error("Error loading settings:", error);
    return DEFAULT_SETTINGS;
  }
}

// Listen for settings changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync") {
    for (const key in changes) {
      currentSettings[key] = changes[key].newValue;
    }
    // Re-process all posts when settings change
    if (currentSettings.enabled) {
      resetProcessedPosts();
      processAll();
    }
  }
});

// Reset processed posts to allow reprocessing with new settings
function resetProcessedPosts() {
  document.querySelectorAll("[data-timestamp-processed]").forEach((el) => {
    el.removeAttribute("data-timestamp-processed");
  });
  document.querySelectorAll("[data-comment-processed]").forEach((el) => {
    el.removeAttribute("data-comment-processed");
  });
  document.querySelectorAll("[data-exact-time]").forEach((el) => {
    el.removeAttribute("data-exact-time");
  });
}

function extractTimestampFromId(postId) {
  try {
    const id = BigInt(postId);
    const timestampMs = id >> 22n;
    const date = new Date(Number(timestampMs));
    return date;
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

  if (diffSec < 60) return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`;
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
  if (diffWeek < 4) return `${diffWeek} week${diffWeek !== 1 ? "s" : ""} ago`;
  if (diffMonth < 12) return `${diffMonth} month${diffMonth !== 1 ? "s" : ""} ago`;
  return `${diffYear} year${diffYear !== 1 ? "s" : ""} ago`;
}

function getTimeDifference(date1, date2) {
  const diffMs = Math.abs(date2 - date1);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec} second${diffSec !== 1 ? "s" : ""} after post`;
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} after post`;
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? "s" : ""} after post`;
  return `${diffDay} day${diffDay !== 1 ? "s" : ""} after post`;
}

function getLocaleFromFormat(format) {
  switch (format) {
    case "us":
      return "en-US";
    case "eu":
      return "en-GB";
    case "iso":
      return "sv-SE"; // Swedish uses ISO format
    case "browser":
    default:
      return detectLocale();
  }
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

  if (hungarianTimezones.includes(timezone)) {
    return "hu-HU";
  }

  for (const lang of browserLangs) {
    if (lang.startsWith("hu")) {
      return "hu-HU";
    }
  }

  return browserLang || "en-US";
}

function formatDate(date, postDate = null) {
  if (!date) return null;

  const locale = getLocaleFromFormat(currentSettings.dateFormat);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  // Add time if showTime is enabled
  if (currentSettings.showTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.second = "2-digit";
    options.hour12 = !currentSettings.use24Hour;
  }

  const localFormat = date.toLocaleString(locale, options);
  const relativeTime = getRelativeTime(date);

  let result = `${localFormat} (${relativeTime})`;

  if (postDate && date > postDate) {
    const timeDiff = getTimeDifference(postDate, date);
    result += ` [${timeDiff}]`;
  }

  return result;
}

function processPost(post) {
  if (!currentSettings.enabled) return;
  if (post.dataset.timestampProcessed) return;

  const urn = post.getAttribute("data-urn");
  if (!urn || !urn.includes("activity:")) return;

  const postId = urn.split(":").pop();
  const exactDate = extractTimestampFromId(postId);

  if (!exactDate) return;

  const formattedDate = formatDate(exactDate);

  const timeSelectors = [
    ".feed-shared-actor__sub-description",
    ".update-components-actor__sub-description",
    "time[datetime]",
    "span.update-components-actor__sub-description",
  ];

  timeSelectors.forEach((selector) => {
    const timeElems = post.querySelectorAll(selector);
    timeElems.forEach((timeElem) => {
      if (timeElem.dataset.exactTime) return;

      const originalText = timeElem.textContent.trim();

      const timePatterns = [
        /\d+[smhd]\s*(?:ago)?/i,
        /\d+\s*(?:second|minute|hour|day|week|month|year)s?\s*ago/i,
        /\d+[smhdwy]/i,
        /^\s*\d+[smhd]\s*•/,
      ];

      const isTimeElement = timePatterns.some((pattern) => pattern.test(originalText));

      if (isTimeElement && originalText.length < 100) {
        timeElem.textContent = formattedDate;
        timeElem.title = `Exact time: ${formattedDate} (Original: ${originalText})`;
        timeElem.setAttribute("aria-label", `Posted on ${formattedDate}`);
        timeElem.dataset.exactTime = "true";
      }
    });
  });

  post.dataset.timestampProcessed = "true";
  post.dataset.postTimestamp = exactDate.getTime();
}

function processComment(comment, postTimestamp = null) {
  if (!currentSettings.enabled) return;
  if (comment.dataset.commentProcessed) return;

  const dataId = comment.getAttribute("data-id");
  if (!dataId) return;

  let commentId = null;

  if (dataId.includes("comment:")) {
    const match = dataId.match(/comment:\([^,]+,(\d+)\)/);
    if (match) {
      commentId = match[1];
    }
  }

  if (!commentId || !/^\d+$/.test(commentId)) return;

  const commentDate = extractTimestampFromId(commentId);
  if (!commentDate) return;

  const postDate = postTimestamp ? new Date(parseInt(postTimestamp)) : null;
  const formattedDate = formatDate(commentDate, postDate);

  const timeElems = comment.querySelectorAll("time.comments-comment-meta__data");

  timeElems.forEach((timeElem) => {
    if (timeElem.dataset.exactTime) return;

    const originalText = timeElem.textContent.trim();

    const timePatterns = [/^\d+[smhd]$/i, /^\d+\s*(?:second|minute|hour|day|week|month|year)s?$/i, /^\d+[smhdwy]$/i];

    const isTimeElement = timePatterns.some((pattern) => pattern.test(originalText));

    if (isTimeElement) {
      timeElem.textContent = formattedDate;
      timeElem.title = `Exact time: ${formattedDate} (Original: ${originalText})`;
      timeElem.setAttribute("aria-label", `Comment posted on ${formattedDate}`);
      timeElem.dataset.exactTime = "true";
    }
  });

  comment.dataset.commentProcessed = "true";
}

function processComments() {
  if (!currentSettings.enabled) return;

  const commentSelectors = [
    "article.comments-comment-entity",
    "article.comments-comment-entity--reply",
    "[data-id*='comment']",
  ];

  commentSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((comment) => {
      const parentPost = comment.closest("[data-urn*='activity']");
      const postTimestamp = parentPost?.dataset?.postTimestamp || null;
      processComment(comment, postTimestamp);
    });
  });
}

function processPosts() {
  if (!currentSettings.enabled) return;

  const postSelectors = [".feed-shared-update-v2", ".update-v2", "[data-urn*='activity']"];

  postSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((post) => {
      processPost(post);
    });
  });
}

function processAll() {
  if (!currentSettings.enabled) return;
  processPosts();
  processComments();
}

const observer = new MutationObserver((mutations) => {
  if (currentSettings.enabled) {
    processAll();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initialize
loadSettings().then(() => {
  if (currentSettings.enabled) {
    setTimeout(processAll, 1000);
    processAll();
  }
});
