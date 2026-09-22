import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Disclosure } from '../disclosure';

describe('Disclosure', () => {
  it('renders children when open', () => {
    render(<Disclosure open>Credential links</Disclosure>);

    expect(screen.getByText('Credential links')).toBeInTheDocument();
  });

  it('does not mount children when closed', () => {
    render(<Disclosure open={false}>Credential links</Disclosure>);

    expect(screen.queryByText('Credential links')).not.toBeInTheDocument();
  });
});
