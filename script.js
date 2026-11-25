

'use strict';

const API = 'https://bible.helloao.org/api';

const $ = id => document.getElementById(id);

const els = {
  name: $('visitorName'),
  date: $('verseDate'),
  language: $('languageSelect'),
  translation: $('translationSelect'),
  find: $('getVerseBtn'),
  status: $('sourceStatus'),
  result: $('dailyResult'),
  greeting: $('greetingText'),
  verse: $('verseText'),
  reference: $('verseReference'),
  license: $('licenseNotice'),
  readVerse: $('readVerseBtn'),
  explain: $('explainBtn'),
  stop: $('stopSpeechBtn'),
  explanationBox: $('explanationBox'),
  explanation: $('explanationText'),
  readExplanation: $('readExplanationBtn'),
  book: $('bookSelect'),
  chapter: $('chapterSelect'),
  loadChapter: $('loadChapterBtn'),
  chapterToolbar: $('chapterToolbar'),
  chapterHeading: $('chapterHeading'),
  readChapter: $('readChapterBtn'),
  chapterContent: $('chapterContent'),
  toast: $('toast')
};

let translations = [];
let currentVerse = null;
let currentExplanation = '';
let currentTranslation = null;
let currentChapterVerses = [];
let speech = null;
let toastTimer;
const chapterCache = new Map();
const booksCache = new Map();

const DAILY_REFERENCES = [
  ['PSA',23,1], ['PSA',46,1], ['PSA',34,18],
  ['PSA',55,22], ['PSA',121,1], ['PSA',37,5],
  ['PSA',119,105], ['PSA',27,1],
  ['ISA',41,10], ['ISA',40,31], ['ISA',43,2],
  ['JER',29,11], ['MAT',11,28], ['MAT',6,34],
  ['MAT',5,9], ['MAT',6,33], ['JHN',3,16],
  ['JHN',14,27], ['JHN',15,5], ['ROM',8,28],
  ['ROM',12,12], ['PHP',4,6], ['PHP',4,7],
  ['PHP',4,13], ['PHP',4,19], ['1PE',5,7],
  ['PRO',3,5], ['PRO',16,3], ['HEB',11,1],
  ['JOS',1,9], ['2CO',12,9], ['LAM',3,22],
  ['1JN',4,18], ['GAL',6,9], ['EPH',2,10],
  ['DEU',31,6], ['EXO',14,14], ['PSA',91,1],
  ['PSA',16,8], ['PSA',30,5], ['ROM',15,13],
  ['MAT',19,26], ['ISA',26,3], ['JHN',16,33],
  ['PSA',139,14]
];

