import type { AstroCookies } from "astro";

const COOKIE_NAME = "session";

export function setSessionCookie(
  cookies: AstroCookies,
  token: string,
  maxAge: number,
): void {
  cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function getSessionCookie(cookies: AstroCookies): string | undefined {
  return cookies.get(COOKIE_NAME)?.value;
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(COOKIE_NAME, { path: "/" });
}
