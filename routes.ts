export const VIEWS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'people', label: 'People & Locations' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'workspace', label: 'Workspace' },
] as const;

export type ViewId = (typeof VIEWS)[number]['id'];

export function parseHash(hash: string): ViewId {
  const candidate = hash.replace('#', '');
  const match = VIEWS.find((view) => view.id === candidate);
  return match ? match.id : 'dashboard';
}
