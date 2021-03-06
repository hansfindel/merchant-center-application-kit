import React from 'react';
import { render, waitForElement } from '../../test-utils';
import LockedAccount from './async';

it('renders maintenance page for locked account', async () => {
  const { getByText, queryByText } = render(<LockedAccount />);
  await waitForElement(() => getByText(/Account Locked/i));
  expect(queryByText(/reset your password/i)).toBeDefined();
  expect(queryByText(/Help Desk/i)).toBeDefined();
});
