import {
  setFilteredEvidence,
  allEvidence,
  evidenceMentionsPerson,
  bookmarks,
  saveBookmarksToStorage,
  findEvidenceById,
  addBookmark,
  removeBookmark,
} from '../states/evidenceState.js';
import { findPersonById, allPeople } from '../states/peopleState.js';
import { allLocations } from '../states/locationState.js';
import {
  formatDate,
  getStatusBadgeClass,
  getRelevanceBadgeClass,
} from '../helpers.js';
import { currentPage } from '../states/appState.js';
import { openEvidenceDetail } from './evidenceDetails.js';
import { navigateTo } from '../navigation.js';
import type { Evidence } from '../types.js';

// DEMO 5: is never set to false in orignial code
let evidenceViewLoading: boolean = true;

// allows only removeEvidenceViewLoading by setting evidenceViewLoading to false as this funktion is only called once after inital loading, it is not relevant vor re-rendering
// if app is adapted to allow loading of new evidence data after initial load, this funktion must be adapted to allow setting evidenceViewLoading to true again
function removeEvidenceViewLoading(): void {
  evidenceViewLoading = false;
}

function getFilteredEvidence(): Evidence[] {
  const searchBox = document.getElementById('evidenceSearch');
  const searchTerm = searchBox
    ? (searchBox as HTMLInputElement).value.toLowerCase().trim()
    : '';
  const typeVal =
    (document.getElementById('filterType') as HTMLSelectElement | null)
      ?.value ?? '';
  const personVal =
    (document.getElementById('filterPerson') as HTMLSelectElement | null)
      ?.value ?? '';
  const locationVal =
    (document.getElementById('filterLocation') as HTMLSelectElement | null)
      ?.value ?? '';
  const statusVal =
    (document.getElementById('filterStatus') as HTMLSelectElement | null)
      ?.value ?? '';
  const relevanceVal =
    (document.getElementById('filterRelevance') as HTMLSelectElement | null)
      ?.value ?? '';

  const results = [];
  for (let i = 0; i < allEvidence.length; i++) {
    const item = allEvidence[i];
    if (!item) continue;
    let matches = true;

    if (searchTerm) {
      const haystack = (
        item?.title +
        ' ' +
        item?.summary +
        ' ' +
        item?.tags.join(' ')
      ).toLowerCase();
      if (haystack.indexOf(searchTerm) === -1) matches = false;
    }
    if (matches && typeVal && item.type.toLowerCase() !== typeVal)
      matches = false;
    if (matches && personVal) {
      const person = findPersonById(personVal);
      if (!person || !evidenceMentionsPerson(item, person)) matches = false;
    }
    if (matches && locationVal && item.locationIds.indexOf(locationVal) === -1)
      matches = false;
    if (matches && statusVal && (item.status || '').toLowerCase() !== statusVal)
      matches = false;
    if (
      matches &&
      relevanceVal &&
      (item.relevance || '').toLowerCase() !== relevanceVal
    )
      matches = false;

    if (matches) results.push(item);
  }

  setFilteredEvidence(results);
  return results;
}

