========================================================================
Translate words, texts & convert to MP3 — Chrome Extension (Manifest V3)
Version 1.1.2 — Chrome Web Store Ready
========================================================================

HOW TO SUBMIT TO CHROME WEB STORE DEVELOPER DASHBOARD:
------------------------------------------------------
1. In this directory (`chrome-extension/`), select all contents:
   - manifest.json
   - background.js
   - popup.html
   - popup.js
   - lame.min.js
   - icons/ (icon16.png, icon48.png, icon128.png)
2. Compress (ZIP) these items directly into a file, for example: `extension_v1.1.2.zip`.
   (Ensure manifest.json is at the root of the ZIP file).
3. Open your Chrome Web Store Developer Dashboard:
   https://chrome.google.com/webstore/devconsole
4. Click on your extension item ("Translate words, texts & convert to MP3").
5. Click "Package" -> "Upload new package" -> Select your `extension_v1.1.2.zip`.
6. Submit for review!

WHAT WAS FIXED FOR STORE APPROVAL:
----------------------------------
✓ REJECTION VIOLATION FIXED ("Purple Potassium"):
  Removed unused 'activeTab' permission from manifest.json.
  The extension now requests only the narrowest essential permissions:
  - storage: for saving vocabulary and user preferences
  - contextMenus: for right-click word translation
  - downloads: for saving generated MP3 audio files to disk
  (No 'tts' permission requested since Web Speech API is used natively).
  
✓ HOST PERMISSIONS AUDITED & RESTRICTED:
  Removed broad wildcard '*://*/*' from host_permissions.
  Restricted solely to:
  - https://translate.googleapis.com/* (Translation API)
  - https://translate.google.com/* (Audio synthesis stream)

✓ DESIGN & PERSISTENT POPUP WINDOW:
  - Exact match of website visual design: Deep Slate Night mode (#020617 / #0f172a),
    clean Day mode (#f8fafc / #ffffff), and signature amber badges (#f59e0b).
  - Added "📌 Pop-out Window" button: opens extension in standalone floating window
    that will NEVER automatically close on focus loss.
  - Linked to your official website: https://www.transltor.xyz (policy compliant).
========================================================================
