export type AuthMode = "signed-in" | "guest" | null;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  /** SHA-256 hex of password + salt */
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface AuthSession {
  userId: string | "guest";
  name: string;
  email?: string;
  mode: "signed-in" | "guest";
  provider?: "email";
}

export interface ResetChallenge {
  email: string;
  code: string;
  expiresAt: number;
}

export interface MailMessage {
  id: string;
  to: string;
  subject: string;
  body: string;
  code?: string;
  createdAt: string;
  read: boolean;
}

export const AUTH_USERS_KEY = "brainstorm.auth.users.v1";
export const AUTH_SESSION_KEY = "brainstorm.auth.session.v1";
export const AUTH_RESET_KEY = "brainstorm.auth.reset.v1";
export const AUTH_MAILBOX_KEY = "brainstorm.auth.mailbox.v1";

export function userStorageKey(userId: string) {
  return `brainstorm.scrapbook.user.${userId}.v2`;
}