const TAMIL_MEANINGS = {
  'PSA 23:1':
    'ஒரு மேய்ப்பன் தன் ஆடுகளைப் பாதுகாப்பது போல இயேசு நம்மைப் பார்த்துக்கொள்கிறார். நமக்கு என்ன தேவை என்று அவருக்குத் தெரியும். அதனால் பயப்படாமல் அவரை நம்பலாம்.',

  'PSA 46:1':
    'வாழ்க்கையில் எவ்வளவு பெரிய பிரச்சினை வந்தாலும் நாம் தனியாக இல்லை. கடவுள் நமக்கு உதவவும், நம்மைத் தாங்கவும் இருக்கிறார்.',

  'PSA 34:18':
    'உன் மனம் உடைந்து போயிருந்தாலும் கடவுள் உனக்கு அருகில் இருக்கிறார். உன் கண்ணீரையும் வலியையும் அவர் அறிந்திருக்கிறார்.',

  'PSA 55:22':
    'உன்னால் சமாளிக்க முடியாத கவலைகளைத் தனியாகச் சுமக்காதே. எல்லாவற்றையும் ஜெபத்தில் கடவுளிடம் ஒப்படை. அவர் உன்னைத் தாங்குவார்.',

  'PSA 119:105':
    'இருட்டில் விளக்கு வழி காட்டுவது போல, கடவுளுடைய வார்த்தை வாழ்க்கையில் சரியான பாதையைக் காட்டுகிறது.',

  'ISA 41:10':
    'பயப்படாதே. நீ பலவீனமாக இருக்கும்போது கடவுள் உனக்குப் பலம் தருவார். எந்தச் சூழ்நிலையிலும் அவர் உன்னைக் கைவிடமாட்டார்.',

  'JER 29:11':
    'உன் எதிர்காலம் பற்றி கவலைப்படுகிறாயா? கடவுள் உனக்காக நன்மையான திட்டங்களைக் கொண்டிருக்கிறார் என்ற நம்பிக்கையை இந்த வசனம் நினைவூட்டுகிறது.',

  'MAT 11:28':
    'மன அழுத்தம், கவலை, சோர்வு எல்லாம் அதிகமாக இருக்கிறதா? இயேசுவிடம் மனம் திறந்து பேசு. அவரிடம் ஆறுதலையும் அமைதியையும் தேடு.',

  'MAT 6:34':
    'நாளை என்ன நடக்கும் என்று இன்றே கவலைப்படாதே. இன்று செய்ய வேண்டியதைச் செய். ஒவ்வொரு நாளையும் நம்பிக்கையோடு எதிர்கொள்.',

  'JHN 3:16':
    'கடவுள் நம்மை எவ்வளவு நேசிக்கிறார் என்பதை இந்த வசனம் சொல்கிறது. அந்த அன்பை வெளிப்படுத்தவே இயேசுவை நமக்காக அனுப்பினார்.',

  'JHN 14:27':
    'உலகம் தரும் சந்தோஷம் சூழ்நிலையைப் பொறுத்து மாறலாம். ஆனால் இயேசு தரும் சமாதானம் மனதிற்கு உண்மையான அமைதியைத் தருகிறது.',

  'ROM 8:28':
    'நடக்கும் எல்லாமே உடனே நல்லதாகத் தெரியாது. ஆனாலும் கடவுளை நம்புகிறவர்களின் வாழ்க்கையில் கஷ்டங்களையும் நன்மைக்காகப் பயன்படுத்த அவரால் முடியும்.',

  'PHP 4:6':
    'எல்லாவற்றையும் நினைத்து பதற்றப்படாதே. உன் கவலைகளை ஜெபத்தில் கடவுளிடம் சொல்லு. உன் மனதில் இருப்பதை அவரிடம் பகிர்ந்துகொள்.',

  'PHP 4:7':
    'பிரச்சினைகள் உடனே மறையாவிட்டாலும் கடவுள் தரும் சமாதானம் உன் மனதைப் பாதுகாக்கும். அவரை நம்பிக்கையோடு சார்ந்திரு.',

  '1PE 5:7':
    'உன் மனதில் இருக்கும் எல்லா கவலைகளையும் கடவுளிடம் ஒப்படை. ஏனென்றால் அவர் உன்னை அக்கறையோடு கவனித்துக்கொள்கிறார்.',

  'PRO 3:5':
    'உன் அறிவை மட்டும் நம்பாமல் கடவுளையும் நம்பு. வாழ்க்கையில் முக்கியமான முடிவுகளை எடுக்கும்போது அவருடைய வழிகாட்டுதலைத் தேடு.',

  'JOS 1:9':
    'புதிய விஷயங்களைச் சந்திக்கும்போது பயப்படாதே. தைரியமாக இரு. நீ செல்லும் இடமெல்லாம் கடவுள் உன்னுடன் இருக்கிறார்.',

  '2CO 12:9':
    'நீ பலவீனமாக இருக்கும்போது கூட கடவுளுடைய கிருபை உனக்குப் போதுமானது. எல்லாவற்றையும் தனியாகச் செய்ய வேண்டியதில்லை.',

  'GAL 6:9':
    'நல்லதைச் செய்வதை நிறுத்தாதே. உடனே பலன் கிடைக்கவில்லை என்றாலும் தொடர்ந்து நல்லதைச் செய். சரியான நேரத்தில் பலன் கிடைக்கும்.',

  'PSA 91:1':
    'கடவுளை நம்பி அவருடன் நெருக்கமாக வாழும்போது அவர் உனக்கு அடைக்கலமாக இருக்கிறார். அவருடைய பாதுகாப்பை நம்பு.'
};

