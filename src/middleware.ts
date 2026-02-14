import { defineMiddleware } from "astro:middleware";
import { getUserFromSession } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, locals, cookies } = context;

  if (url.pathname.startsWith("/private")) {
    const user = await getUserFromSession(cookies, locals.runtime.env);

    if (!user) {
      const redirect = encodeURIComponent(url.pathname);
      return context.redirect(`/login?redirect=${redirect}`);
    }

    locals.user = user;
  }

  return next();
});
