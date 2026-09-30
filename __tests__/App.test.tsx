/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  jest.useFakeTimers();
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
    await Promise.resolve();
  });

  await ReactTestRenderer.act(async () => {
    jest.runOnlyPendingTimers();
    await Promise.resolve();
  });

  ReactTestRenderer.act(() => renderer?.unmount());
  jest.clearAllTimers();
  jest.useRealTimers();
});
