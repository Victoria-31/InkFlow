import type { LoginInput } from '@inkflow/shared';
import { HttpError } from '../errors/http-error.js';
import * as accountRepository from '../repositories/account.repository.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signAuthToken } from '../utils/session.js';

const DUMMY_HASH = await hashPassword('dummy-password-for-timing');

async function verifyCredentials({ email, password }: LoginInput) {
  const account = await accountRepository.findByEmail(email);

  // Always run Argon2 so response time is similar for unknown emails (timing attack)
  const isValid = await verifyPassword(account?.passwordHash ?? DUMMY_HASH, password);

  if (!account || !isValid) {
    throw new HttpError(401, 'invalid_credentials');
  }

  return account;
}

export async function login(input: LoginInput) {
  const account = await verifyCredentials(input);
  const token = signAuthToken({ sub: String(account.id), role: account.role });

  return { token, role: account.role };
}
