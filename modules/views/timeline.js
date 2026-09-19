import { allPeople } from '../states/peopleState.js';
import { allLocations, findLocationById } from '../states/locationState.js';
import { allTimeline } from '../states/timelineState.js';
import { openEvidenceModal } from './evidenceCatalogue.js';
import { formatDate, certaintyBadgeClass } from '../helpers.js';

function populateTimelineDropdowns() {
  let personSelect = document.getElementById('timelinePersonFilter');
  let locationSelect = document.getElementById('timelineLocationFilter');
  let typeSelect = document.getElementById('timelineTypeFilter');
  if (!personSelect || !locationSelect || !typeSelect) return;

  personSelect.innerHTML = '<option value="">All people</option>';
  for (let p = 0; p < allPeople.length; p++) {
    personSelect.innerHTML +=
      '<option value="' +
      allPeople[p].id +
      '">' +
      allPeople[p].name +
      '</option>';
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (let l = 0; l < allLocations.length; l++) {
    locationSelect.innerHTML +=
      '<option value="' +
      allLocations[l].id +
      '">' +
      allLocations[l].id +
      '</option>';
  }

  const types = [];
  for (let i = 0; i < allTimeline.length; i++) {
    if (types.indexOf(allTimeline[i].type) === -1)
      types.push(allTimeline[i].type);
  }
  typeSelect.innerHTML = '<option value="">All event types</option>';
  for (let t = 0; t < types.length; t++) {
    typeSelect.innerHTML +=
      '<option value="' + types[t] + '">' + types[t] + '</option>';
  }
}

function renderTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;

  const order = document.getElementById('timelineOrder').value;
  const personFilter = document.getElementById('timelinePersonFilter').value;
  const locationFilter = document.getElementById(
    'timelineLocationFilter'
  ).value;
  const typeFilter = document.getElementById('timelineTypeFilter').value;
  let events = [];

  for (let i = 0; i < allTimeline.length; i++) {
    let evt = allTimeline[i];
    if (personFilter && evt.personIds.indexOf(personFilter) === -1) continue;
    if (locationFilter && evt.locationIds.indexOf(locationFilter) === -1)
      continue;
    if (typeFilter && evt.type !== typeFilter) continue;
    events.push(evt);
  }

  events = events.slice().sort(function (a, b) {
    const diff = new Date(a.time) - new Date(b.time);
    return order === 'desc' ? -diff : diff;
  });

  let html = '';
  for (let e = 0; e < events.length; e++) {
    const item = events[e];
    html += '<div class="timeline-event certainty-' + item.certainty + '">';
    html +=
      '<div class="timeline-time">' +
      formatDate(item.time) +
      '&nbsp;&middot;&nbsp;<span class="badge badge-' +
      certaintyBadgeClass(item.certainty) +
      '">' +
      item.certainty +
      '</span></div>';
    html += '<h3>' + item.title + '</h3>';
    html += '<p>' + item.description + '</p>';

    const eventLocationNames = [];
    for (let el = 0; el < item.locationIds.length; el++) {
      const evtLoc = findLocationById(item.locationIds[el]);
      // If the location is found, use its ID and name; otherwise, use the location ID.
      //eventLocationNames.push(evtLoc || item.locationIds[el]);
      eventLocationNames.push(
        evtLoc ? evtLoc.id + ' - ' + evtLoc.name : item.locationIds[el]
      );
    }
    if (eventLocationNames.length > 0) {
      html +=
        '<p class="evidence-meta">Location: ' +
        eventLocationNames.join(', ') +
        '</p>';
    }

    for (let ev2 = 0; ev2 < item.evidenceIds.length; ev2++) {
      html +=
        '<button type="button" class="evidence-link-btn" data-evidence-id="' +
        item.evidenceIds[ev2] +
        '">View ' +
        item.evidenceIds[ev2] +
        '</button>';
    }
    html += '</div>';
  }
  if (events.length === 0) {
    html = '<p>No timeline events match the current filters.</p>';
  }
  container.innerHTML = html;

  const linkButtons = container.querySelectorAll('.evidence-link-btn');
  for (let b = 0; b < linkButtons.length; b++) {
    linkButtons[b].addEventListener('click', function (e) {
      openEvidenceModal(e.target.getAttribute('data-evidence-id'));
    });
  }
}

export { populateTimelineDropdowns, renderTimeline };
