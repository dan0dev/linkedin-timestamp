# 🕐 LinkedIn Post Date Extractor

<div align="center">

**Stop guessing. Start knowing.**

Transform LinkedIn's vague "2h ago" into precise timestamps like **"01/13/2026, 1:29:45 PM"**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?style=for-the-badge&logo=google-chrome)](https://github.com/dan0dev/linkedin-timestamp)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green?style=for-the-badge)](https://developer.chrome.com/docs/extensions/mv3/)
[![Privacy First](https://img.shields.io/badge/Privacy-First-orange?style=for-the-badge&logo=shield)](https://github.com/dan0dev/linkedin-timestamp)

*Because "3 days ago" doesn't cut it when you need the facts.*

[Installation](#-quick-start) • [Features](#-features) • [How It Works](#-how-it-works) • [Use Cases](#-use-cases)

![LinkedIn Post Date Extractor Demo](https://i.imgur.com/pmbHKlc.jpeg)

</div>

---

## 🤔 The Problem

LinkedIn shows you:
```
"Posted 2h ago"
"3d ago"
"1w ago"
```

**But you need to know:**
- Did they post this before or after the news broke?
- Was this comment immediate or came days later?
- What's the exact timeline of this conversation?

**LinkedIn hides the truth. We reveal it.**

---

## ✨ The Solution

This extension automatically decodes LinkedIn's post IDs to reveal **exact timestamps** hidden in plain sight.

### Before → After

| LinkedIn Shows | Extension Reveals |
|----------------|-------------------|
| `2h ago` | `01/13/2026, 1:29:45 PM (2 hours ago)` |
| `3d ago` | `01/10/2026, 9:15:22 AM (3 days ago)` |
| `1w ago` | `01/06/2026, 4:30:10 PM (1 week ago)` |

**Plus:** See time differences in comment threads!
```
Post: 01/13/2026, 8:00:00 AM (5 hours ago)
├─ Comment: 01/13/2026, 8:05:00 AM [5 minutes after post] ← Quick!
└─ Reply: 01/13/2026, 10:30:00 AM [2 hours 30 minutes after post] ← Later
```

---

## 🚀 Quick Start

### Installation (2 minutes)

1. **Download** this repository or clone it:
   ```bash
   git clone https://github.com/dan0dev/linkedin-timestamp.git
   ```

2. **Build** the extension:
   ```bash
   cd linkedin-timestamp
   ./build.sh         # Mac/Linux
   # or
   build.bat          # Windows
   ```

3. **Load** in Chrome:
   - Open `chrome://extensions/`
   - Enable **Developer mode** (top-right toggle)
   - Click **Load unpacked**
   - Select the `dist` folder
   - ✅ Done!

4. **Use it**:
   - Visit LinkedIn.com
   - **All timestamps are now exact!** 🎉

---

## 🎯 Features

### ⚡ Automatic Mode
**Zero effort. Maximum insight.**

- Browse LinkedIn normally
- **All** relative times convert to exact timestamps
- Works on feeds, profiles, posts, comments, replies
- Real-time updates as you scroll

### 🎯 Manual Extractor
**For specific posts.**

- Click the extension icon
- Paste any LinkedIn post/comment URL
- Get instant timestamp extraction
- Shows both local time and UTC

### 💬 Comment Thread Analysis
**See the conversation flow.**

- Exact timestamp for every comment
- Time difference from original post
- Understand debate timing
- Track rapid vs. delayed responses

Example:
```
Post: January 13, 2026 at 8:00 AM
├─ Alice: 8:05 AM [5 minutes after post] ← Immediate
├─ Bob: 10:30 AM [2.5 hours after post] ← Delayed
└─ Carol: Jan 14, 9:00 AM [1 day after post] ← Very delayed
```

### 🌍 Smart Localization
**Speaks your language.**

Automatically detects your browser language and formats dates accordingly:

- 🇺🇸 English US: `01/13/2026, 1:29:45 PM`
- 🇭🇺 Hungarian: `2026. 01. 13. 13:29:45`
- 🇩🇪 German: `13.01.2026, 13:29:45`
- 🇯🇵 Japanese: `2026/01/13 13:29:45`
- 🇫🇷 French: `13/01/2026 13:29:45`

**Works with ALL browser locales!**

### 🌙 Dark Mode
**Easy on the eyes.**

- Automatically detects system dark mode
- Professional color scheme
- Matches LinkedIn's styling
- Perfect for late-night research

### ♿ Accessibility First
**For everyone.**

- Full WCAG 2.1 AA compliance
- Screen reader friendly
- Keyboard navigation support
- High contrast mode compatible
- ARIA labels on all elements

### 🔒 Privacy Guaranteed
**Your data stays yours.**

- ✅ No tracking
- ✅ No analytics
- ✅ No external servers
- ✅ No data collection
- ✅ 100% local processing
- ✅ Open source code

---

## 🎯 Use Cases

### Who Benefits?

**Journalists & Fact-Checkers**
- Verify exact timing of statements and responses
- Document precise timelines for news stories
- Confirm claims about "immediate" reactions

**Job Seekers**
- Determine if job postings are fresh or old
- Track when companies are actively hiring
- Prioritize recent opportunities

**Business & Market Research**
- Monitor competitor announcement timing
- Analyze posting patterns and engagement windows
- Track industry trends with precise timestamps

**Academic Researchers**
- Collect accurate data for social media studies
- Analyze engagement timing patterns
- Document sources with exact timestamps

**Legal & Compliance Teams**
- Capture exact timestamps for documentation
- Create timestamped evidence for records
- Meet compliance requirements for social media monitoring

---

## 🔬 How It Works

### The Science Behind It

LinkedIn uses **Snowflake IDs** (like Twitter, Discord, Instagram) to generate unique post identifiers. These 64-bit numbers encode the timestamp directly!

**Example Post ID:**
```
7416739544328249344
```

**Decoding Process:**
1. Convert to binary
2. Shift right by 22 bits
3. Result is Unix timestamp in milliseconds
4. Convert to readable date

```javascript
const id = BigInt("7416739544328249344");
const timestampMs = id >> 22n;
const date = new Date(Number(timestampMs));
// Result: January 13, 2026, 7:15:03 AM UTC
```

**It's not hacking—it's just math!** The timestamp is publicly embedded in every LinkedIn URL.

---

## 📊 Comparison

| Feature | LinkedIn Native | This Extension |
|---------|----------------|----------------|
| **Timestamp Precision** | Relative ("2h ago") | Exact (01/13/2026, 1:29 PM) |
| **Comment Timing** | Vague | Exact + time difference |
| **Locale Support** | Limited | All locales |
| **Accessibility** | Basic | WCAG 2.1 AA |
| **Dark Mode** | Yes | Yes |
| **Privacy** | Data collected | 100% private |
| **Historical Posts** | Loses precision | Always accurate |

---

## 🛠️ For Developers

### Tech Stack
- **Manifest V3** (future-proof)
- **Vanilla JavaScript** (no frameworks)
- **CSS Variables** (theming)
- **Content Scripts** (LinkedIn integration)
- **Popup UI** (manual extraction)

### Project Structure
```
linkedin-timestamp/
├── manifest.json          # Extension config
├── content.js            # LinkedIn page script
├── popup.html            # Extension popup
├── popup.js              # Popup logic
├── styles.css            # Styling + dark mode
├── icons/                # Extension icons
├── build.sh              # Build script (Mac/Linux)
├── build.bat             # Build script (Windows)
└── dist/                 # Built extension (ready to load)
```

### Build Process
```bash
# Development
npm install              # Optional (no dependencies needed)
bash build.sh           # Build extension

# The build script:
# 1. Cleans dist/ folder
# 2. Copies all extension files
# 3. Generates dist/ ready for Chrome
```

### Key Functions
```javascript
// Extract timestamp from post ID
function extractTimestampFromId(postId) {
  const id = BigInt(postId);
  const timestampMs = id >> 22n;
  return new Date(Number(timestampMs));
}

// Format with localization
function formatDate(date) {
  return date.toLocaleString(navigator.language, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
```

---

## 🎨 Screenshots

### Popup Interface

![Extension Popup Interface](https://i.imgur.com/QmZIgng.png)

### LinkedIn Feed (Before)
```
John Doe • 3rd+
Product Manager
2h ago • 🌐
```

### LinkedIn Feed (After)
```
John Doe • 3rd+
Product Manager
01/13/2026, 1:29:45 PM (2 hours ago)
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Found a Bug?
Open an issue with:
- Browser version
- Extension version
- Steps to reproduce
- Expected vs actual behavior

### Want to Add Features?
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Ideas We'd Love:
- [ ] Copy timestamp to clipboard
- [ ] Export timestamps (CSV/JSON)
- [ ] Batch URL processing
- [ ] Keyboard shortcuts
- [ ] Custom date formats
- [ ] Chrome Web Store listing

---

## 📖 Documentation

- [Installation Guide](INSTALLATION.md) - Detailed setup instructions
- [How-To Guide](HOW-TO.md) - User manual
- [Build Guide](BUILD.md) - Development workflow
- [UI/UX Improvements](UI-UX-IMPROVEMENTS.md) - Feature details
- [Description](description.txt) - Share with friends

---

## 🔮 Roadmap

### Version 1.0 (Current)
- ✅ Automatic timestamp replacement
- ✅ Manual URL extractor
- ✅ Comment thread support
- ✅ Dark mode
- ✅ Localization
- ✅ Accessibility

### Version 1.1 (Planned)
- [ ] Chrome Web Store release
- [ ] Firefox support
- [ ] Settings panel
- [ ] Custom date formats
- [ ] Export functionality

### Version 2.0 (Future)
- [ ] Historical post tracking
- [ ] Analytics dashboard
- [ ] API for developers
- [ ] Mobile browser support

---

## ❓ FAQ

### **Q: Is this legal?**
**A:** Absolutely! We're only decoding publicly available data from LinkedIn URLs. No hacking, scraping, or API violations.

### **Q: Will LinkedIn ban me?**
**A:** No. This extension only reads data that's already in your browser. It doesn't modify LinkedIn's servers or violate their terms.

### **Q: Does it work with private posts?**
**A:** Yes, for posts you can see. If you can view a post on LinkedIn, the extension can show its timestamp.

### **Q: Why isn't it on the Chrome Web Store?**
**A:** Coming soon! We're finalizing privacy policies and testing.

### **Q: Can I use this for my company?**
**A:** Yes, for internal use. However, GPL-3.0 requires that any modifications you make must remain open source under GPL-3.0. If you distribute modified versions (even internally in some cases), you must share the source code. Cannot be integrated into proprietary closed-source products.

### **Q: Does it slow down LinkedIn?**
**A:** No. The extension is lightweight and only processes visible posts.

### **Q: What about comment timestamps?**
**A:** Fully supported! Shows exact time + difference from original post.

### **Q: Can I change the date format?**
**A:** Currently uses your browser's locale. Custom formats coming in v1.1!

---

## 🙏 Credits

### Inspiration
This project was inspired by similar timestamp extractors for Twitter and Instagram, applying the snowflake ID decoding technique to LinkedIn.

### Built With
- Love for transparency ❤️
- Frustration with vague timestamps 😤
- JavaScript bitwise operators 🔢
- Too much coffee ☕

### Special Thanks
- Everyone tired of "posted recently"
- Journalists who need exact times
- Researchers analyzing social patterns
- You, for reading this far!

---

## 📜 License

**GPL-3.0 License** - Free and open source software.

This project is licensed under the GNU General Public License v3.0 - a strong copyleft license that ensures the software remains free and open source.

**Key Points:**
- ✅ Free to use, modify, and distribute
- ✅ Source code must remain open
- ✅ Modifications must also be GPL-3.0
- ✅ Protects user freedom

See [LICENSE](LICENSE) file for full text.

---

## 🌟 Star This Repo!

If this extension saved you time, helped your research, or revealed truth, **give it a star!** ⭐

It helps others discover this tool and motivates us to keep improving it.

---

## 📞 Contact & Support

- **Issues:** [GitHub Issues](https://github.com/dan0dev/linkedin-timestamp/issues)
- **Discussions:** [GitHub Discussions](https://github.com/dan0dev/linkedin-timestamp/discussions)
- **Email:** [hi@danielkakuk.com](mailto:hi@danielkakuk.com)

---

<div align="center">

**Made with 🔍 for truth-seekers everywhere**

[⬆ Back to Top](#-linkedin-post-date-extractor)

---

**Stop guessing when LinkedIn posts were made. Know for certain.**

*Install now and never wonder "when exactly?" again.*

</div>
