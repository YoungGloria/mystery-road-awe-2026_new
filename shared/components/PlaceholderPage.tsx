type PlaceholderPageProps = {
  title: string;
};

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className="view active">
      <h2>{title}</h2>
      <p>This view has not been migrated to React yet.</p>
    </section>
  );
}
