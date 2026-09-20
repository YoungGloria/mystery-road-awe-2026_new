function formatDate(ts: string | number | undefined): string {
  if (!ts) return 'Unknown date';
  const d = new Date(ts);
  if (isNaN(d.getTime())) return String(ts);
  return (
    d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) +
    ' ' +
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  );
}

function getStatusBadgeClass(status: string | undefined): string {
  const s = (status || '').toLowerCase();
  if (s === 'reviewed') return 'badge-reviewed';
  if (s === 'flagged') return 'badge-flagged';
  return 'badge-unreviewed';
}

function getRelevanceBadgeClass(relevance: string | undefined): string {
  const r = (relevance || '').toLowerCase();
  if (r === 'relevant') return 'badge-relevant';
  return 'badge-unreviewed';
}

function certaintyBadgeClass(certainty: string | undefined): string {
  if (certainty === 'confirmed') return 'reviewed';
  if (certainty === 'contradictory') return 'critical';
  if (certainty === 'reported') return 'flagged';
  return 'unreviewed';
}

function getSelectedOptions(selectEl: HTMLSelectElement): string[] {
  const result: string[] = [];
  for (let i = 0; i < selectEl.options.length; i++) {
    const option = selectEl.options[i];
    if (option?.selected) result.push(option.value);
  }
  return result;
}

export {
  formatDate,
  getStatusBadgeClass,
  getRelevanceBadgeClass,
  certaintyBadgeClass,
  getSelectedOptions,
};