function toast(message) {
  if (!els.toast) return;

  els.toast.textContent = message;
  els.toast.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    els.toast.classList.remove('show');
  }, 3500);
}

async function api(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Bible API error: ' + response.status);
  }

  return response.json();
}

function hashString(value) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function todayString() {
  const d = new Date();

  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0')
  ].join('-');
}

function translationId(t) {
  return t.id || t.translationId;
}

function getLanguage(t) {
  return t.language || '';
}

// LOAD ALL AVAILABLE LANGUAGES

function loadLanguages(preferred = 'tam') {
  const map = new Map();

  translations.forEach(t => {
    const code = getLanguage(t);

    if (code) {
      map.set(
        code,
        t.languageName || t.languageEnglishName || code
      );
    }
  });

  const languages = [...map.entries()]
    .sort((a, b) => a[1].localeCompare(b[1]));

  els.language.innerHTML = '';

  languages.forEach(([code, name]) => {
    const option = document.createElement('option');

    option.value = code;
    option.textContent = `${name} (${code})`;

    els.language.appendChild(option);
  });

  els.language.value = map.has(preferred)
    ? preferred
    : (map.has('eng') ? 'eng' : languages[0]?.[0]);

  els.language.disabled = false;

  loadTranslations();
}

// LOAD TRANSLATIONS

function loadTranslations() {
  const language = els.language.value;

  const filtered = translations.filter(
    t => getLanguage(t) === language
  );

  els.translation.innerHTML = '';

  filtered.forEach(t => {
    const option = document.createElement('option');

    option.value = translationId(t);
    option.textContent =
      `${t.name || t.englishName || option.value} (${option.value})`;

    els.translation.appendChild(option);
  });

  els.translation.disabled = !filtered.length;

  if (!filtered.length) {
    toast('No translation available for this language.');
    return;
  }

  const preferred =
    filtered.find(t => translationId(t) === 'TAM') || filtered[0];

  els.translation.value = translationId(preferred);

  currentTranslation = preferred;

  loadBooks();
}

// LOAD BOOKS

async function getBooks(id) {
  if (booksCache.has(id)) {
    return booksCache.get(id);
  }

  const data = await api(`${API}/${encodeURIComponent(id)}/books.json`);

  const books = data.books || [];

  booksCache.set(id, books);

  return books;
}

async function loadBooks() {
  const id = els.translation.value;

  if (!id) return;

  els.book.disabled = true;
  els.chapter.disabled = true;
  els.loadChapter.disabled = true;

  try {
    const books = await getBooks(id);

    els.book.innerHTML = '';

    books.forEach(book => {
      const option = document.createElement('option');

      option.value = book.id;
      option.textContent = book.commonName || book.name;
      option.dataset.total = book.numberOfChapters || 1;

      els.book.appendChild(option);
    });

    els.book.disabled = !books.length;

    setChapters();

  } catch (error) {
    console.error(error);
    toast('Could not load Bible books. Please refresh.');
  }
}

function setChapters() {
  const selected = els.book.selectedOptions[0];

  if (!selected) return;

  const total = Number(selected.dataset.total || 1);

  els.chapter.innerHTML = '';

  for (let i = 1; i <= total; i++) {
    const option = document.createElement('option');

    option.value = i;
    option.textContent = `Chapter ${i}`;

    els.chapter.appendChild(option);
  }

  els.chapter.disabled = false;
  els.loadChapter.disabled = false;
}

// GET CHAPTER

async function getChapter(id, book, number) {
  const key = `${id}/${book}/${number}`;

  if (chapterCache.has(key)) {
    return chapterCache.get(key);
  }

  const data = await api(
    `${API}/${encodeURIComponent(id)}/${encodeURIComponent(book)}/${number}.simple.json`
  );

  const verses = (data.chapter?.content || [])
    .filter(item => item.type === 'verse');

  const result = { data, verses };

  chapterCache.set(key, result);

  return result;
}

// DAILY VERSE

