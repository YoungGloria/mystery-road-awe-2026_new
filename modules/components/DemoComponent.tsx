import React from 'react';
import { Component } from 'react';

// React Component for Demo 5
// Mod

export function DemoComponent(props: { label?: string }): React.ReactElement {
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
