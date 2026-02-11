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

====================================================================================================
Sitemap:
====================================================================================================

```
UnityDruid
│
├── / .......................... Landing / Splash Page
│   │                          "UnityDruid" centered in Garamond
│   │                          Warm cream background (#f5f0e8)
│   │                          [enter] button → /blog
│   │                          No header/footer (standalone)
│   │
│   └── /blog ................. Blog Listing Page
│       │                      Grid of post cards (image + title + date)
│       │                      Header nav: Home | Blog | About
│       │                      Footer: © UnityDruid
│       │
│       ├── /blog/first-post .. Blog Post (Markdown)
│       ├── /blog/second-post . Blog Post (Markdown)
│       ├── /blog/third-post .. Blog Post (Markdown)
│       ├── /blog/markdown-style-guide  Blog Post (Markdown)
│       └── /blog/using-mdx .. Blog Post (MDX)
│
├── /about .................... About Page
│                              Uses BlogPost layout
│                              Header + Footer
│
└── /rss.xml .................. RSS Feed
                               Auto-generated from blog posts
```

### Component & Layout Map:

```
src/
├── components/
│   ├── BaseHead.astro ........ <head> metadata, imports global.css
│   ├── Header.astro .......... Site nav (Home | Blog | About)
│   ├── Footer.astro .......... © UnityDruid
│   ├── HeaderLink.astro ...... Nav link with active state
│   └── FormattedDate.astro ... Date display helper
│
├── layouts/
│   └── BlogPost.astro ........ Blog post layout (header + hero + prose + footer)
│
├── pages/
│   ├── index.astro ........... Splash landing page (standalone)
│   ├── about.astro ........... About page (uses BlogPost layout)
│   ├── blog/
│   │   ├── index.astro ....... Blog listing grid
│   │   └── [...slug].astro ... Dynamic blog post route
│   └── rss.xml.js ............ RSS feed generator
│
├── content/blog/ ............. Blog post source files (MD/MDX)
├── styles/global.css ......... Global theme: serif fonts, cream palette
└── consts.ts ................. SITE_TITLE="UnityDruid", SITE_DESCRIPTION
```
