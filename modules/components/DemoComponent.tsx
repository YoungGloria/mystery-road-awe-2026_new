// React Component for Demo 5

export function DemoComponent(props: { label?: string }) {
  const fallbackLabel = 'Demo Component';
  return (
    <>
      <h2>React Component:</h2>
      <span className="component demo-component">
        {props.label || fallbackLabel}
      </span>
    </>
  );
}
