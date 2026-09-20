import {
  loadNoteForEvidence,
  saveNoteForEvidence,
  findEvidenceById,
  setSelectedEvidence,
  clearSelectedEvidence,
} from '../states/evidenceState.js';
import { findPersonById } from '../states/peopleState.js';
import { findLocationById } from '../states/locationState.js';
import { formatDate } from '../helpers.js';
import { viewRendered } from '../states/appState.js';
import { renderEvidenceList } from './evidenceCatalogue.js';
import type { Evidence, EvidenceStatus, EvidenceRelevance } from '../types.js';

function openEvidenceDetail(evidenceId: string): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;
  setSelectedEvidence(ev);

  const section = document.getElementById('evidenceDetailSection');
  if (!section) return;
  section.classList.remove('hidden');

  renderEvidenceDetail(ev);
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeEvidenceDetail(): void {
  const section = document.getElementById('evidenceDetailSection');
  if (!section) return;
  section.classList.add('hidden');
  section.innerHTML = '';
  clearSelectedEvidence();
  // selectedEvidence = null;
}

function renderEvidenceDetail(ev: Evidence): void {
  const section = document.getElementById('evidenceDetailSection');
  if (!section) return;

  const personNames = [];
  for (let p = 0; p < ev.personIds.length; p++) {
    const personId = ev.personIds[p];
    if (!personId) continue;
    const person = findPersonById(personId);
    personNames.push(person ? person.name : ev.personIds[p]);
  }

  const locationNames = [];
  for (let l = 0; l < ev.locationIds.length; l++) {
    const locationId = ev.locationIds[l];
    if (!locationId) continue;
    const loc = findLocationById(locationId);
    locationNames.push(loc ? loc.id + ' - ' + loc.name : ev.locationIds[l]);
  }

  let tagsHtml = '';
  for (let t = 0; t < ev.tags.length; t++) {
    tagsHtml += '<span class="tag-chip">' + ev.tags[t] + '</span>';
  }

  const storedNote = loadNoteForEvidence(ev.id);

  let html = '';
  html += '<div class="evidence-detail-header">';
  html += '<div><h2>' + ev.title + '</h2>';
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    ' &middot; ' +
    ev.type +
    ' &middot; ' +
    formatDate(ev.timestamp) +
    '</div></div>';
  html +=
    '<button type="button" class="btn btn-secondary btn-small" onclick="closeEvidenceDetail()">Close</button>';
  html += '</div>';

  if (ev.tags.indexOf('critical') !== -1) {
    html +=
      '<div class="warning-banner">This item is tagged as critical evidence.</div>';
  }

  html +=
    '<div class="detail-field"><strong>Summary</strong>' +
    ev.summary +
    '</div>';
  html += '<div class="evidence-detail-content">' + ev.content + '</div>';
  html +=
    '<div class="detail-field"><strong>Related people</strong>' +
    personNames.join(', ') +
    '</div>';
  html +=
    '<div class="detail-field"><strong>Related locations</strong>' +
    locationNames.join(', ') +
    '</div>';
  html +=
    '<div class="detail-field"><strong>Tags</strong>' + tagsHtml + '</div>';

  html += '<div class="detail-field"><strong>Review status</strong>';
  html += '<select id="detailStatusSelect">';
  html += statusOptionHTML(ev.status, 'unreviewed', 'Unreviewed');
  html += statusOptionHTML(ev.status, 'reviewed', 'Reviewed');
  html += statusOptionHTML(ev.status, 'flagged', 'Flagged');
  html += '</select></div>';

  html += '<div class="detail-field"><strong>Relevance</strong>';
  html += '<select id="detailRelevanceSelect">';
  html += statusOptionHTML(ev.relevance, 'unknown', 'Unknown');
  html += statusOptionHTML(ev.relevance, 'relevant', 'Relevant');
  html += statusOptionHTML(ev.relevance, 'irrelevant', 'Irrelevant');
  html += '</select></div>';

  html += '<div class="detail-field"><strong>Investigator note</strong>';
  //html += '<textarea id="evidenceNoteInput" class="note-textarea" rows="3" data-evidence-id="' + ev.id + '" placeholder="Add a private note about this evidence...">' + storedNote + "</textarea>";
  html +=
    '<textarea id="evidenceNoteInput" class="note-textarea" rows="3" data-evidence-id="' +
    ev.id +
    '" placeholder="Add a private note about this evidence...">' +
    '</textarea>';
  html +=
    '<button type="button" class="btn btn-primary btn-small" style="margin-top:6px;" onclick="saveCurrentNote()">Save note</button>';
  html += '</div>';

  //html += '<div class="detail-field"><strong>Note preview</strong><div id="notePreview">' + storedNote + "</div></div>";
  html +=
    '<div class="detail-field"><strong>Note preview</strong><div id="notePreview">' +
    '</div></div>';

  section.innerHTML = html;

  const noteInputEl = document.getElementById(
    'evidenceNoteInput'
  ) as HTMLTextAreaElement | null;
  const notePreviewEl = document.getElementById('notePreview');

  if (noteInputEl) {
    noteInputEl.value = storedNote; // Textarea value is set to the stored note. Should be safe since it's a textarea, but we still avoid innerHTML for safety.
  }

  if (notePreviewEl) {
    notePreviewEl.textContent = storedNote; // Note preview is set using textContent to avoid unsafe innerHTML rendering.
  }

  const statusSelect = document.getElementById(
    'detailStatusSelect'
  ) as HTMLSelectElement | null;
  if (statusSelect) {
    statusSelect.addEventListener('change', function (e) {
      const value = (e.target as HTMLSelectElement).value;
      if (
        value === 'unreviewed' ||
        value === 'reviewed' ||
        value === 'flagged'
      ) {
        ev.status = value;
      }
      renderEvidenceDetail(ev);
      if (viewRendered.evidence) renderEvidenceList();
    });
  }

  const relevanceSelect = document.getElementById(
    'detailRelevanceSelect'
  ) as HTMLSelectElement | null;
  if (relevanceSelect) {
    relevanceSelect.addEventListener('change', function (e) {
      const value = (e.target as HTMLSelectElement).value;
      if (
        value === 'unknown' ||
        value === 'relevant' ||
        value === 'irrelevant'
      ) {
        ev.relevance = value;
      }
      renderEvidenceDetail(ev);
      if (viewRendered.evidence) renderEvidenceList();
    });
  }
}

function statusOptionHTML(
  current: Evidence['status'] | Evidence['relevance'],
  value: EvidenceStatus | EvidenceRelevance,
  label: string
): string {
  const currentLower = (current || '').toLowerCase();
  const selected = currentLower === value ? ' selected' : '';
  return '<option value="' + value + '"' + selected + '>' + label + '</option>';
}

// DEMO 8: text is now shown in the note preview using textContent instead of innerHTML to avoid unsafe rendering
function saveCurrentNote() {
  const textarea = document.getElementById(
    'evidenceNoteInput'
  ) as HTMLTextAreaElement | null;
  if (!textarea) return;
  const evidenceId = textarea.getAttribute('data-evidence-id');
  if (!evidenceId) return;
  const text = textarea.value;
  saveNoteForEvidence(evidenceId, text);
  const preview = document.getElementById('notePreview');
  // if (preview) preview.innerHTML = text; // changed to textContent to avoid unsafe innerHTML rendering of the note preview
  if (preview) preview.textContent = text;
}

export { openEvidenceDetail, closeEvidenceDetail, saveCurrentNote };
