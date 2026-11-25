
/* ==========================================
   STILL WITH JESUS - COMPLETE SCRIPT
   Bible API: bible.helloao.org
========================================== */

const API = "https://bible.helloao.org/api";

// HTML elements
const $ = (id) => document.getElementById(id);

const els = {
  visitorName: $("visitorName"),
  verseDate: $("verseDate"),
  languageSelect: $("languageSelect"),
  translationSelect: $("translationSelect"),
  getVerseBtn: $("getVerseBtn"),
  sourceStatus: $("sourceStatus"),
  dailyResult: $("dailyResult"),
  greetingText: $("greetingText"),
  verseText: $("verseText"),
  verseReference: $("verseReference"),
  licenseNotice: $("licenseNotice"),
  readVerseBtn: $("readVerseBtn"),
  explainBtn: $("explainBtn"),
  stopSpeechBtn: $("stopSpeechBtn"),
  explanationBox: $("explanationBox"),
  explanationText: $("explanationText"),
  readExplanationBtn: $("readExplanationBtn"),
  bookSelect: $("bookSelect"),
  chapterSelect: $("chapterSelect"),
  loadChapterBtn: $("loadChapterBtn"),
  chapterToolbar: $("chapterToolbar"),
  chapterHeading: $("chapterHeading"),
  readChapterBtn: $("readChapterBtn"),
  chapterContent: $("chapterContent"),
  toast: $("toast")
};

// App data
let translations = [];
let availableLanguages = [];
let books = [];
let currentVerse = "";
let currentExplanation = "";
let currentChapterText = "";
let currentLanguage = "eng";
let currentTranslation = "";
let speechRate = 1;

// Daily verse references
const DAILY_REFERENCES = [
  ["PSA", 23, 1],
  ["JHN", 3, 16],
  ["ISA", 41, 10],
  ["PHP", 4, 13],
  ["JER", 29, 11],
  ["PSA", 46, 1],
  ["ROM", 8, 28],
  ["MAT", 11, 28],
  ["PRO", 3, 5],
  ["PSA", 27, 1],
  ["JHN", 14, 27],
  ["ROM", 12, 12],
  ["PSA", 34, 8],
  ["ISA", 40, 31],
  ["1PE", 5, 7],
  ["PSA", 119, 105],
  ["MAT", 6, 33],
  ["HEB", 11, 1],
  ["PSA", 37, 4],
  ["2CO", 5, 7],
  ["JOS", 1, 9],
  ["PSA", 91, 1],
  ["LAM", 3, 22],
  ["ROM", 15, 13],
  ["1CO", 16, 14],
  ["PSA", 121, 1],
  ["MAT", 5, 16],
  ["GAL", 6, 9],
  ["JHN", 8, 12],
  ["PSA", 55, 22]
];

// Simple explanations for selected verses
const TAMIL_MEANINGS = {
  "PSA-23-1": "கர்த்தர் நம்முடைய மேய்ப்பராக இருக்கிறார். அவர் நம்மை அன்புடன் வழிநடத்தி, நமக்குத் தேவையானவற்றைக் கவனித்துக் கொள்கிறார்.",
  "JHN-3-16": "தேவன் உலகத்தின் மீது அளவற்ற அன்பு வைத்திருக்கிறார். நமக்கு நித்திய ஜீவன் கிடைக்கும்படி இயேசுவை நமக்காகத் தந்தார்.",
  "ISA-41-10": "பயப்பட வேண்டாம். தேவன் உன்னோடு இருக்கிறார். கடினமான நேரங்களிலும் அவர் உன்னைப் பலப்படுத்துவார்.",
  "PHP-4-13": "கிறிஸ்து தரும் பெலனால் நம்மால் எல்லாவற்றையும் எதிர்கொள்ள முடியும்.",
  "JER-29-11": "உனக்காக தேவன் நல்ல எதிர்காலத்தையும் நம்பிக்கையையும் வைத்திருக்கிறார்.",
  "PSA-46-1": "தேவன் நமக்கு அடைக்கலமும் பெலனும். துன்ப நேரங்களில் உதவ அவர் எப்போதும் அருகில் இருக்கிறார்.",
  "MAT-11-28": "சோர்வாகவும் பாரம் சுமப்பவர்களாகவும் இருப்பவர்கள் இயேசுவிடம் வரலாம். அவர் நமக்கு இளைப்பாறுதல் தருகிறார்.",
  "PRO-3-5": "நம்முடைய அறிவை மட்டும் நம்பாமல், முழு இருதயத்தோடும் தேவனை நம்ப வேண்டும்.",
  "JHN-14-27": "இயேசு தரும் சமாதானம் உலகம் தரும் சமாதானத்தைப் போன்றது அல்ல. அதனால் நம் இருதயம் கலங்க வேண்டியதில்லை.",
  "JOS-1-9": "தைரியமாகவும் உறுதியாகவும் இரு. நீ செல்லும் இடமெல்லாம் தேவன் உன்னோடு இருப்பார்."
};

