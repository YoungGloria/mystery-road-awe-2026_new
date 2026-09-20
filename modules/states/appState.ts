import type { CaseData } from '../types.ts';

let currentPage: string = 'dashboard';
let loadingStepsRemaining: number = 2;
let caseData: CaseData | null = null;

// Track which views have been rendered to avoid unnecessary re-rendering - does not need setter as only fields are mutated, the object is not reassigned
const viewRendered = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false,
};

function setCurrentPage(page: string) {
  currentPage = page;
}

function decrementLoadingSteps() {
  loadingStepsRemaining--;
  return loadingStepsRemaining;
}

async function loadCaseData(): Promise<CaseData | null> {
  try {
    const caseRes = await fetch('data/case.json');

    if (!caseRes.ok) {
      throw new Error('Error fetching case.json: ' + caseRes.statusText);
    }

    caseData = (await caseRes.json()) as CaseData;
    return caseData;
  } catch (err) {
    console.error('Failed to load case.json', err);
    alert('Case data could not be loaded. Some views may be incomplete.');
    return null;
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
