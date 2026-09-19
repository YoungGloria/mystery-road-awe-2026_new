let allEvidence = [];
let filteredEvidence = [];
let selectedEvidence = null;
let bookmarks = [];

let notesStore = {}; 


const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
const STORAGE_KEY_NOTES = "remotion_notes";


function saveBookmarksToStorage() {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
}

function applyStoredBookmarkFlags() {
  for (let i = 0; i < allEvidence.length; i++) {
    allEvidence[i].bookmarked = bookmarks.indexOf(allEvidence[i].id) !== -1;
  }
}

function loadBookmarksFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    const parsed = raw ? JSON.parse(raw) : [];
    bookmarks = Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Could not read stored bookmarks, starting empty", err);
    bookmarks = [];
  }
}

function saveNoteForEvidence(evidenceId, text) {
  notesStore[evidenceId] = text;
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesStore));
}

function loadNoteForEvidence(evidenceId) {
  return notesStore[evidenceId] || "";
}

// DEMO 5: use try-catch analgous to loadBookmarksFromStorage to handle potential errors when loading notes from localStorage
function loadNotesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    if (!raw) {
      notesStore = {};
      return;
    }
    notesStore = JSON.parse(raw);
  } catch (err) {
    console.warn("Could not read stored notes, starting empty", err);
    notesStore = {};
  }
}

function addBookmark(evidenceId) {
    if (!bookmarks.includes(evidenceId)) {
        bookmarks.push(evidenceId);
        saveBookmarksToStorage();
    }
}

function removeBookmark(evidenceId) {
  const index = bookmarks.indexOf(evidenceId);
  if (index !== -1) {
    bookmarks.splice(index, 1);
    saveBookmarksToStorage();
  }
}

function loadEvidenceData() {
    return fetch("data/evidence.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      allEvidence = data;
      return allEvidence;
      
    })
    .catch(function (err) {
      console.error("Failed to load evidence.json", err);
      alert("Evidence could not be loaded. Some views may be incomplete.");
    });
}



function findEvidenceById(id) {
  for (let i = 0; i < allEvidence.length; i++) {
    if (allEvidence[i].id === id) return allEvidence[i];
  }
  return null;
}

function evidenceMentionsPerson(ev, person) {
  if (!ev.personIds) return false;
  return ev.personIds.indexOf(person.id) !== -1 || ev.personIds.indexOf(person.name) !== -1;
}


// DEMO 2: selectedEvidence is now copied (or set to null) to avoid direct mutation of the original object in allEvidence
function setSelectedEvidence(ev) {
selectedEvidence = ev ? { ...ev } : null;
}

function clearSelectedEvidence() {
    selectedEvidence = null; 
}

//DEMO 2: shallow copy of filteredEvidence to avoid direct mutation of the original array
function setFilteredEvidence(data) {
  filteredEvidence = [...data];
  return filteredEvidence;
}

//used in main.js during initalization to conserve original behavior
function loadNoteAsync(evidenceId) {
  return new Promise(function (resolve) {
    resolve(notesStore[evidenceId] || "");
  });
}

export { allEvidence, filteredEvidence, selectedEvidence, bookmarks, notesStore, setFilteredEvidence, applyStoredBookmarkFlags, loadEvidenceData, findEvidenceById, evidenceMentionsPerson, setSelectedEvidence, clearSelectedEvidence, addBookmark, removeBookmark, loadBookmarksFromStorage, saveBookmarksToStorage, saveNoteForEvidence, loadNoteForEvidence, loadNotesFromStorage, loadNoteAsync };