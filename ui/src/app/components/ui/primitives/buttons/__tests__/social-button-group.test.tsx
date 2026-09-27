import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { SocialButtonGroup } from '../social-button-group';

jest.mock('@/configs', () => ({
  CONFIG: { connection: { web: 'https://api.example.test' } },
}));

const providers = {
  google: true,
  linkedin: true,
  github: true,
  password: true,
};

describe('SocialButtonGroup', () => {
  it('uses sign-in labels by default', () => {
    render(<SocialButtonGroup {...providers} />);

    expect(
      screen.getByRole('button', { name: 'Sign in with Google' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Sign in with LinkedIn' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Sign in with GitHub' }),
    ).toBeInTheDocument();
  });

  it('uses sign-up labels for account creation', () => {
    render(<SocialButtonGroup {...providers} actionLabel="Sign up" />);

    expect(
      screen.getByRole('button', { name: 'Sign up with Google' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Sign up with LinkedIn' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Sign up with GitHub' }),
    ).toBeInTheDocument();
  });
});
