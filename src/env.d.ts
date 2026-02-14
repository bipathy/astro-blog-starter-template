interface Env {
  AUTH_USERNAME: string;
  AUTH_PASSWORD_HASH: string;
  SESSION_SECRET: string;
  SESSION_MAX_AGE?: string;
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    user?: {
      username: string;
    };
  }
}