function populateEvidenceDropdowns(): void {
  const typeSelect = document.getElementById('filterType');
  const personSelect = document.getElementById('filterPerson');
  const locationSelect = document.getElementById('filterLocation');
  if (!typeSelect || !personSelect || !locationSelect) return;

  const types: string[] = [];
  for (let i = 0; i < allEvidence.length; i++) {
    const evidence = allEvidence[i];
    if (!evidence) continue;
    const t = evidence.type.toLowerCase();
    if (types.indexOf(t) === -1) types.push(t);
  }
  typeSelect.innerHTML = '<option value="">All types</option>';
  for (let ti = 0; ti < types.length; ti++) {
    typeSelect.innerHTML +=
      '<option value="' + types[ti] + '">' + types[ti] + '</option>';
  }

  personSelect.innerHTML = '<option value="">All people</option>';
  for (let p = 0; p < allPeople.length; p++) {
    const person = allPeople[p];
    if (!person) continue;
    personSelect.innerHTML +=
      '<option value="' + person.id + '">' + person.name + '</option>';
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (let l = 0; l < allLocations.length; l++) {
    const location = allLocations[l];
    if (!location) continue;
    locationSelect.innerHTML +=
      '<option value="' +
      location.id +
      '">' +
      location.id +
      ' - ' +
      location.name +
      '</option>';
  }
}

function renderEvidenceList(): void {
  const container = document.getElementById('evidenceList');
  if (!container) return;

  const loadingIndicator = document.getElementById('evidenceLoadingIndicator');
  if (evidenceViewLoading) {
    if (loadingIndicator) loadingIndicator.classList.remove('hidden');
    container.innerHTML = '';
    return;
  }
  if (loadingIndicator) loadingIndicator.classList.add('hidden');

  const results: Evidence[] = getSortedAndFilteredEvidence(); // DEMO 5: sort filtered evidence before rendering

  let html = '';
  if (results.length === 0) {
    html = '<p>No evidence matches the current filters.</p>';
  }
  for (let i = 0; i < results.length; i++) {
    const ev = results[i];
    if (!ev) continue;
    html += renderEvidenceCardHTML(ev);
  }
  container.innerHTML = html;

  // Event delegation for card clicks / bookmark button.
  container.addEventListener('click', handleEvidenceListClick);
}

function renderEvidenceCardHTML(ev: Evidence): string {
  const isBookmarked = bookmarks.indexOf(ev.id) !== -1;
  let html = '<div class="evidence-card" data-id="' + ev.id + '">';
  html +=
    '<button class="bookmark-btn ' +
    (isBookmarked ? 'active' : '') +
    '" data-action="bookmark" data-id="' +
    ev.id +
    '" aria-label="Toggle bookmark for ' +
    ev.title +
    '"><span class="bookmark-icon">' +
    (isBookmarked ? '★' : '☆') +
    '</span></button>';
  html += '<h3>' + ev.title + '</h3>';
  // Ex2_Demo2: Add text for HMR (Hot Module Replacement) handling for this module
  // const text = "Test";
  // html += `<p>${text}</p>`;
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    ' &middot; ' +
    ev.type +
    ' &middot; ' +
    formatDate(ev.timestamp) +
    '</div>';
  html += '<div class="evidence-summary">' + ev.summary + '</div>';

  if (ev.tags.indexOf('critical') !== -1) {
    html += '<span class="badge badge-critical">Critical</span>';
  }
  html +=
    '<span class="badge ' +
    getStatusBadgeClass(ev.status) +
    '">' +
    ev.status +
    '</span>';
  html +=
    '<span class="badge ' +
    getRelevanceBadgeClass(ev.relevance) +
    '">' +
    ev.relevance +
    '</span>';
  html += '<div>';
  for (let t = 0; t < ev.tags.length; t++) {
    html += '<span class="tag-chip">' + ev.tags[t] + '</span>';
  }
  html += '</div>';
  html += '</div>';
  return html;
}

function handleEvidenceListClick(event: Event): void {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset && target.dataset.action === 'bookmark') {
    event.stopPropagation();
    const evidenceId = target.dataset.id;
    if (!evidenceId) return;
    handleBookmarkClick(evidenceId);
    return;
  }

  const card = target.closest('.evidence-card');
  if (card) {
    const evidenceId = card.getAttribute('data-id');
    if (evidenceId) openEvidenceDetail(evidenceId);
  }
}

// DEMO 2: bookmarks are imported from evidenceState.js, so direct mutation is no longer possible. Instead, setter functions are used to add or remove bookmarks.
function handleBookmarkClick(evidenceId: string): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  if (bookmarks.indexOf(evidenceId) === -1) {
    // bookmarks.push(evidenceId);
    ev.bookmarked = true;
    addBookmark(evidenceId);
  } else {
    // bookmarks = bookmarks.filter(function (id) {
    //   return id !== evidenceId;
    // });
    ev.bookmarked = false;
    removeBookmark(evidenceId);
  }
  saveBookmarksToStorage();
  if (currentPage === 'evidence') renderEvidenceList();
}

