let currentPage = 'dashboard';
let loadingStepsRemaining = 2;
let caseData = {};

// Track which views have been rendered to avoid unnecessary re-rendering - does not need setter as only fields are mutated, the object is not reassigned
var viewRendered = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false,
};

function setCurrentPage(page) {
  currentPage = page;
}

function decrementLoadingSteps() {
  loadingStepsRemaining--;
  return loadingStepsRemaining;
}

// DEMO 9:
// function loadCaseData() {
//   return fetch("data/case.json")
//     .then(function (caseRes) {
//       return caseRes.json()
//     })
//     .then(function (caseJson) {
//       return caseData = caseJson;
//     })
//   .catch(function (err) {
//     console.error("Failed to load case.json", err);
//     alert("Case data could not be loaded. Some views may be incomplete.");
//   });
// }

async function loadCaseData() {
  try {
    const caseRes = await fetch('data/case.json');

    if (!caseRes.ok) {
      throw new Error('Error fetching case.json: ' + caseRes.statusText);
    }

    caseData = await caseRes.json();
    return caseData;
  } catch (err) {
    console.error('Failed to load case.json', err);
    alert('Case data could not be loaded. Some views may be incomplete.');
  }
}

export {
  currentPage,
  loadingStepsRemaining,
  caseData,
  viewRendered,
  decrementLoadingSteps,
  setCurrentPage,
  loadCaseData,
};
