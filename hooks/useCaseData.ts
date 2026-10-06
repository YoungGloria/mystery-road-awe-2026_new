import { useEffect, useState } from 'react';
import { loadCaseData } from '../modules/states/appState';
import {
  loadEvidenceData,
  loadBookmarksFromStorage,
  bookmarks,
} from '../modules/states/evidenceState';
import { loadPeople } from '../modules/states/peopleState';
import { loadLocations } from '../modules/states/locationState';
import { loadTimelineData } from '../modules/states/timelineState';
import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from '../modules/types';

export type CaseDataState =
  | { status: 'loading' }
  | {
      status: 'ready';
      caseData: CaseData | null;
      evidence: Evidence[];
      people: Person[];
      locations: Location[];
      timeline: TimelineEvent[];
      bookmarkCount: number;
    };

export function useCaseData(): CaseDataState {
  const [state, setState] = useState<CaseDataState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      loadBookmarksFromStorage();
      const [caseData, people, locations, evidence, timeline] =
        await Promise.all([
          loadCaseData(),
          loadPeople(),
          loadLocations(),
          loadEvidenceData(),
          loadTimelineData(),
        ]);

      if (cancelled) return;
      setState({
        status: 'ready',
        caseData,
        people,
        locations,
        evidence: evidence ?? [],
        timeline,
        bookmarkCount: bookmarks.length,
      });
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}