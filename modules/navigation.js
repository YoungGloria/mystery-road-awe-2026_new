import {
  decrementLoadingSteps,
  setCurrentPage,
  viewRendered,
} from './states/appState.js';
import { renderDashboard } from './views/dashboard.js';
import {
  renderEvidenceList,
  populateEvidenceDropdowns,
} from './views/evidenceCatalogue.js';
import { renderPeople, renderLocations } from './views/peopleLocations.js';
import { renderTimeline, populateTimelineDropdowns } from './views/timeline.js';
import {
  renderWorkspace,
  populateHypothesisDropdowns,
} from './views/workspace.js';

function navigateTo(viewName) {
  window.location.hash = viewName;
  // handleHashChange() will pick this up via the hashchange listener
}

function showLoadingOverlay(msg) {
  const overlay = document.getElementById('loadingOverlay');
  const text = document.getElementById('loadingText');
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove('hidden');
}

// Decrement the loading steps counter and hide the overlay if all steps are done
function hideLoadingStep() {
  const remaining = decrementLoadingSteps();
  if (remaining <= 0) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('hidden');
  }
}

function handleHashChange() {
  var hash = window.location.hash.replace('#', '');
  const validViews = [
    'dashboard',
    'evidence',
    'people',
    'timeline',
    'workspace',
  ];
  if (validViews.indexOf(hash) === -1) {
    hash = 'dashboard';
  }
  setCurrentPage(hash); //  currentPage = hash;

  const sections = document.querySelectorAll('.view');
  for (let i = 0; i < sections.length; i++) {
    sections[i].classList.remove('active');
  }
  document.getElementById('view-' + hash).classList.add('active');

  const navButtons = document.querySelectorAll('.nav-btn');
  for (let n = 0; n < navButtons.length; n++) {
    navButtons[n].classList.remove('active');
    if (navButtons[n].getAttribute('data-view') === hash) {
      navButtons[n].classList.add('active');
    }
  }

  if (hash === 'dashboard' && !viewRendered.dashboard) {
    renderDashboard();
    viewRendered.dashboard = true;
  } else if (hash === 'evidence' && !viewRendered.evidence) {
    renderEvidenceList();
    viewRendered.evidence = true;
  } else if (hash === 'people' && !viewRendered.people) {
    renderPeople();
    renderLocations();
    viewRendered.people = true;
  } else if (hash === 'timeline' && !viewRendered.timeline) {
    renderTimeline();
    viewRendered.timeline = true;
  } else if (hash === 'workspace') {
    // workspace is cheap enough that it always re-renders
    renderWorkspace();
  }
}

function populateAllDropdowns() {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}

export {
  navigateTo,
  showLoadingOverlay,
  hideLoadingStep,
  handleHashChange,
  populateAllDropdowns,
};
