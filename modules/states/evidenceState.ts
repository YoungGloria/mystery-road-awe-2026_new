import type { Evidence, Person } from '../types.js';

let allEvidence: Evidence[] = [];
let filteredEvidence: Evidence[] = [];
let selectedEvidence: Evidence | null = null;
let bookmarks: string[] = [];

let notesStore: Record<string, string> = {};

const STORAGE_KEY_BOOKMARKS = 'remotion_bookmarks';
const STORAGE_KEY_NOTES = 'remotion_notes';

function saveBookmarksToStorage(): void {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
}

function applyStoredBookmarkFlags(): void {
  for (let i = 0; i < allEvidence.length; i++) {
    const evidence = allEvidence[i];
    if (evidence) {
      evidence.bookmarked = bookmarks.indexOf(evidence.id) !== -1;
    }
  }
}

function loadBookmarksFromStorage(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    const parsed = raw ? JSON.parse(raw) as string[] : [];
    bookmarks = Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Could not read stored bookmarks, starting empty', err);
    bookmarks = [];
  }
}

function saveNoteForEvidence(evidenceId: string, text: string): void {
  notesStore[evidenceId] = text;
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesStore));
}

function loadNoteForEvidence(evidenceId: string): string {
  return notesStore[evidenceId] || '';
}

// DEMO 5: use try-catch analgous to loadBookmarksFromStorage to handle potential errors when loading notes from localStorage
function loadNotesFromStorage(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    if (!raw) {
      notesStore = {};
      return;
    }
    notesStore = JSON.parse(raw) as Record<string, string>;
  } catch (err) {
    console.warn('Could not read stored notes, starting empty', err);
    notesStore = {};
  }
}

function addBookmark(evidenceId: string): void {
  if (!bookmarks.includes(evidenceId)) {
    bookmarks.push(evidenceId);
    saveBookmarksToStorage();
  }
}

function removeBookmark(evidenceId: string): void {
  const index = bookmarks.indexOf(evidenceId);
  if (index !== -1) {
    bookmarks.splice(index, 1);
    saveBookmarksToStorage();
  }
}

async function loadEvidenceData(): Promise<Evidence[] | undefined> {
  try {
    const res = await fetch('data/evidence.json');
    if (!res.ok) {
      throw new Error('Failed to fetch evidence.json: ' + res.statusText);
    }
    const data = (await res.json() as Evidence[]).map((evidence) => ({
      ...evidence,
      status: evidence.status.toLowerCase() as Evidence['status'],
      relevance: evidence.relevance.toLowerCase() as Evidence['relevance'],
    }));
    allEvidence = data;
    return allEvidence;
  } catch (err) {
    console.error('Failed to load evidence.json', err);
    alert('Evidence could not be loaded. Some views may be incomplete.');
    return undefined;
  }
}

function findEvidenceById(id: string): Evidence | null {
  for (let i = 0; i < allEvidence.length; i++) {
    const evidence = allEvidence[i];
    if (evidence?.id === id) return evidence;
  }
  return null;
}

function evidenceMentionsPerson(ev: Evidence, person: Person): boolean {
  if (!ev.personIds) return false;
  return (
    ev.personIds.indexOf(person.id) !== -1 ||
    ev.personIds.indexOf(person.name) !== -1
  );
}

function setSelectedEvidence(ev: Evidence | null): void {
  selectedEvidence = ev ? { ...ev } : null;
}

function clearSelectedEvidence(): void {
  selectedEvidence = null;
}

//DEMO 2: shallow copy of filteredEvidence to avoid direct mutation of the original array
function setFilteredEvidence(data: Evidence[]): Evidence[] {
  filteredEvidence = [...data];
  return filteredEvidence;
}

//used in main.js during initalization to conserve original behavior
function loadNoteAsync(evidenceId: string) {
  return new Promise(function (resolve) {
    resolve(notesStore[evidenceId] || '');
  });
}

export {
  allEvidence,
  filteredEvidence,
  selectedEvidence,
  bookmarks,
  notesStore,
  setFilteredEvidence,
  applyStoredBookmarkFlags,
  loadEvidenceData,
  findEvidenceById,
  evidenceMentionsPerson,
  setSelectedEvidence,
  clearSelectedEvidence,
  addBookmark,
  removeBookmark,
  loadBookmarksFromStorage,
  saveBookmarksToStorage,
  saveNoteForEvidence,
  loadNoteForEvidence,
  loadNotesFromStorage,
  loadNoteAsync,
};
