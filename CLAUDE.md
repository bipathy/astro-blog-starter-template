# Website Configuration
This project begins with personalizing the template in the repository. We will begin by making the following changes:
1. Remove all social media buttons
2. Edit the frontpage to say “UnityDruid” across the screen in Garamond font, centered on the page. The page background should be a soft warm cream color. 
3. Under “UnityDruid” should be a button that says “enter,” in a serif font which compliments Garamond. 

====================================================================================================
Work Log:
====================================================================================================

## 2026-02-10 - Initial Customization

### 1. Removed all social media buttons
- **Header.astro**: Removed the `<div class="social-links">` block containing Mastodon, Twitter, and GitHub icon links (and associated CSS).
- **Footer.astro**: Removed the identical `<div class="social-links">` block and associated CSS.

### 2. Redesigned homepage (index.astro)
- Replaced the default "Hello, Astronaut!" template content with a centered splash page.
- **"UnityDruid"** displayed as a large heading in Garamond font (`font-family: "Garamond", "EB Garamond", "Georgia", serif`), using `clamp(3rem, 10vw, 7rem)` for responsive sizing.
- **Background**: Soft warm cream (`#f5f0e8`), applied via scoped `<style>` on body.
- **"enter" button**: Styled as a bordered link in Georgia (a serif that complements Garamond), with subtle hover effects. Links to `/blog`.
- Removed Header and Footer components from the landing page for a clean, minimal splash screen.

### Files modified:
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/pages/index.astro`

## 2026-02-10 - Branding & Theme Update

### 1. Renamed site title to "UnityDruid"
- **consts.ts**: Changed `SITE_TITLE` from `"Astro Blog"` to `"UnityDruid"`. This propagates to the header nav, `<title>` tags, RSS feed, and all pages referencing `SITE_TITLE`.

### 2. Converted site to serif fonts + warm cream palette
- **global.css**: Complete theme overhaul:
  - Body font → `Georgia, Garamond, Times New Roman, serif`
  - Headings → `Garamond, EB Garamond, Georgia, serif`
  - Background → warm cream `#f5f0e8` (replacing gray gradient to white)
  - CSS variables retuned to warm earth tones (accent: `#8b6914`, grays → warm browns)
  - Removed Atkinson font-face declarations (no longer used)
- **Header.astro**: Background changed from `white` to `#f5f0e8` (cream).
- **Footer.astro**: Background changed from gray gradient to `#ece5d8` (deeper cream).
- **blog/index.astro**: Post titles use Garamond; dates use Georgia italic — matching the site's serif identity.

