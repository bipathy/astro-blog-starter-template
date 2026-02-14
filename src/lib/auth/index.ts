import type { AstroCookies } from "astro";
import { verifyPassword } from "./password";
import { createSessionToken, verifySessionToken } from "./session";
import { setSessionCookie, getSessionCookie, clearSessionCookie } from "./cookies";

export { clearSessionCookie } from "./cookies";
export { hashPassword } from "./password";

const DEFAULT_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export interface AuthUser {
  username: string;
}

export async function authenticateUser(
  username: string,
  password: string,
  env: Env,
): Promise<boolean> {
  if (username !== env.AUTH_USERNAME) return false;
  return verifyPassword(password, env.AUTH_PASSWORD_HASH);
}

export async function loginAndSetCookie(
  username: string,
  cookies: AstroCookies,
  env: Env,
): Promise<void> {
  const maxAge = env.SESSION_MAX_AGE
    ? parseInt(env.SESSION_MAX_AGE, 10)
    : DEFAULT_MAX_AGE;

  const token = await createSessionToken(username, env.SESSION_SECRET, maxAge);
  setSessionCookie(cookies, token, maxAge);
}

export async function getUserFromSession(
  cookies: AstroCookies,
  env: Env,
): Promise<AuthUser | null> {
  const token = getSessionCookie(cookies);
  if (!token) return null;

  const payload = await verifySessionToken(token, env.SESSION_SECRET);
  if (!payload) return null;

  return { username: payload.username };
}
