export const paths = {
  person: (id: string) => `/team/people/${id}`,
  timelineForPerson: (id: string) =>
    `/timeline?person=${encodeURIComponent(id)}`,
  evidenceForPerson: (id: string) =>
    `/evidence?person=${encodeURIComponent(id)}`,
  evidenceItem: (id: string) => `/evidence?item=${encodeURIComponent(id)}`,
};
