import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '@/context/auth-context';
import type { AuthenticationType } from '@/types';
import { IgnoreBox, ProtectedBox } from '../protected-box';

type AuthValue = Partial<AuthenticationType>;

const authenticatedValue: AuthValue = {
  isAuthenticated: () => true,
  isThereOrganization: () => true,
  isThereProject: () => true,
};

const renderProtectedRoute = (initialEntry: string, authValue: AuthValue) =>
  render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedBox>
                <div>Protected content</div>
              </ProtectedBox>
            }
          />
          <Route
            path="/onboarding/organization"
            element={
              <ProtectedBox>
                <div>Organization onboarding</div>
              </ProtectedBox>
            }
          />
          <Route
            path="/onboarding/project"
            element={
              <ProtectedBox>
                <div>Project onboarding</div>
              </ProtectedBox>
            }
          />
          <Route path="/auth/signin" element={<div>Sign in</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );

describe('ProtectedBox', () => {
  it('renders protected content when auth, organization, and project are valid', () => {
    renderProtectedRoute('/dashboard', authenticatedValue);

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to sign in and preserves search params', () => {
    renderProtectedRoute('/dashboard?tab=usage', {
      ...authenticatedValue,
      isAuthenticated: () => false,
    });

    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('redirects users without an organization except on organization onboarding', () => {
    renderProtectedRoute('/dashboard', {
      ...authenticatedValue,
      isThereOrganization: () => false,
    });

    expect(screen.getByText('Organization onboarding')).toBeInTheDocument();

    renderProtectedRoute('/onboarding/organization', {
      ...authenticatedValue,
      isThereOrganization: () => false,
    });

    expect(screen.getAllByText('Organization onboarding')).toHaveLength(2);
  });

  it('redirects users without a project except on project onboarding', () => {
    renderProtectedRoute('/dashboard', {
      ...authenticatedValue,
      isThereProject: () => false,
    });

    expect(screen.getByText('Project onboarding')).toBeInTheDocument();

    renderProtectedRoute('/onboarding/project', {
      ...authenticatedValue,
      isThereProject: () => false,
    });

    expect(screen.getAllByText('Project onboarding')).toHaveLength(2);
  });
});

describe('IgnoreBox', () => {
  it('unauthenticates auth pages without a valid external auth redirect', async () => {
    const unauthenticate = jest.fn();

    render(
      <AuthContext.Provider value={{ unauthenticate }}>
        <MemoryRouter initialEntries={['/auth/signin']}>
          <IgnoreBox>
            <div>Auth content</div>
          </IgnoreBox>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText('Auth content')).toBeInTheDocument();
    await waitFor(() => expect(unauthenticate).toHaveBeenCalledTimes(1));
  });

  it('renders auth pages when unauthenticate is unavailable', () => {
    render(
      <AuthContext.Provider value={{}}>
        <MemoryRouter initialEntries={['/auth/signin']}>
          <IgnoreBox>
            <div>Auth content</div>
          </IgnoreBox>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText('Auth content')).toBeInTheDocument();
  });

  it('redirects valid external auth sessions without unauthenticating', async () => {
    const replaceLocation = jest.fn();
    const unauthenticate = jest.fn();

    render(
      <AuthContext.Provider
        value={{
          ...authenticatedValue,
          unauthenticate,
        }}
      >
        <MemoryRouter
          initialEntries={[
            '/auth/signin?next=https://example.com/app&externalValidation=1',
          ]}
        >
          <IgnoreBox replaceLocation={replaceLocation}>
            <div>Auth content</div>
          </IgnoreBox>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    await waitFor(() =>
      expect(replaceLocation).toHaveBeenCalledWith('https://example.com/app'),
    );
    expect(unauthenticate).not.toHaveBeenCalled();
  });
});
