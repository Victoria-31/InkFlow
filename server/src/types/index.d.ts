import type { AuthAccount } from '../utils/session.js';

declare global {
  namespace Express {
    interface Request {
      // Set by requireAuth on protected routes
      account?: AuthAccount;
    }
  }
}
