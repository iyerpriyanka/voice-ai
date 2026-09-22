import { CreatePhoneCall, Invoke } from '@rapidaai/react';

import { withConnection } from './connection';

export const invoke = withConnection(Invoke);
export const createPhoneCall = withConnection(CreatePhoneCall);
