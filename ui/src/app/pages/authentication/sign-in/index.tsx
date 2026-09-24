import { useState, useContext, useEffect, useCallback } from 'react';
import { Helmet } from '@/app/components/app-shell/helmet';
import { SocialButtonGroup } from '@/app/components/ui/primitives/buttons/social-button-group';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthenticateResponse } from '@rapidaai/react';
import { useRapidaStore } from '@/stores/app';
import { ServiceError } from '@rapidaai/react';
import { AuthContext } from '@/context/auth-context';
import { useWorkspace } from '@/workspace';
import { Stack, TextInput } from '@/app/components/ui/primitives';
import { PrimaryButton } from '@/app/components/ui/primitives';
import { Notification } from '@/app/components/ui/feedback';
import { ArrowRight } from '@carbon/icons-react';
import { Link, PasswordInput } from '@carbon/react';
import {
  authenticateUser,
  githubAuth,
  googleAuth,
  linkedinAuth,
} from '@/clients';

export function SignInPage() {
  let navigate = useNavigate();
  const { setAuthentication } = useContext(AuthContext);
  const { loading, showLoader, hideLoader } = useRapidaStore();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');
  const workspace = useWorkspace();
  const [searchParams] = useSearchParams();
  const { next, externalValidation, code, state } = Object.fromEntries(
    searchParams.entries(),
  );

  const afterAuthenticate = useCallback(
    (err: ServiceError | null, auth: AuthenticateResponse | null) => {
      hideLoader();
      if (auth?.getSuccess()) {
        if (setAuthentication)
          setAuthentication(auth.getData(), () => {
            if (next && externalValidation) {
              window.location.replace(next);
              return;
            }
            return navigate('/dashboard');
          });
      } else {
        let errorMessage = auth?.getError();
        if (errorMessage) setError(errorMessage.getHumanmessage());
        else {
          console.error(err);
          setError('Unable to process your request. please try again later.');
        }
        return;
      }
    },
    [],
  );

  const onAuthenticate = data => {
    showLoader();
    authenticateUser(data.email, data.password, afterAuthenticate);
  };

  useEffect(() => {
    if (state && code) {
      showLoader();
      if (state === 'google') googleAuth(afterAuthenticate, state, code);
      if (state === 'linkedin') linkedinAuth(afterAuthenticate, state, code);
      if (state === 'github') githubAuth(afterAuthenticate, state, code);
    }
  }, [afterAuthenticate, code, state]);

  return (
    <Stack gap={6}>
      <Helmet title="Sign in to your account" />
      <Stack gap={2}>
        <h1 className="m-0 text-[1.8rem] leading-tight">Signin</h1>
        {workspace.authentication.signUp.enable && (
          <p className="mt-1.5 text-sm leading-[1.4286] text-(--cds-text-secondary)">
            Don't have an account? &nbsp;
            <Link href="/auth/signup" className="text-sm">
              Sign-up
            </Link>
          </p>
        )}

        <div
          aria-hidden="true"
          className={`h-px bg-gray-300 dark:bg-gray-900 mt-3`}
        />
      </Stack>

      <form className="mt-6" onSubmit={handleSubmit(onAuthenticate)}>
        <Stack gap={5}>
          <TextInput
            id="signin-email"
            labelText="Email Address"
            type="email"
            required
            autoComplete="email"
            placeholder="eg: john@example.com"
            {...register('email')}
          />
          <PasswordInput
            id="signin-password"
            labelText="Password"
            required
            autoComplete="current-password"
            placeholder="******"
            {...register('password')}
          />
          {error && (
            <Notification kind="error" title="Error" subtitle={error} />
          )}
          <PrimaryButton
            size="lg"
            renderIcon={ArrowRight}
            isLoading={loading}
            type="submit"
            className="!w-full !max-w-none !justify-between"
          >
            Continue
          </PrimaryButton>
        </Stack>
        <div
          aria-hidden="true"
          className={`h-px bg-gray-300 dark:bg-gray-900 mt-3`}
        />
      </form>

      <Stack gap={2}>
        <p className="text-center">
          <Link href="/auth/forgot-password" className="text-sm">
            Can't sign in?
          </Link>
        </p>
      </Stack>
      <SocialButtonGroup {...workspace.authentication.signIn.providers} />
    </Stack>
  );
}
