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
