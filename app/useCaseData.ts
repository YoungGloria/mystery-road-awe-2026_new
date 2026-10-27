import { useCallback, useEffect, useState } from 'react';
import { loadCaseData } from '../modules/states/appState';
import {
  loadEvidenceData,
  loadBookmarksFromStorage,
  applyStoredBookmarkFlags,
  loadNotesFromStorage,
  notesStore,
  saveNoteForEvidence,
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
type EvidenceNoteSave = (evidenceId: string, text: string) => void;

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
      notes: Record<string, string>;
      updateEvidence: EvidenceUpdate;
      toggleEvidenceBookmark: EvidenceBookmarkToggle;
      saveEvidenceNote: EvidenceNoteSave;
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
        };
      });
    },
    []
  );

  const saveEvidenceNote = useCallback<EvidenceNoteSave>((evidenceId, text) => {
    saveNoteForEvidence(evidenceId, text);
    setState((current) => {
      if (current.status !== 'ready') return current;

      return {
        ...current,
        notes: { ...current.notes, [evidenceId]: text },
      };
    });
  }, []);

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
        notes: { ...notesStore },
        updateEvidence,
        toggleEvidenceBookmark,
        saveEvidenceNote,
      });
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [saveEvidenceNote, toggleEvidenceBookmark, updateEvidence]);

  return state;
}
