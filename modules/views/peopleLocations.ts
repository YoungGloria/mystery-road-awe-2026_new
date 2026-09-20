import { allPeople, countEvidenceForPerson } from '../states/peopleState.js';
import { allLocations } from '../states/locationState.js';
import { navigateTo } from '../navigation.js';
import { renderEvidenceList } from './evidenceCatalogue.js';

let currentPeopleTab = 'people'; 

function switchPeopleTab(tab: string): void {
  currentPeopleTab = tab;
  const peoplePanel = document.getElementById('peoplePanel');
  const locationsPanel = document.getElementById('locationsPanel');
  const peopleTabBtn = document.getElementById('tabPeopleBtn');
  const locationsTabBtn = document.getElementById('tabLocationsBtn');

  if (!peoplePanel || !locationsPanel || !peopleTabBtn || !locationsTabBtn) {
    return;
  }

  if (tab === 'people') {
    peoplePanel.classList.remove('hidden');
    locationsPanel.classList.add('hidden');
    peopleTabBtn.classList.add('active');
    locationsTabBtn.classList.remove('active');
  } else {
    peoplePanel.classList.add('hidden');
    locationsPanel.classList.remove('hidden');
    peopleTabBtn.classList.remove('active');
    locationsTabBtn.classList.add('active');
  }
}

function renderPeople(): void {
  const container = document.getElementById('peoplePanel');
  let html = '';
  for (let i = 0; i < allPeople.length; i++) {
    const person = allPeople[i];
    if (!person) continue;
    const count = countEvidenceForPerson(person);

    html += '<div class="person-card">';
    html += '<div class="person-card-header">';
    html +=
      '<img class="person-avatar" src="' +
      person.avatar +
      '" alt="Portrait of ' +
      person.name +
      '">';
    html +=
      '<div><h3>' +
      person.name +
      '</h3><div class="person-role">' +
      person.role +
      '</div></div>';
    html += '</div>';
    html += '<p><strong>Speciality:</strong> ' + person.speciality + '</p>';
    html += '<ul>';
    for (let r = 0; r < person.responsibilities.length; r++) {
      html += '<li>' + person.responsibilities[r] + '</li>';
    }
    html += '</ul>';
    html +=
      '<div class="person-statement">&ldquo;' +
      person.statement +
      '&rdquo;</div>';
    html +=
      '<p>' +
      count +
      ' related evidence item' +
      (count === 1 ? '' : 's') +
      ' &mdash; ';
    html +=
      '<button type="button" class="evidence-count-link" data-person-id="' +
      person.id +
      '">view</button></p>';
    html += '</div>';
  }
  if (!container) {
    console.error('Failed to find people panel');
    return;
  }
  container.innerHTML = html;

  const links = container.querySelectorAll('.evidence-count-link');
  for (let l = 0; l < links.length; l++) {
    const link = links[l];
    if (!link) continue;

    // examples on neccessary as HTMLElement casts
    // 1) getElementById returns HTMLElement or null, which is too generic for .value. 
    // The index.html uses it in <select>, so HTMLElement is the correct type. 
    // 2) currentTarget has type EventTarget - which is too generic for getAttribute(). Only (HTML-)Element has that method.

    link.addEventListener('click', (e) => {
      const personId = (e.currentTarget as HTMLElement).getAttribute('data-person-id');
      const filterPerson = document.getElementById('filterPerson') as HTMLInputElement | null;
      if (!personId || !filterPerson) return;
      filterPerson.value = personId;
      navigateTo('evidence');
      setTimeout(() => {
        renderEvidenceList();
      }, 0);
    });
  }
}

function renderLocations() {
  const container = document.getElementById('locationsPanel');
  let html = '';
  for (let i = 0; i < allLocations.length; i++) {
    const loc = allLocations[i];
    if (!loc) continue;
    html += '<div class="location-card">';
    html += '<h3>' + loc.id + ' &mdash; ' + loc.name + '</h3>';
    html += '<p>' + loc.description + '</p>';
    html += '<p><strong>Contains:</strong></p><ul>';
    for (let c = 0; c < loc.contains.length; c++) {
      html += '<li>' + loc.contains[c] + '</li>';
    }
    html += '</ul></div>';
  }
  if (!container) {
    console.error('Failed to find locations panel');
    return;
  }
  container.innerHTML = html;
}

export { renderPeople, renderLocations, switchPeopleTab };