function getSortedAndFilteredEvidence(): Evidence[] {
  const sortElement = document.getElementById(
    'sortEvidence'
  ) as HTMLSelectElement | null;
  const sortValue = sortElement?.value ?? '';
  const sorted = getFilteredEvidence().slice(); // DEMO 2: shallow copy of filteredEvidence to avoid direct mutation of the original array

  if (sortValue === 'title-asc') {
    sorted.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else if (sortValue === 'title-desc') {
    sorted.sort(function (a, b) {
      return b.title.localeCompare(a.title);
    });
  } else if (sortValue === 'date-asc') {
    sorted.sort(function (a, b) {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  } else {
    sorted.sort(function (a, b) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }
  return setFilteredEvidence(sorted);
}

function handleSortChange() {
  renderEvidenceList();
}

function clearFilters() {
  (document.getElementById('evidenceSearch') as HTMLInputElement).value = '';
  (document.getElementById('filterType') as HTMLSelectElement).value = '';
  (document.getElementById('filterPerson') as HTMLInputElement).value = '';
  (document.getElementById('filterLocation') as HTMLInputElement).value = '';
  (document.getElementById('filterStatus') as HTMLSelectElement).value = '';
  (document.getElementById('filterRelevance') as HTMLSelectElement).value = '';
  renderEvidenceList();
}

function simulateAsyncSearch(term: string): Promise<string> {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(term);
    }, 300);
  });
}

let latestSearchRequestId = 0;

function handleSearchInput(event: Event): void {
  const term = (event.target as HTMLInputElement).value;
  const requestId = ++latestSearchRequestId;

  simulateAsyncSearch(term).then(function (resolvedTerm) {
    // Only apply this response if nothing newer has been typed meanwhile.
    if (requestId !== latestSearchRequestId) return;
    renderEvidenceList();
  });
}

// --- Quick-view modal (used from the timeline) -------------------------
// originally only used within the module and never reset
// DEMO 4: modal element is now removed after use, this avoids building up a large number of listeners
let modalCloseListenerCount = 0;

function openEvidenceModal(evidenceId: string): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  let modal = document.getElementById('quickViewModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quickViewModal';
    document.body.appendChild(modal);
  }

  modal.innerHTML =
    '<div class="modal-backdrop"><div class="modal-box">' +
    '<button type="button" class="modal-close-btn" aria-label="Close">&times;</button>' +
    '<h3>' +
    ev.title +
    '</h3>' +
    '<p class="evidence-meta">' +
    ev.id +
    ' &middot; ' +
    ev.type +
    ' &middot; ' +
    formatDate(ev.timestamp) +
    '</p>' +
    '<p>' +
    ev.summary +
    '</p>' +
    '<button type="button" class="btn btn-primary btn-small" data-open-full="' +
    ev.id +
    '">Open full evidence</button>' +
    '</div></div>';

  modalCloseListenerCount++;
  console.log('modal opened, active close listeners:', modalCloseListenerCount);

  modal.addEventListener('click', function (e: MouseEvent) {
    const target = e.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (
      target.classList.contains('modal-close-btn') ||
      target.classList.contains('modal-backdrop')
    ) {
      modal.remove();
    }
    const evidenceId = target.getAttribute('data-open-full');
    if (evidenceId) {
      //modal.innerHTML = "";
      modal.remove();
      navigateTo('evidence');
      setTimeout(function () {
        openEvidenceDetail(evidenceId);
      }, 0);
    }
  });
}

export {
  removeEvidenceViewLoading,
  openEvidenceModal,
  renderEvidenceList,
  handleSortChange,
  clearFilters,
  handleSearchInput,
  populateEvidenceDropdowns,
};

// // Ex2_Demo2: HMR (Hot Module Replacement) handling for this module
// if (import.meta.hot) {
//   import.meta.hot.accept((newModule) => {
//     console.log('HMR: Modul wurde ohne Reload ausgetauscht!');

//     newModule.removeEvidenceViewLoading();
//     newModule.populateEvidenceDropdowns();
//     newModule.renderEvidenceList();
//   });
// }
