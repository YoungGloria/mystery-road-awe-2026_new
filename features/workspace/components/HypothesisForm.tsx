import { useEffect, useState } from 'react';
import type { Evidence, Person } from '../../../modules/types';
import { Badge } from '../../../shared/components/Badge';

const STORAGE_KEY_HYPOTHESIS = 'remotion_hypothesis';

type HypothesisDraft = {
  suspectId: string;
  nature: string;
  evidenceIds: string[];
  confidence: number;
  explanation: string;
  alternative: string;
};

const EMPTY_DRAFT: HypothesisDraft = {
  suspectId: '',
  nature: '',
  evidenceIds: [],
  confidence: 50,
  explanation: '',
  alternative: '',
};

function readHypothesis(): HypothesisDraft {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);
    if (!raw) return EMPTY_DRAFT;
    const stored = JSON.parse(raw) as Partial<HypothesisDraft>;
    return {
      suspectId: stored.suspectId ?? '',
      nature: stored.nature ?? '',
      evidenceIds: Array.isArray(stored.evidenceIds) ? stored.evidenceIds : [],
      confidence:
        typeof stored.confidence === 'number' ? stored.confidence : 50,
      explanation: stored.explanation ?? '',
      alternative: stored.alternative ?? '',
    };
  } catch (error) {
    console.warn('Could not read stored hypothesis, starting empty', error);
    return EMPTY_DRAFT;
  }
}

type HypothesisFormProps = {
  evidence: Evidence[];
  people: Person[];
};

export function HypothesisForm({ evidence, people }: HypothesisFormProps) {
  const [draft, setDraft] = useState<HypothesisDraft>(readHypothesis);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isSaved) return;
    const timeout = window.setTimeout(() => setIsSaved(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [isSaved]);

  function updateDraft(changes: Partial<HypothesisDraft>) {
    setDraft((current) => ({ ...current, ...changes }));
  }

  function saveHypothesis(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      localStorage.setItem(
        STORAGE_KEY_HYPOTHESIS,
        JSON.stringify({ ...draft, savedAt: new Date().toISOString() })
      );
      setIsSaved(true);
    } catch (error) {
      console.error('Could not save hypothesis draft', error);
      window.alert('Your hypothesis could not be saved to local storage.');
    }
  }

  return (
    <section className="hypothesis-card">
      <h3>Hypothesis builder</h3>
      <p className="hint-text">
        Connect a suspected person with supporting evidence and record your
        reasoning.
      </p>
      <form onSubmit={saveHypothesis}>
        <div className="form-row">
          <label htmlFor="hypSuspect">Suspected person</label>
          <select
            id="hypSuspect"
            value={draft.suspectId}
            onChange={(event) => updateDraft({ suspectId: event.target.value })}
          >
            <option value="">Select a person&hellip;</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="hypNature">Nature of involvement</label>
          <input
            id="hypNature"
            type="text"
            value={draft.nature}
            onChange={(event) => updateDraft({ nature: event.target.value })}
          />
        </div>
        <div className="form-row">
          <label htmlFor="hypEvidence">Supporting evidence</label>
          <select
            id="hypEvidence"
            multiple
            value={draft.evidenceIds}
            onChange={(event) =>
              updateDraft({
                evidenceIds: Array.from(
                  event.target.selectedOptions,
                  (option) => option.value
                ),
              })
            }
          >
            {evidence.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} - {item.title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="hypConfidence">
            Confidence: <span>{draft.confidence}</span>
          </label>
          <input
            id="hypConfidence"
            type="range"
            min="0"
            max="100"
            value={draft.confidence}
            onChange={(event) =>
              updateDraft({ confidence: Number(event.target.value) })
            }
          />
        </div>
        <div className="form-row">
          <label htmlFor="hypExplanation">Explanation</label>
          <textarea
            id="hypExplanation"
            rows={4}
            value={draft.explanation}
            onChange={(event) =>
              updateDraft({ explanation: event.target.value })
            }
          />
        </div>
        <div className="form-row">
          <label htmlFor="hypAlternative">Alternative explanation</label>
          <input
            id="hypAlternative"
            type="text"
            value={draft.alternative}
            onChange={(event) =>
              updateDraft({ alternative: event.target.value })
            }
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save hypothesis
          </button>
          {isSaved && (
            <span className="saved-msg" role="status">
              Hypothesis saved.
            </span>
          )}
          <Badge variant="relevant">{draft.confidence}% confidence</Badge>
        </div>
      </form>
    </section>
  );
}
