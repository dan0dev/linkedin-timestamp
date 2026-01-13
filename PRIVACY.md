# Privacy Policy for LinkedIn Post Date Extractor

**Last Updated:** January 13, 2026

## Overview

LinkedIn Post Date Extractor is a browser extension that extracts and displays precise timestamps from LinkedIn posts and comments directly in your browser.

## Data Collection and Usage

**We do NOT collect, store, transmit, or share any user data whatsoever.**

### What This Extension Does:

1. **Reads LinkedIn post IDs** from the web pages you visit on LinkedIn.com
2. **Performs local mathematical calculations** to extract timestamps from these IDs
3. **Displays the results** directly on the LinkedIn page you're viewing

### What This Extension Does NOT Do:

- ❌ Does NOT collect personal information
- ❌ Does NOT track your browsing history
- ❌ Does NOT transmit data to any external servers
- ❌ Does NOT use cookies or local storage for tracking
- ❌ Does NOT access your LinkedIn account credentials
- ❌ Does NOT share data with third parties
- ❌ Does NOT use analytics or telemetry

## Permissions Explained

The extension requires the following permission:

### `activeTab`
- **Purpose:** Allows the extension to read the content of LinkedIn pages you actively visit
- **Usage:** Only used to identify post IDs in the page DOM and replace relative timestamps with exact dates
- **Scope:** Limited to pages you explicitly navigate to on linkedin.com
- **Data Processing:** All processing happens locally in your browser; no data leaves your device

## Data Processing

All timestamp extraction and formatting happens **entirely within your browser**. The extension:

1. Extracts the post/comment ID from the LinkedIn page structure
2. Uses a mathematical bit-shift operation to decode the embedded timestamp
3. Formats the timestamp according to your browser's locale settings
4. Displays the result on the page

**No network requests are made. No data is sent anywhere.**

## Third-Party Services

This extension does not integrate with, communicate with, or share data with any third-party services, analytics platforms, or external servers.

## Updates to Privacy Policy

Any changes to this privacy policy will be reflected in extension updates. The "Last Updated" date at the top will be modified accordingly.

## Open Source

This extension's source code is available for review, ensuring complete transparency about its operation and data handling practices.

## Contact

If you have questions about this privacy policy or the extension's data handling, please open an issue on the project's repository.

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)

Since no user data is collected, stored, or transmitted, there are no data subject rights to exercise (as there is no data to access, correct, or delete).

---

**Summary:** This extension operates entirely locally in your browser and collects absolutely no data. Your privacy is fully protected.
