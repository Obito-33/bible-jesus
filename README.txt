STILL WITH JESUS — WEBSITE PROJECT
==================================

FILES
-----
index.html  Main website structure
style.css   Peaceful responsive design
script.js   Bible API, daily verse, Bible reader, Tamil explanations and voice controls

HOW TO RUN
----------
1. Extract the ZIP file.
2. Keep all three files in the same folder.
3. For local testing, open the folder with VS Code Live Server (or another local web server). Some browsers restrict API requests from a directly opened file:// page.
4. For public use, publish the three files on GitHub Pages or another static hosting service.

HOW IT WORKS
------------
- The site retrieves available Bible translations from the Free Use Bible API:
  https://bible.helloao.org/api/available_translations.json
- It loads the selected translation's books and chapter text from that API.
- The daily verse is selected consistently using the visitor name and chosen date.
- The Tamil explanations for the included daily passages are written in simple, modern Tamil.
- The Explain button displays the explanation and automatically starts Tamil speech.
- Read-aloud uses the browser's built-in speechSynthesis feature.

IMPORTANT VOICE NOTE
--------------------
"Jesus Tyson" is the narrator label shown in the website. The actual spoken voice is selected from voices installed in the visitor's browser/device. The site prefers a Tamil (ta-IN) voice for explanations, but a matching voice must be available on that device. This is not a custom cloned voice and does not require an API key.

IMPORTANT BIBLE CONTENT NOTE
----------------------------
This connects to a third-party public Bible API, so an internet connection is required. The language and translation list is whatever that API currently makes available. It cannot guarantee every Bible edition ever published. Each translation may have its own copyright/license terms; the site displays any license notice returned by the API.

TROUBLESHOOTING
---------------
- If translations do not load, check the internet connection and refresh.
- If a verse is not present in a selected translation, the site tries other daily passages.
- If Tamil voice does not play, install/enable a Tamil text-to-speech voice in your operating system/browser, then reload the site.
- Voice playback can require a user click because browsers restrict automatic audio.
