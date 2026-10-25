import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

vi.mock('recharts', async () => {
  const original = await vi.importActual<Record<string, unknown>>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'div',
        { className: 'recharts-responsive-container-mock', style: { width: 800, height: 400 } },
        children
      ),
  };
});