### Files modified:
- `src/consts.ts`
- `src/styles/global.css`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/pages/blog/index.astro`

## 2026-02-11 - Authentication & Private Section

### 1. Added simple password auth with stateless signed-cookie sessions
- **Architecture**: PBKDF2 password hashing + HMAC-SHA256 signed session cookies via Web Crypto API. No database or KV needed.
- **astro.config.mjs**: Changed to `output: "server"`. Public pages opt in to prerendering with `export const prerender = true`.
- **env.d.ts**: Added `Env` interface (AUTH_USERNAME, AUTH_PASSWORD_HASH, SESSION_SECRET) and `user` on `App.Locals`.
- **Auth library** (`src/lib/auth/`):
  - `password.ts` — PBKDF2 hash + verify (100k iterations, SHA-256)
  - `session.ts` — Create + verify HMAC-SHA256 signed session tokens
  - `cookies.ts` — Set/get/clear httpOnly secure session cookie
  - `index.ts` — `authenticateUser()`, `loginAndSetCookie()`, `getUserFromSession()`
- **Middleware** (`src/middleware.ts`): Protects `/private/*` routes, redirects to `/login`.
- **Login page** (`src/pages/login.astro`): SSR form, validates credentials, sets session cookie.
- **Logout** (`src/pages/logout.astro`): Clears cookie, redirects to `/`.
- **Private area** (`src/pages/private/index.astro`): Auth banner with username + logout link.
- **Password setup** (`scripts/hash-password.js`): CLI tool to generate password hashes.
- **Environment**: `.dev.vars.example` template, `.dev.vars` for local secrets (gitignored).
- Added `export const prerender = true` to all public pages (index, blog, about, [...slug], rss.xml).

### Credentials (dev):
- Username: `admin`, Password: `testpassword`
- Production: use `wrangler secret put AUTH_USERNAME`, etc.

### Files created:
- `src/lib/auth/password.ts`, `session.ts`, `cookies.ts`, `index.ts`
- `src/middleware.ts`
- `src/pages/login.astro`, `src/pages/logout.astro`
- `src/pages/private/index.astro`
- `scripts/hash-password.js`
- `.dev.vars.example`, `.dev.vars`

### Files modified:
- `astro.config.mjs`
- `src/env.d.ts`
- `src/pages/index.astro`, `src/pages/about.astro`
- `src/pages/blog/index.astro`, `src/pages/blog/[...slug].astro`
- `src/pages/rss.xml.js`

## 2026-02-13 - Conway's Game of Life Simulation

### Plan
Add an interactive, in-browser Conway's Game of Life simulation as a public page at `/life`.

**Design goals:**
- Cream background (`#f5f0e8`) with coffee-brown active cells (`#5c4510`) — matching site palette
- Serif-font controls (Georgia/Garamond) matching the elegant theme
- Canvas-based rendering for performance
- Click-to-toggle cells on the grid
- Controls: Play, Pause, Step, Clear, Speed slider
- Pre-built pattern menu: Glider, LWSS, Pulsar, Pentadecathlon, Gosper Glider Gun, R-pentomino, etc.
- Click on grid to place selected pattern (or toggle single cells)
- Responsive layout with Header + Footer
- Prerendered (all client-side JS, no server needed)

**Implementation:**
- Single page: `src/pages/life.astro` — contains all HTML, CSS, and `<script>` for the simulation
- Add "Life" link to Header nav
- All game logic in a `<script>` tag (vanilla JS, no framework needed)

### Implementation (completed):
- **`src/pages/life.astro`** — Single self-contained page with canvas, controls, and game logic
  - Canvas-based renderer with 8px cells, cream bg, coffee-brown alive cells
  - Controls: Play (&#9654;), Pause (&#9646;&#9646;), Step, Clear — all serif-styled buttons
  - Speed slider (1-30 fps) with gold accent color
  - Pattern dropdown with 8 presets organized in optgroups: Spaceships (Glider, LWSS), Oscillators (Blinker, Pulsar, Pentadecathlon), Methuselahs (R-pentomino, Acorn), Guns (Gosper Glider Gun)
  - Left-click to place pattern (centered on cursor), right-click to erase
  - Toroidal grid (wraps edges), responsive canvas sizing, preserves state on resize
  - All vanilla JS in a `<script>` tag — no framework dependencies
- **`src/components/Header.astro`** — Added "Life" nav link between Blog and About
- **`CLAUDE.md`** — Updated sitemap and component map

### Files created:
- `src/pages/life.astro`

### Files modified:
- `src/components/Header.astro`
- `CLAUDE.md`

## 2026-02-13 - Blog Content from Notion

### Replaced placeholder posts with real content from Notion
- Deleted 5 placeholder blog posts: `first-post.md`, `second-post.md`, `third-post.md`, `markdown-style-guide.md`, `using-mdx.mdx`
- Created 2 new blog posts from Notion pages:
  - **`fmri-differential-geometry.md`** — Computational neuroscience project combining differential geometry with TDA to detect spinor-like rotational structures in fMRI data. Covers the two-pronged pipeline (differential geometry + persistent homology), toolchains (MATLAB/SPM/CAT12, Python/GUDHI/Ripser, AFNI/SUMA), and sub-projects.
  - **`wave-simulation-app.md`** — Native macOS GPU-accelerated 2D wave equation simulator built in Swift/Metal. Covers architecture (SwiftUI + AppCoordinator + Metal pipeline), numerical method (finite-difference Laplacian, leap-frog integration), Metal compute kernels, SimObject system, and 100+ domain shapes.

### Files created:
- `src/content/blog/fmri-differential-geometry.md`
- `src/content/blog/wave-simulation-app.md`

### Files deleted:
- `src/content/blog/first-post.md`
- `src/content/blog/second-post.md`
- `src/content/blog/third-post.md`
- `src/content/blog/markdown-style-guide.md`
- `src/content/blog/using-mdx.mdx`

====================================================================================================
Sitemap:
====================================================================================================

```
UnityDruid
│
├── / .......................... Landing / Splash Page (prerendered)
│   │                          "UnityDruid" centered in Garamond
│   │                          Warm cream background (#f5f0e8)
│   │                          [enter] button → /blog
│   │                          No header/footer (standalone)
│   │
│   └── /blog ................. Blog Listing Page (prerendered)
│       │                      Grid of post cards (image + title + date)
│       │                      Header nav: Home | Blog | About
│       │                      Footer: © UnityDruid
│       │
│       ├── /blog/fmri-differential-geometry  Blog Post (prerendered, Markdown)
│       └── /blog/wave-simulation-app ....... Blog Post (prerendered, Markdown)
│
├── /life ..................... Game of Life (prerendered)
│                              Interactive Conway's simulation
│                              Canvas + controls + pattern library
│                              Header + Footer
│
├── /about .................... About Page (prerendered)
│                              Uses BlogPost layout
│                              Header + Footer
│
├── /login .................... Login Page (SSR)
│                              Username + password form
│                              Redirects to /private on success
│                              Standalone (no header/footer)
│
├── /logout ................... Logout Endpoint (SSR)
│                              Clears session cookie → redirects to /
│
├── /private .................. Private Area (SSR, auth required)
│                              Middleware redirects to /login if not authenticated
│                              Auth banner with username + logout link
│                              Header + Footer
│
└── /rss.xml .................. RSS Feed (prerendered)
                               Auto-generated from blog posts
```

### Component & Layout Map:

```
src/
├── components/
│   ├── BaseHead.astro ........ <head> metadata, imports global.css
│   ├── Header.astro .......... Site nav (Home | Blog | Life | About)
│   ├── Footer.astro .......... © UnityDruid
│   ├── HeaderLink.astro ...... Nav link with active state
│   └── FormattedDate.astro ... Date display helper
│
├── layouts/
│   └── BlogPost.astro ........ Blog post layout (header + hero + prose + footer)
│
├── lib/auth/
│   ├── index.ts .............. Auth API: authenticateUser, loginAndSetCookie, getUserFromSession
│   ├── password.ts ........... PBKDF2 hash + verify (Web Crypto API)
│   ├── session.ts ............ HMAC-SHA256 signed session tokens
│   └── cookies.ts ............ Session cookie helpers (httpOnly, secure, sameSite=lax)
│
├── middleware.ts .............. Route protection: /private/* → requires auth
│
├── pages/
│   ├── index.astro ........... Splash landing page (prerendered, standalone)
│   ├── about.astro ........... About page (prerendered, uses BlogPost layout)
│   ├── life.astro ............ Conway's Game of Life (prerendered, client-side JS)
│   ├── login.astro ........... Login form (SSR)
│   ├── logout.astro .......... Logout endpoint (SSR)
│   ├── blog/
│   │   ├── index.astro ....... Blog listing grid (prerendered)
│   │   └── [...slug].astro ... Dynamic blog post route (prerendered)
│   ├── private/
│   │   └── index.astro ....... Private landing page (SSR, auth required)
│   └── rss.xml.js ............ RSS feed generator (prerendered)
│
├── content/blog/ ............. Blog post source files (MD/MDX)
├── styles/global.css ......... Global theme: serif fonts, cream palette
└── consts.ts ................. SITE_TITLE="UnityDruid", SITE_DESCRIPTION
```
