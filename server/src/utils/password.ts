import argon2, { type HashOptions } from 'argon2';

// OWASP recommended parameters
const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
} satisfies HashOptions;

export function hashPassword(password: string) {
  return argon2.hash(password, hashingOptions);
}

export function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}
