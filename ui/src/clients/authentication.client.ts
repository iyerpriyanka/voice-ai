import {
  AuthenticateUser,
  AuthorizeUser,
  ChangePassword,
  CreatePassword,
  ForgotPassword,
  Github,
  Google,
  Linkedin,
  RegisterUser,
  VerifyToken,
} from '@rapidaai/react';

import { withConnection } from './connection';

export const authenticateUser = withConnection(AuthenticateUser);
export const authorizeUser = withConnection(AuthorizeUser);
export const registerUser = withConnection(RegisterUser);
export const verifyToken = withConnection(VerifyToken);
export const forgotPassword = withConnection(ForgotPassword);
export const createPassword = withConnection(CreatePassword);
export const changePassword = withConnection(ChangePassword);

export const googleAuth = withConnection(Google);
export const linkedinAuth = withConnection(Linkedin);
export const githubAuth = withConnection(Github);
