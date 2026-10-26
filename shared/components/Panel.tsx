import type { ReactNode } from 'react';

type PanelProps = {
  title?: string;
  children: ReactNode;
};

export function Panel({ title, children }: PanelProps) {
  return (
    <section className="panel">
      {title && <h3>{title}</h3>}
      {children}
    </section>
  );
}
