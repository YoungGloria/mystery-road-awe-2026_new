// DEMO 10: Helper functions for managing the application's state and UI
const formatDate = (ts) => {
  if (!ts) return 'Unknown date';
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return (
    d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) +
    ' ' +
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  );
};

// function formatDate(ts) {
//   if (!ts) return "Unknown date";
//   const d = new Date(ts);
//   if (isNaN(d.getTime())) return ts;
//   return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
//     " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
// }

//currently used only on evidence, but may be useful for timeline events too
// function getStatusBadgeClass(status) {
//   const s = (status || "").toLowerCase();
//   if (s === "reviewed") return "badge-reviewed";
//   if (s === "flagged") return "badge-flagged";
//   return "badge-unreviewed";
// }

// DEMO 10:Arrow function version of getStatusBadgeClass
const getStatusBadgeClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'reviewed') return 'badge-reviewed';
  if (s === 'flagged') return 'badge-flagged';
  return 'badge-unreviewed';
};

function getRelevanceBadgeClass(relevance) {
  const r = (relevance || '').toLowerCase();
  if (r === 'relevant') return 'badge-relevant';
  return 'badge-unreviewed';
}

function certaintyBadgeClass(certainty) {
  if (certainty === 'confirmed') return 'reviewed';
  if (certainty === 'contradictory') return 'critical';
  if (certainty === 'reported') return 'flagged';
  return 'unreviewed';
}

function getSelectedOptions(selectEl) {
  const result = [];
  for (let i = 0; i < selectEl.options.length; i++) {
    if (selectEl.options[i].selected) result.push(selectEl.options[i].value);
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
