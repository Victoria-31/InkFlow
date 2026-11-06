// import type { accountSchema } from '@inkflow/shared';
import { HttpError } from '../errors/http-error.js';
import * as accountRepository from '../repositories/account.repository.js';


export async function loginRequest(email: string, password: string) {
  const account = await accountRepository.findByEmail(email);
  if (!account) {
    throw new HttpError(401, 'invalid_credentials');
  }


  return ;
}
