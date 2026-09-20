import { allEvidence, notesStore } from '../states/evidenceState.js';
import { allPeople } from '../states/peopleState.js';
import { getSelectedOptions } from '../helpers.js';
import { openEvidenceDetail } from './evidenceDetails.js';
import { navigateTo } from '../navigation.js';

const STORAGE_KEY_HYPOTHESIS = 'remotion_hypothesis';

function renderWorkspace() {
  renderBookmarksList();
  renderNotesList();
  populateHypothesisDropdowns();
  loadHypothesisFromStorage();
}

function renderBookmarksList() {
  const container = document.getElementById('bookmarksList');
  if (!container) return;

  const bookmarkedItems = allEvidence.filter(function (ev) {
    return ev.bookmarked;
  });

  if (bookmarkedItems.length === 0) {
    container.innerHTML =
      '<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>';
    return;
  }

  let html = '';
  for (let i = 0; i < bookmarkedItems.length; i++) {
    const ev = bookmarkedItems[i];
    if (!ev) continue;
    html +=
      '<div class="mini-list-item"><strong>' +
      ev.id +
      '</strong> &mdash; ' +
      ev.title +
      ' <button type="button" class="btn btn-small btn-secondary" data-open-evidence="' +
      ev.id +
      '">Open</button></div>';
  }
  container.innerHTML = html;

  const openButtons = container.querySelectorAll('[data-open-evidence]');
  for (let b = 0; b < openButtons.length; b++) {
    const openButton = openButtons.item(b);
    if (!openButton) continue;
    openButton.addEventListener('click', function (e) {
      navigateTo('evidence');
      const id = (e.currentTarget as HTMLElement).getAttribute(
        'data-open-evidence'
      );
      setTimeout(function () {
        if (!id) return;
        openEvidenceDetail(id);
      }, 0);
    });
  }
}

function renderNotesList() {
  const container = document.getElementById('notesList');
  if (!container) return;

  const noteEntries = [];
  for (let i = 0; i < allEvidence.length; i++) {
    const ev = allEvidence[i];
    if (!ev) continue;
    const note = notesStore[ev.id];
    if (note) {
      noteEntries.push({
        index: i,
        evidenceId: ev.id,
        title: ev.title,
        text: note,
      });
    }
  }

  if (noteEntries.length === 0) {
    container.innerHTML =
      "<p>No notes yet. Add one from an evidence item's detail view.</p>";
    return;
  }

  let html = '';
  for (let n = 0; n < noteEntries.length; n++) {
    const entry = noteEntries[n];
    if (!entry) continue;
    html +=
      '<div class="mini-list-item"><strong>' +
      entry.evidenceId +
      '</strong> &mdash; ' +
      entry.title;
    html +=
      '<div id="noteText-' + entry.index + '">' + entry.text + '</div></div>'; // unsafe innerHTML rendering, same as the note preview
  }
  container.innerHTML = html;
}

function populateHypothesisDropdowns() {
  const suspectSelect = document.getElementById('hypSuspect');
  const evidenceSelect = document.getElementById('hypEvidence');
  if (!suspectSelect || !evidenceSelect) return;

  const currentSuspect = (suspectSelect as HTMLSelectElement).value;
  suspectSelect.innerHTML = '<option value="">Select a person…</option>';
  for (let p = 0; p < allPeople.length; p++) {
    const person = allPeople[p];
    if (!person) continue;
    suspectSelect.innerHTML +=
      '<option value="' +
      person.id +
      '">' +
      person.name +
      '</option>';
  }
  (suspectSelect as HTMLSelectElement).value = currentSuspect;

  evidenceSelect.innerHTML = '';
  for (let i = 0; i < allEvidence.length; i++) {
    const ev = allEvidence[i];
    if (!ev) continue;
    evidenceSelect.innerHTML +=
      '<option value="' +
      ev.id +
      '">' +
      ev.id +
      ' - ' +
      ev.title +
      '</option>';
  }
}

function saveHypothesis() {
  const evidenceElement = document.getElementById('hypEvidence');
  const draft = {
    suspectId: (document.getElementById('hypSuspect') as HTMLSelectElement).value,
    nature: (document.getElementById('hypNature') as HTMLInputElement).value,
    evidenceIds:
      evidenceElement instanceof HTMLSelectElement
        ? getSelectedOptions(evidenceElement)
        : [],
    confidence: (document.getElementById('hypConfidence') as HTMLInputElement).value,
    explanation: (document.getElementById('hypExplanation') as HTMLTextAreaElement).value,
    alternative: (document.getElementById('hypAlternative') as HTMLInputElement).value,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
  } catch (err) {
    console.error('Could not save hypothesis draft', err);
    alert('Your hypothesis could not be saved to local storage.');
    return;
  }

  const msg = document.getElementById('hypothesisSavedMsg');
  if (!msg) {return;}
  msg.classList.remove('hidden');
  setTimeout(function () {
    msg.classList.add('hidden');
  }, 2000);
}

//DEMO 5: try-catch block added to handle potential errors when loading hypothesis from localStorage
function loadHypothesisFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);
    if (!raw) return;

    const draft = JSON.parse(raw);

    (document.getElementById('hypSuspect') as HTMLSelectElement).value = draft.suspectId || '';
    (document.getElementById('hypNature') as HTMLInputElement).value = draft.nature || '';
    (document.getElementById('hypConfidence') as HTMLInputElement).value = draft.confidence || 50;
    (document.getElementById('hypConfidenceValue') as HTMLSpanElement).textContent =
      draft.confidence || 50;
    (document.getElementById('hypExplanation') as HTMLTextAreaElement).value = draft.explanation || '';
    (document.getElementById('hypAlternative') as HTMLInputElement).value = draft.alternative || '';

    const evidenceSelect = document.getElementById('hypEvidence') as HTMLSelectElement;
    const savedIds = draft.evidenceIds || [];
    for (let i = 0; i < evidenceSelect.options.length; i++) {
      const option = evidenceSelect.options[i];
      if (!option) continue;
      option.selected =
        savedIds.indexOf(option.value) !== -1;
    }
  } catch (err) {
    console.warn('Could not read stored hypothesis, starting empty', err);
  }
}

export { renderWorkspace, populateHypothesisDropdowns, saveHypothesis };
