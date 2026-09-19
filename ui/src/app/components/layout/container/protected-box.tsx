import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { AuthContext } from '@/context/auth-context';

export function ProtectedBox(props: {
  children: React.ReactElement;
  allowedRoles?: string[];
}) {
  const { pathname, search } = useLocation();
  const { isAuthenticated, isThereOrganization, isThereProject } =
    useContext(AuthContext);

  if (isAuthenticated && !isAuthenticated()) {
    return <Navigate to={`/auth/signin${search}`} />;
  }

  if (pathname === '/onboarding/organization') {
    return props.children;
  }

  if (isThereOrganization && !isThereOrganization())
    return <Navigate to="/onboarding/organization" />;

  if (pathname === '/onboarding/project') {
    return props.children;
  }

  if (isThereProject && !isThereProject())
    return <Navigate to="/onboarding/project" />;

  return props.children;
}

export function IgnoreBox(props: { children: React.ReactElement }) {
  const [searchParams] = useSearchParams();
  const searchParamMap = Object.fromEntries(searchParams.entries());
  const {
    unauthenticate,
    isAuthenticated,
    isThereOrganization,
    isThereProject,
  } = useContext(AuthContext);

  useEffect(() => {
    const isAuthValid = () =>
      isAuthenticated &&
      isAuthenticated() &&
      isThereOrganization &&
      isThereOrganization() &&
      isThereProject &&
      isThereProject();

    const isExternalAuthValid = () => {
      return (
        searchParamMap['next'] &&
        searchParamMap['externalValidation'] &&
        isAuthValid()
      );
    };

    if (isExternalAuthValid()) {
      window.location.replace(searchParamMap['next']);
      return;
    }
    if (unauthenticate) unauthenticate();
  }, []);
  return props.children;
}