const ENGLISH_MEANINGS = {
  "PSA-23-1": "God is our loving shepherd. He guides us, cares for us, and provides what we truly need.",
  "JHN-3-16": "God loves the world so much that He gave His Son, Jesus, so that everyone who believes in Him can have eternal life.",
  "ISA-41-10": "You do not need to be afraid. God is with you, strengthens you, and helps you through difficult times.",
  "PHP-4-13": "Through Christ, who gives us strength, we can face every situation.",
  "JER-29-11": "God has plans filled with hope and a future for His people.",
  "PSA-46-1": "God is our refuge and strength. He is always ready to help us in difficult times.",
  "MAT-11-28": "Jesus invites those who are tired and carrying heavy burdens to come to Him and find rest.",
  "PRO-3-5": "Trust God with all your heart instead of depending only on your own understanding.",
  "JHN-14-27": "Jesus gives a peace that the world cannot give. We can find comfort and courage in Him.",
  "JOS-1-9": "Be strong and courageous. God is with you wherever you go."
};

// Utility
function showStatus(message) {
  if (els.sourceStatus) els.sourceStatus.textContent = message;
}

function showToast(message) {
  if (!els.toast) {
    console.log(message);
    return;
  }

  els.toast.textContent = message;
  els.toast.style.display = "block";

  setTimeout(() => {
    els.toast.style.display = "none";
  }, 3500);
}

async function fetchJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load data. HTTP " + response.status);
  }

  return response.json();
}

function getSelectedLanguage() {
  return els.languageSelect?.value || "eng";
}

function getSelectedTranslation() {
  return els.translationSelect?.value || currentTranslation;
}

function getVoiceLanguage(code) {
  const languageMap = {
    eng: "en-US",
    tam: "ta-IN",
    hin: "hi-IN",
    tel: "te-IN",
    mal: "ml-IN",
    kan: "kn-IN",
    fra: "fr-FR",
    spa: "es-ES",
    deu: "de-DE",
    por: "pt-PT",
    ara: "ar-SA",
    zho: "zh-CN",
    jpn: "ja-JP",
    kor: "ko-KR"
  };

  return languageMap[code] || code || "en-US";
}

// ==========================================
// LOAD LANGUAGES
// ==========================================

async function loadLanguages() {
  try {
    showStatus("Loading available languages...");

    const data = await fetchJSON(
      API + "/available_translations.json"
    );

    translations = data.translations || [];

    // Create unique language list
    const languageMap = new Map();

    translations.forEach((item) => {
      if (!item.language) return;

      if (!languageMap.has(item.language)) {
        languageMap.set(item.language, {
          code: item.language,
          name: item.languageName ||
                item.languageEnglishName ||
                item.language
        });
      }
    });

    availableLanguages = Array.from(languageMap.values());

    if (!els.languageSelect) {
      throw new Error("languageSelect element not found in HTML");
    }

    els.languageSelect.innerHTML = "";

    // English is the default language
    availableLanguages.sort((a, b) => {
      if (a.code === "eng") return -1;
      if (b.code === "eng") return 1;
      return a.name.localeCompare(b.name);
    });

    availableLanguages.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.code;
      option.textContent = language.name;
      els.languageSelect.appendChild(option);
    });

    const englishAvailable = availableLanguages.some(
      (language) => language.code === "eng"
    );

    currentLanguage = englishAvailable
      ? "eng"
      : availableLanguages[0]?.code;

    els.languageSelect.value = currentLanguage;

    els.languageSelect.disabled = false;

    await loadTranslations(currentLanguage);

    showStatus(
      availableLanguages.length + " languages available"
    );

  } catch (error) {
    console.error("Language loading error:", error);
    showStatus("Language loading failed: " + error.message);
    showToast("Could not load languages. Refresh and try again.");
  }
}