async function getDailyVerse() {
  const name = els.name.value.trim();
  const date = els.date.value;
  const id = els.translation.value;

  if (!name) {
    toast('Please enter your name.');
    els.name.focus();
    return;
  }

  if (!date || !id) {
    toast('Choose a date and Bible translation.');
    return;
  }

  els.find.disabled = true;
  els.result.hidden = true;
  els.explanationBox.hidden = true;

  stopVoice();

  els.status.textContent = 'Finding your daily verse...';

  try {
    const books = await getBooks(id);
    const available = new Set(books.map(b => b.id));

    const seed = hashString(name.toLowerCase() + date);
    const start = seed % DAILY_REFERENCES.length;

    let found = null;

    for (let i = 0; i < DAILY_REFERENCES.length; i++) {
      const [book, chapter, verseNumber] =
        DAILY_REFERENCES[(start + i) % DAILY_REFERENCES.length];

      if (!available.has(book)) continue;

      try {
        const data = await getChapter(id, book, chapter);

        const verse = data.verses.find(
          v => Number(v.number) === verseNumber
        );

        if (verse?.text) {
          found = {
            text: verse.text,
            book,
            chapter,
            verse: verseNumber,
            bookName:
              data.data.book?.commonName ||
              data.data.book?.name ||
              book,
            translation: data.data.translation
          };

          break;
        }
      } catch (error) {
        console.warn('Verse not available:', book, error);
      }
    }

    if (!found) {
      throw new Error(
        'Could not find a daily verse in this translation.'
      );
    }

    currentVerse = found;

    const displayDate = new Date(date + 'T12:00:00')
      .toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

    els.greeting.textContent = `For ${name} · ${displayDate}`;

    els.verse.textContent = `“${found.text}”`;

    els.reference.textContent =
      `${found.bookName} ${found.chapter}:${found.verse} · ${found.translation?.name || id}`;

    els.license.textContent =
      found.translation?.licenseNotice ||
      found.translation?.licenseNotes || '';

    const key = `${found.book} ${found.chapter}:${found.verse}`;

    currentExplanation =
      TAMIL_MEANINGS[key] ||
      'இந்த வசனம் கடவுளை நம்பிக்கையோடு சார்ந்து வாழ நம்மை நினைவூட்டுகிறது. உன் வாழ்க்கையில் இப்போது இருக்கும் சூழ்நிலையை நினைத்துப் பார். கடவுளிடம் ஜெபித்து, அவருடைய வார்த்தையை உன் வாழ்க்கையில் பின்பற்ற முயற்சி செய்.';

    els.result.hidden = false;

    els.status.textContent =
      'Your daily Bible verse is ready. Take a peaceful moment.';

    els.explain.disabled = false;

  } catch (error) {
    console.error(error);

    els.status.textContent = error.message;

    toast('Bible verse could not load. Check your internet connection.');

  } finally {
    els.find.disabled = false;
  }
}

// VOICE SETTINGS

function localeFor(code) {
  const locales = {
    tam: 'ta-IN',
    eng: 'en-US',
    hin: 'hi-IN',
    tel: 'te-IN',
    kan: 'kn-IN',
    mal: 'ml-IN',
    ben: 'bn-IN',
    spa: 'es-ES',
    fra: 'fr-FR',
    deu: 'de-DE',
    por: 'pt-BR',
    ara: 'ar-SA',
    jpn: 'ja-JP',
    zho: 'zh-CN'
  };

  return locales[code] || 'en-US';
}

function speak(text, language) {
  if (!('speechSynthesis' in window)) {
    toast('Voice is not supported in this browser.');
    return;
  }

  if (!text) return;

  stopVoice();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = language;
  utterance.rate = 0.90;
  utterance.pitch = 1;

  const voices = speechSynthesis.getVoices();

  const prefix = language.split('-')[0];

  const voice =
    voices.find(v => v.lang.toLowerCase() === language.toLowerCase()) ||
    voices.find(v => v.lang.toLowerCase().startsWith(prefix));

  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = () => {
    els.stop.disabled = false;
  };

  utterance.onend = () => {
    els.stop.disabled = true;
    speech = null;
  };

  utterance.onerror = event => {
    els.stop.disabled = true;
    speech = null;

    if (!['canceled', 'interrupted'].includes(event.error)) {
      toast('Voice failed. Check your device language voices.');
    }
  };

  speech = utterance;

  speechSynthesis.speak(utterance);
}

