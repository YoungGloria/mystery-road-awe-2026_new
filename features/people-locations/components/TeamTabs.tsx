// features/people-locations/components/TeamTabs.tsx
import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/team/people', label: 'People' },
  { to: '/team/locations', label: 'Locations' },
] as const;

export function TeamTabs() {
  return (
    <div className="tab-bar">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            isActive ? 'tab-btn active' : 'tab-btn'
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
