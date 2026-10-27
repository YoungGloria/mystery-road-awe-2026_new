import { useCallback, useEffect, useState } from 'react';
import { loadCaseData } from '../modules/states/appState';
import {
  loadEvidenceData,
  loadBookmarksFromStorage,
  applyStoredBookmarkFlags,
  loadNotesFromStorage,
  addBookmark,
  removeBookmark,
  saveBookmarksToStorage,
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

type EvidenceUpdate = (evidenceId: string, changes: Partial<Evidence>) => void;
type EvidenceBookmarkToggle = (evidenceId: string) => void;

export type ReadyCaseData = Extract<CaseDataState, { status: 'ready' }>;

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
      updateEvidence: EvidenceUpdate;
      toggleEvidenceBookmark: EvidenceBookmarkToggle;
    };

export function useCaseData(): CaseDataState {
  const [state, setState] = useState<CaseDataState>({ status: 'loading' });

  const updateEvidence = useCallback<EvidenceUpdate>((evidenceId, changes) => {
    setState((current) => {
      if (current.status !== 'ready') return current;

      return {
        ...current,
        evidence: current.evidence.map((item) =>
          item.id === evidenceId ? { ...item, ...changes } : item
        ),
      };
    });
  }, []);

  const toggleEvidenceBookmark = useCallback<EvidenceBookmarkToggle>(
    (evidenceId) => {
      setState((current) => {
        if (current.status !== 'ready') return current;

        const evidence = current.evidence.map((item) => {
          if (item.id !== evidenceId) return item;

          const bookmarked = !item.bookmarked;
          if (bookmarked) {
            addBookmark(evidenceId);
          } else {
            removeBookmark(evidenceId);
          }
          return { ...item, bookmarked };
        });

        saveBookmarksToStorage();
        return {
          ...current,
          evidence,
          bookmarkCount: evidence.filter((item) => item.bookmarked).length,
        };
      });
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      loadBookmarksFromStorage();
      loadNotesFromStorage();
      const [caseData, people, locations, evidence, timeline] =
        await Promise.all([
          loadCaseData(),
          loadPeople(),
          loadLocations(),
          loadEvidenceData(),
          loadTimelineData(),
        ]);

      if (cancelled) return;
      applyStoredBookmarkFlags();
      const loadedEvidence = evidence ?? [];
      setState({
        status: 'ready',
        caseData,
        people,
        locations,
        evidence: loadedEvidence,
        timeline,
        bookmarkCount: loadedEvidence.filter((item) => item.bookmarked).length,
        updateEvidence,
        toggleEvidenceBookmark,
      });
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [toggleEvidenceBookmark, updateEvidence]);

  return state;
}