// ==========================================
// LOAD TRANSLATIONS
// ==========================================

async function loadTranslations(languageCode) {
  if (!els.translationSelect) return;

  currentLanguage = languageCode;

  const matching = translations.filter(
    (item) => item.language === languageCode
  );

  els.translationSelect.innerHTML = "";

  if (matching.length === 0) {
    els.translationSelect.disabled = true;
    showToast("No translations found for this language.");
    return;
  }

  matching.sort((a, b) =>
    (a.name || a.id).localeCompare(b.name || b.id)
  );

  matching.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name || item.id;
    els.translationSelect.appendChild(option);
  });

  // Prefer a translation marked as a default, otherwise first result
  const preferred = matching.find(
    (item) => item.id === "BSB" && languageCode === "eng"
  );

  currentTranslation = preferred
    ? preferred.id
    : matching[0].id;

  els.translationSelect.value = currentTranslation;
  els.translationSelect.disabled = false;

  await loadBooks();
}

// ==========================================
// LOAD BIBLE BOOKS
// ==========================================

async function loadBooks() {
  try {
    const translationId = getSelectedTranslation();

    if (!translationId) return;

    currentTranslation = translationId;

    showStatus("Loading Bible books...");

    const data = await fetchJSON(
      `${API}/${translationId}/books.json`
    );

    books = data.books || [];

    if (!els.bookSelect) return;

    els.bookSelect.innerHTML = "";

    books.forEach((book) => {
      const option = document.createElement("option");
      option.value = book.id;
      option.textContent = book.name || book.commonName;
      option.dataset.chapters = book.numberOfChapters;
      els.bookSelect.appendChild(option);
    });

    if (books.length > 0) {
      els.bookSelect.value = books[0].id;
      updateChapterOptions();
    }

    showStatus("Bible books loaded successfully.");

  } catch (error) {
    console.error("Books loading error:", error);
    showStatus("Could not load books: " + error.message);
  }
}

// ==========================================
// CHAPTER DROPDOWN
// ==========================================

function updateChapterOptions() {
  if (!els.bookSelect || !els.chapterSelect) return;

  const selectedBook = books.find(
    (book) => book.id === els.bookSelect.value
  );

  if (!selectedBook) return;

  els.chapterSelect.innerHTML = "";

  const total = Number(selectedBook.numberOfChapters) || 1;

  for (let i = 1; i <= total; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = "Chapter " + i;
    els.chapterSelect.appendChild(option);
  }
}

// ==========================================
// GET CHAPTER DATA
// ==========================================

async function getChapter(translation, book, chapter) {
  const url =
    `${API}/${translation}/${book}/${chapter}.simple.json`;

  return fetchJSON(url);
}

function getVerseContents(chapterData) {
  return chapterData?.chapter?.content || [];
}

function findVerse(chapterData, verseNumber) {
  return getVerseContents(chapterData).find(
    (item) =>
      item.type === "verse" &&
      Number(item.number) === Number(verseNumber)
  );
}

// ==========================================
// DAILY VERSE
// ==========================================

