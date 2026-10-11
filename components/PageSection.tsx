import type { ReactNode } from 'react';

type PageSectionProps = {
  title: string;
  children: ReactNode;
};

export function PageSection({ title, children }: PageSectionProps) {
  return (
    <section className="view active">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