function stopVoice() {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }

  speech = null;

  els.stop.disabled = true;
}

// READ VERSE

function readVerse() {
  if (!currentVerse) {
    toast('Find a verse first.');
    return;
  }

  const language = localeFor(
    currentVerse.translation?.language || 'eng'
  );

  speak(currentVerse.text, language);
}

// MODERN TAMIL EXPLANATION + AUTOMATIC VOICE

function explainVerse() {
  if (!currentVerse) {
    toast('Find your daily verse first.');
    return;
  }

  els.explanation.textContent = currentExplanation;

  els.explanationBox.hidden = false;

  // Jesus Tyson narration label.
  // The actual voice is the Tamil voice installed in your device.

  speak(currentExplanation, 'ta-IN');
}

// READ FULL CHAPTER

async function loadSelectedChapter() {
  const id = els.translation.value;
  const book = els.book.value;
  const number = Number(els.chapter.value);

  if (!id || !book || !number) return;

  els.loadChapter.disabled = true;
  els.loadChapter.textContent = 'Opening...';

  try {
    const result = await getChapter(id, book, number);

    currentChapterVerses = result.verses;
    currentTranslation = result.data.translation;

    const bookName =
      result.data.book?.commonName ||
      result.data.book?.name ||
      book;

    els.chapterHeading.textContent = `${bookName} ${number}`;

    els.chapterContent.innerHTML = '';

    result.verses.forEach(verse => {
      const row = document.createElement('div');
      row.className = 'chapter-verse';

      const numberElement = document.createElement('span');
      numberElement.className = 'verse-number';
      numberElement.textContent = verse.number;

      const textElement = document.createElement('p');
      textElement.className = 'verse-line';
      textElement.textContent = verse.text;

      row.append(numberElement, textElement);

      els.chapterContent.appendChild(row);
    });

    els.chapterToolbar.hidden = false;

  } catch (error) {
    console.error(error);
    toast('Could not load this chapter.');
  } finally {
    els.loadChapter.disabled = false;
    els.loadChapter.innerHTML = 'Open chapter <span>→</span>';
  }
}

function readFullChapter() {
  if (!currentChapterVerses.length) {
    toast('Open a chapter first.');
    return;
  }

  const text = currentChapterVerses
    .map(v => `${v.number}. ${v.text}`)
    .join(' ');

  speak(
    text,
    localeFor(currentTranslation?.language || 'eng')
  );
}

// START WEBSITE

async function init() {
  els.date.value = todayString();

  els.find.disabled = true;

  try {
    els.status.textContent = 'Connecting to Bible library...';

    const data = await api(
      `${API}/available_translations.json`
    );

    translations = (data.translations || [])
      .filter(t => t.id && t.language);

    if (!translations.length) {
      throw new Error('No Bible translations found.');
    }

    const tamilAvailable = translations.some(
      t => t.language === 'tam'
    );

    loadLanguages(tamilAvailable ? 'tam' : 'eng');

    els.find.disabled = false;

    els.status.textContent =
      `Connected · ${translations.length} available translation records.`;

  } catch (error) {
    console.error(error);

    els.status.textContent =
      'Could not connect. Please check internet and refresh.';

    toast('Bible library connection failed.');
  }
}

// BUTTON EVENTS

els.language.addEventListener('change', () => {
  loadTranslations();
});

els.translation.addEventListener('change', () => {
  currentTranslation = translations.find(
    t => translationId(t) === els.translation.value
  );

  chapterCache.clear();

  els.result.hidden = true;
  els.chapterToolbar.hidden = true;

  loadBooks();
});

els.find.addEventListener('click', getDailyVerse);

els.readVerse.addEventListener('click', readVerse);

els.explain.addEventListener('click', explainVerse);

els.readExplanation.addEventListener('click', () => {
  speak(currentExplanation, 'ta-IN');
});

els.stop.addEventListener('click', stopVoice);

els.book.addEventListener('change', setChapters);

els.loadChapter.addEventListener('click', loadSelectedChapter);

els.readChapter.addEventListener('click', readFullChapter);

if ('speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
  };
}

// INITIALIZE

init();
