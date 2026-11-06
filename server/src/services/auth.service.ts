import type { LoginInput } from '@inkflow/shared';
import { HttpError } from '../errors/http-error.js';
import * as accountRepository from '../repositories/account.repository.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

const DUMMY_HASH = await hashPassword('dummy-password-for-timing');

export async function verifyCredentials({ email, password }: LoginInput) {
  const account = await accountRepository.findByEmail(email);

  // Always run Argon2 so response time is similar for unknown emails (timing attack)
  const isValid = await verifyPassword(account?.passwordHash ?? DUMMY_HASH, password);

  if (!account || !isValid) {
    throw new HttpError(401, 'invalid_credentials');
  }

  return account;
}