async function getDailyVerse() {
  try {
    const translation = getSelectedTranslation();

    if (!translation) {
      showToast("Please select a Bible translation.");
      return;
    }

    showStatus("Finding your daily Bible verse...");

    const dateValue = els.verseDate?.value ||
      new Date().toISOString().slice(0, 10);

    const date = new Date(dateValue + "T00:00:00");

    const dayIndex = Math.floor(
      date.getTime() / 86400000
    ) % DAILY_REFERENCES.length;

    const reference = DAILY_REFERENCES[
      (dayIndex + DAILY_REFERENCES.length) %
      DAILY_REFERENCES.length
    ];

    const [book, chapter, verseNumber] = reference;

    const data = await getChapter(
      translation,
      book,
      chapter
    );

    const verse = findVerse(data, verseNumber);

    if (!verse) {
      throw new Error("This verse is not available in this translation.");
    }

    currentVerse = verse.text || "";

    const bookInfo = books.find((item) => item.id === book);
    const bookName = bookInfo
      ? (bookInfo.name || bookInfo.commonName)
      : book;

    const referenceText =
      `${bookName} ${chapter}:${verseNumber}`;

    if (els.greetingText) {
      const name = els.visitorName?.value.trim();
      els.greetingText.textContent = name
        ? `God bless you, ${name}.`
        : "God bless you.";
    }

    if (els.verseText) {
      els.verseText.textContent = currentVerse;
    }

    if (els.verseReference) {
      els.verseReference.textContent = referenceText;
    }

    if (els.dailyResult) {
      els.dailyResult.style.display = "block";
    }

    const translationInfo = translations.find(
      (item) => item.id === translation
    );

    if (els.licenseNotice) {
      els.licenseNotice.textContent =
        translationInfo?.licenseNotice || "";
    }

    currentExplanation = "";

    if (els.explanationBox) {
      els.explanationBox.style.display = "none";
    }

    showStatus("Your daily verse is ready.");

  } catch (error) {
    console.error("Daily verse error:", error);
    showStatus("Could not load verse: " + error.message);
    showToast("Verse loading failed. Try another translation.");
  }
}

// ==========================================
// EXPLAIN VERSE
// ==========================================

function getCurrentVerseKey() {
  if (!els.verseReference) return "";

  const reference = els.verseReference.textContent.trim();

  const match = reference.match(/^(.+?)\s+(\d+):(\d+)$/);

  if (!match) return "";

  const bookName = match[1].toLowerCase();
  const chapter = match[2];
  const verse = match[3];

  const book = books.find((item) =>
    (item.name || "").toLowerCase() === bookName ||
    (item.commonName || "").toLowerCase() === bookName
  );

  return book
    ? `${book.id}-${chapter}-${verse}`
    : "";
}

function explainVerse() {
  if (!currentVerse) {
    showToast("Load a daily verse first.");
    return;
  }

  const key = getCurrentVerseKey();
  const tamilSelected = getSelectedLanguage() === "tam";

  if (tamilSelected) {
    currentExplanation =
      TAMIL_MEANINGS[key] ||
      "இந்த வசனம் தேவனை நம்பி, அவருடைய அன்பையும் வழிகாட்டுதலையும் நம் வாழ்க்கையில் ஏற்றுக்கொள்ள நமக்கு நினைவூட்டுகிறது.";
  } else {
    currentExplanation =
      ENGLISH_MEANINGS[key] ||
      "This verse reminds us to trust God, seek His guidance, and live with faith, hope, and love.";
  }

  if (els.explanationText) {
    els.explanationText.textContent = currentExplanation;
  }

  if (els.explanationBox) {
    els.explanationBox.style.display = "block";
  }
}

// ==========================================
// TEXT TO SPEECH
// ==========================================

