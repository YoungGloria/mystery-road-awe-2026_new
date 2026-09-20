import {
  loadNoteAsync,
  setFilteredEvidence,
  applyStoredBookmarkFlags,
  loadEvidenceData,
  allEvidence,
  loadBookmarksFromStorage,
  loadNotesFromStorage,
} from './modules/states/evidenceState.js';
import { loadLocations } from './modules/states/locationState.js';
import { loadPeople } from './modules/states/peopleState.js';
import { loadTimelineData } from './modules/states/timelineState.js';
import { renderDashboard } from './modules/views/dashboard.js';
import {
  renderEvidenceList,
  handleSearchInput,
  clearFilters,
  handleSortChange,
  removeEvidenceViewLoading,
} from './modules/views/evidenceCatalogue.js';
import { switchPeopleTab } from './modules/views/peopleLocations.js';
import { renderTimeline } from './modules/views/timeline.js';
import { saveHypothesis } from './modules/views/workspace.js';
import {
  navigateTo,
  showLoadingOverlay,
  hideLoadingStep,
  populateAllDropdowns,
  handleHashChange,
} from './modules/navigation.js';
import { loadCaseData } from './modules/states/appState.js';
import {
  closeEvidenceDetail,
  saveCurrentNote,
} from './modules/views/evidenceDetails.js';

declare global {
  interface Window {
    navigateTo: typeof navigateTo;
    switchPeopleTab: typeof switchPeopleTab;
    handleSortChange: typeof handleSortChange;
    saveHypothesis: typeof saveHypothesis;
    closeEvidenceDetail: typeof closeEvidenceDetail;
    saveCurrentNote: typeof saveCurrentNote;
  }
}

// Init
function initApp(): void {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  loadAllData().then(function (data) {
    handleHashChange();

    loadNoteAsync('E01').then(function (firstNote) {
      console.log('First note preview:', firstNote);
    });
  });
}

window.addEventListener('DOMContentLoaded', initApp);
window.addEventListener('hashchange', handleHashChange);

// Manually attach to window because onclick="..." attributes in index.html
// need global functions, which ES modules don't provide automatically.
window.navigateTo = navigateTo;
window.switchPeopleTab = switchPeopleTab;
window.handleSortChange = handleSortChange;
window.saveHypothesis = saveHypothesis;
window.closeEvidenceDetail = closeEvidenceDetail;
window.saveCurrentNote = saveCurrentNote;

// event listeners

function setupEventListeners(): void {
  window.addEventListener('hashchange', handleHashChange);

  // DEMO 4: let instead of var to ensure correct scoping (block!) in the event listener
  // note that navigation was not affected functionally, as it is handled by onclick="navigateTo(...)" in index.html, but this resolves the consol error
  let navButtons = document.querySelectorAll('.nav-btn');
  for (var i = 0; i < navButtons.length; i++) {
    // use let to ensure correct scoping in the event listener
    const navButton = navButtons[i];
    if (!navButton) continue;
    navButton.addEventListener('click', function () {
      var targetView = navButton.getAttribute('data-view');
      console.log('nav clicked:', targetView);
    });
  }

  document
    .getElementById('evidenceSearch')
    ?.addEventListener('input', handleSearchInput);

  document
    .getElementById('filterType')
    ?.addEventListener('change', renderEvidenceList);
  document
    .getElementById('filterPerson')
    ?.addEventListener('change', renderEvidenceList);
  document
    .getElementById('filterLocation')
    ?.addEventListener('change', renderEvidenceList);

  // DEMO 1/DEMO 5: filterStatus is no longer handled by in-line-event handler, but by event listener
  // in-line event handlers are more prone to unexpected behavior such as accidental overwriting or double calls
  document
    .getElementById('filterStatus')
    ?.addEventListener('change', renderEvidenceList);
  //document.getElementById("filterStatus").setAttribute("onchange", "renderEvidenceList()");

  document
    .getElementById('filterRelevance')
    ?.addEventListener('change', renderEvidenceList);

  document
    .getElementById('clearFiltersBtn')
    ?.addEventListener('click', clearFilters);

  document
    .getElementById('timelineOrder')
    ?.addEventListener('change', renderTimeline);
  document
    .getElementById('timelinePersonFilter')
    ?.addEventListener('change', renderTimeline);
  document
    .getElementById('timelineLocationFilter')
    ?.addEventListener('change', renderTimeline);
  document
    .getElementById('timelineTypeFilter')
    ?.addEventListener('change', renderTimeline);

  document
    .getElementById('hypConfidence')
    ?.addEventListener('input', function (e) {
      const valueElement = document.getElementById(
        'hypConfidenceValue'
      ) as HTMLElement | null;
      const target = e.target as HTMLInputElement;
      if (valueElement) {
        valueElement.textContent = target.value;
      }
    });
}

async function loadCorePeopleAndLocations(): Promise<void> {
  try {
    await loadCaseData();
    await loadPeople();
    await loadLocations();
    hideLoadingStep();
  } catch (error) {
    console.error('Error loading core data:', error);
  }
}

// loadingStepsRemaining is set to 2 in appState.js, it is decremented after the milestones of loading 1) core data and 2) finishing the rendering
// the loading spinner is hidden when loadingStepsRemaining reaches 0
function loadAllData(): Promise<void> {
  showLoadingOverlay('Loading case file…');
  return loadCorePeopleAndLocations()
    .then(function () {
      renderDashboard();
      return Promise.all([loadEvidenceData(), loadTimelineData()]);
    })
    .then(function () {
      applyStoredBookmarkFlags();
      setFilteredEvidence(allEvidence);
      populateAllDropdowns();
      removeEvidenceViewLoading(); // DEMO 5: set evidenceViewLoading to false after initial loading
      renderEvidenceList(); // DEMO 5: render evidence list after evidence data is loaded
      renderTimeline();
      hideLoadingStep();
    });

    // DEMO 10: TS error
    const test: string = 123; 
}
