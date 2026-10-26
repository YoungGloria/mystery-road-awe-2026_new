const TABS = [
  { id: 'people', label: 'People' },
  { id: 'locations', label: 'Locations' },
] as const;

export type TeamTab = (typeof TABS)[number]['id'];

type TeamTabsProps = { activeTab: TeamTab };

export function TeamTabs({ activeTab }: TeamTabsProps) {
  return (
    <div className="tab-bar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={tab.id === activeTab ? 'tab-btn active' : 'tab-btn'}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}