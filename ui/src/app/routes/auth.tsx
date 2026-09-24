import {
  AuthSignInPage,
  AuthSignUpPage,
  AuthForgotPasswordPage,
  AuthChangePasswordPage,
} from '@/app/pages/authentication';
import { CenterBox } from '@/app/components/layout/container/center-box';
import { IgnoreBox } from '@/app/components/layout/container/protected-box';
import { Outlet, Route, Routes } from 'react-router-dom';
import { FlexBox } from '@/app/components/layout/container/flex-box';
export function AuthRoute() {
  return (
    <Routes>
      <Route
        element={
          <IgnoreBox>
            <FlexBox>
              <CenterBox>
                <Outlet />
              </CenterBox>
            </FlexBox>
          </IgnoreBox>
        }
      >
        <Route path="signup" element={<AuthSignUpPage />} />
        <Route index element={<AuthSignInPage />} />
        <Route path="signin" element={<AuthSignInPage />} />
        <Route path="forgot-password" element={<AuthForgotPasswordPage />} />
        <Route
          path="change-password/:token"
          element={<AuthChangePasswordPage />}
        />
      </Route>
    </Routes>
  );
}
