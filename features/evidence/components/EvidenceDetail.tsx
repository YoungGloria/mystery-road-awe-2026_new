import { useEffect, useState } from 'react';
import {
  loadNoteForEvidence,
  saveNoteForEvidence,
} from '../../../modules/states/evidenceState';
import { formatDate } from '../../../modules/helpers';
import type {
  Evidence,
  EvidenceRelevance,
  EvidenceStatus,
  Location,
  Person,
} from '../../../modules/types';

type EvidenceDetailProps = {
  item: Evidence;
  people: Person[];
  locations: Location[];
  onClose: () => void;
  onUpdate: (changes: Partial<Evidence>) => void;
};

export function EvidenceDetail({
  item,
  people,
  locations,
  onClose,
  onUpdate,
}: EvidenceDetailProps) {
  const [note, setNote] = useState(() => loadNoteForEvidence(item.id));
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    setNote(loadNoteForEvidence(item.id));
    setNoteSaved(false);
  }, [item.id]);

  const relatedPeople = item.personIds.map(
    (id) => people.find((person) => person.id === id)?.name ?? id
  );
  const relatedLocations = item.locationIds.map((id) => {
    const location = locations.find((candidate) => candidate.id === id);
    return location ? `${location.id} - ${location.name}` : id;
  });

  function saveNote() {
    saveNoteForEvidence(item.id, note);
    setNoteSaved(true);
  }

  return (
    <section
      className="evidence-detail"
      aria-labelledby="evidence-detail-title"
    >
      <div className="evidence-detail-header">
        <div>
          <h2 id="evidence-detail-title">{item.title}</h2>
          <div className="evidence-meta">
            {item.id} &middot; {item.type} &middot; {formatDate(item.timestamp)}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-small"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      {item.tags.includes('critical') && (
        <div className="warning-banner">
          This item is tagged as critical evidence.
        </div>
      )}
      <div className="detail-field">
        <strong>Summary</strong>
        {item.summary}
      </div>
      <div className="evidence-detail-content">{item.content}</div>
      <div className="detail-field">
        <strong>Related people</strong>
        {relatedPeople.join(', ') || 'None'}
      </div>
      <div className="detail-field">
        <strong>Related locations</strong>
        {relatedLocations.join(', ') || 'None'}
      </div>
      <div className="detail-field">
        <strong>Tags</strong>
        {item.tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>
      <div className="detail-field">
        <label htmlFor="detailStatusSelect">
          <strong>Review status</strong>
        </label>
        <select
          id="detailStatusSelect"
          value={item.status}
          onChange={(event) =>
            onUpdate({ status: event.target.value as EvidenceStatus })
          }
        >
          <option value="unreviewed">Unreviewed</option>
          <option value="reviewed">Reviewed</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>
      <div className="detail-field">
        <label htmlFor="detailRelevanceSelect">
          <strong>Relevance</strong>
        </label>
        <select
          id="detailRelevanceSelect"
          value={item.relevance}
          onChange={(event) =>
            onUpdate({ relevance: event.target.value as EvidenceRelevance })
          }
        >
          <option value="unknown">Unknown</option>
          <option value="relevant">Relevant</option>
          <option value="irrelevant">Irrelevant</option>
        </select>
      </div>
      <div className="detail-field">
        <label htmlFor="evidenceNoteInput">
          <strong>Investigator note</strong>
        </label>
        <textarea
          id="evidenceNoteInput"
          className="note-textarea"
          rows={3}
          value={note}
          placeholder="Add a private note about this evidence..."
          onChange={(event) => {
            setNote(event.target.value);
            setNoteSaved(false);
          }}
        />
        <button
          type="button"
          className="btn btn-primary btn-small"
          style={{ marginTop: '6px' }}
          onClick={saveNote}
        >
          Save note
        </button>
        {noteSaved && (
          <div className="detail-field">
            <strong>Note preview</strong>
            <div>{note}</div>
          </div>
        )}
      </div>
    </section>
  );
}