function speakText(text, languageCode) {
  if (!text) {
    showToast("There is no text to read.");
    return;
  }

  if (!("speechSynthesis" in window)) {
    showToast("Speech is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = getVoiceLanguage(languageCode);
  utterance.rate = speechRate;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  const languagePrefix = utterance.lang.toLowerCase().split("-")[0];

  const matchingVoice = voices.find(
    (voice) =>
      voice.lang.toLowerCase().startsWith(languagePrefix)
  );

  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  utterance.onerror = (event) => {
    console.error("Speech error:", event.error);
    showToast("Voice could not play. Check your browser voices.");
  };

  window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function changeSpeechSpeed() {
  const speeds = [0.75, 1, 1.25, 1.5, 0.5];

  const currentIndex = speeds.indexOf(speechRate);

  speechRate = speeds[
    (currentIndex + 1) % speeds.length
  ];

  const button = $("voiceSpeedBtn");

  if (button) {
    button.textContent = `Voice Speed: ${speechRate}x`;
  }

  showToast("Voice speed: " + speechRate + "x");
}

// ==========================================
// READ FULL CHAPTER
// ==========================================

async function loadSelectedChapter() {
  try {
    const translation = getSelectedTranslation();
    const book = els.bookSelect?.value;
    const chapter = els.chapterSelect?.value;

    if (!translation || !book || !chapter) {
      showToast("Select a book and chapter first.");
      return;
    }

    showStatus("Loading chapter...");

    const data = await getChapter(
      translation,
      book,
      chapter
    );

    const content = getVerseContents(data);

    if (!els.chapterContent) return;

    els.chapterContent.innerHTML = "";

    const bookInfo = books.find(
      (item) => item.id === book
    );

    const bookName = bookInfo
      ? (bookInfo.name || bookInfo.commonName)
      : book;

    if (els.chapterHeading) {
      els.chapterHeading.textContent =
        `${bookName} - Chapter ${chapter}`;
    }

    const allVerses = [];

    content.forEach((item) => {
      if (item.type !== "verse") return;

      const verseText = item.text || "";
      allVerses.push(
        `Verse ${item.number}. ${verseText}`
      );

      const paragraph = document.createElement("p");
      paragraph.className = "bible-verse";

      const number = document.createElement("strong");
      number.textContent = item.number + ". ";

      const text = document.createElement("span");
      text.textContent = verseText;

      paragraph.appendChild(number);
      paragraph.appendChild(text);

      els.chapterContent.appendChild(paragraph);
    });

    currentChapterText = allVerses.join(" ");

    if (els.chapterToolbar) {
      els.chapterToolbar.style.display = "block";
    }

    showStatus("Chapter loaded successfully.");

  } catch (error) {
    console.error("Chapter error:", error);
    showStatus("Chapter loading failed: " + error.message);
    showToast("Could not load this chapter.");
  }
}

// ==========================================
// VOICE SPEED BUTTON
// ==========================================

function createSpeedButton() {
  if ($("voiceSpeedBtn")) return;

  const readButton = els.readVerseBtn;

  if (!readButton || !readButton.parentElement) return;

  const button = document.createElement("button");

  button.id = "voiceSpeedBtn";
  button.type = "button";
  button.textContent = "Voice Speed: 1x";
  button.addEventListener("click", changeSpeechSpeed);

  readButton.parentElement.appendChild(button);
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEvents() {
  els.languageSelect?.addEventListener("change", async (event) => {
    stopSpeech();

    await loadTranslations(event.target.value);

    if (els.dailyResult) {
      els.dailyResult.style.display = "none";
    }

    showStatus("Language changed. Select your verse again.");
  });

  els.translationSelect?.addEventListener("change", async (event) => {
    currentTranslation = event.target.value;

    await loadBooks();

    if (els.dailyResult) {
      els.dailyResult.style.display = "none";
    }
  });

  els.bookSelect?.addEventListener(
    "change",
    updateChapterOptions
  );

  els.getVerseBtn?.addEventListener(
    "click",
    getDailyVerse
  );

  els.readVerseBtn?.addEventListener("click", () => {
    speakText(currentVerse, getSelectedLanguage());
  });

  els.explainBtn?.addEventListener(
    "click",
    explainVerse
  );

  els.readExplanationBtn?.addEventListener("click", () => {
    speakText(currentExplanation, getSelectedLanguage());
  });

  els.stopSpeechBtn?.addEventListener(
    "click",
    stopSpeech
  );

  els.loadChapterBtn?.addEventListener(
    "click",
    loadSelectedChapter
  );

  els.readChapterBtn?.addEventListener("click", () => {
    speakText(currentChapterText, getSelectedLanguage());
  });
}

// ==========================================
// START WEBSITE
// ==========================================

async function init() {
  setupEvents();
  createSpeedButton();

  if (els.verseDate) {
    els.verseDate.value = new Date()
      .toISOString()
      .slice(0, 10);
  }

  if (els.languageSelect) {
    els.languageSelect.disabled = true;
  }

  if (els.translationSelect) {
    els.translationSelect.disabled = true;
  }

  await loadLanguages();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
