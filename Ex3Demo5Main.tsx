import React from 'react';
import { createRoot } from 'react-dom/client';
import { DemoComponent } from './modules/components/DemoComponent.js';
import { hideLoadingStep } from './modules/navigation.js';

const reactContainer = document.getElementById('app');

if (reactContainer) {
  const root = createRoot(reactContainer);

  root.render(
    <React.StrictMode>
      <div
        style={{
          padding: '1rem',
          border: '1px dashed #ff4d4d',
          borderRadius: '8px',
          margin: '1rem 0',
        }}
      >
        {/* Fallback */}
        <DemoComponent />

        <hr style={{ margin: '1rem 0', opacity: 0.2 }} />

        {/* Label */}
        <DemoComponent label="#42" />

        <hr style={{ margin: '1rem 0', opacity: 0.2 }} />

        {/* different  Label */}
        <DemoComponent label="Status: needs better label" />
      </div>
    </React.StrictMode>
  );

  hideLoadingStep();
  hideLoadingStep();
}
