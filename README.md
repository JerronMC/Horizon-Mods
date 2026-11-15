# Horizon Mods — Fan-made community website

A responsive, multi-page-feeling static website for discovering and sharing projects made for Horizon. Built for GitHub Pages with plain HTML, CSS and JavaScript.

**Made by Jerron. Fan-made and independent.** This is not an official Horizon website or service.

## Included

- Home page with search, quick filters, project cards and a creator call-to-action.
- Discovery page with type filters, category filters, search and sorting.
- Post page with the full project form, live card preview, drag-and-drop uploads and file validation.
- Profile page with a local creator account and each creator's published projects.
- Project detail views and downloads for files uploaded in the current browser.
- Responsive mobile layout, keyboard `/` search shortcut and dark/light theme toggle.
- Reference cards for a few projects visible in the official Horizon registry. These cards link back to the official registry; this demo does not re-host their binaries.

## GitHub Pages deployment

1. Download and unzip this package.
2. Upload **the contents** of this folder to the root of your GitHub repository. `index.html` must be in the repository root.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your branch (usually `main`) and folder `/ (root)`, then save.
6. Open the Pages URL GitHub gives you.

No build command or framework is needed. Keep `index.html`, `styles.css`, `app.js`, `README.md` and the `assets` folder together.

## Important: what publishing does in this version

This ZIP is a **static front-end demo**. It uses IndexedDB in the browser to store local profiles, uploaded project files, icons, screenshots and project metadata. A successful post is marked **PUBLISHED** immediately and appears in Home, Discovery and the creator's Profile **in that same browser on that same device**.

GitHub Pages cannot receive and store arbitrary visitor uploads, create public user accounts, or make a new upload appear for every other visitor by itself. This version therefore does **not** provide shared, global publishing, cross-device accounts or centralized file hosting. Clearing browser site data can remove local posts. Browser storage quotas also vary by device and browser; a 64 MB upload may be refused by some browsers even when it passes the file-size validation.

For a public registry where everyone's uploads are shared, connect a real backend (for example, an authenticated database plus object storage) and enforce authorization, size limits, file validation, abuse controls and access policies on the server. Never put a private service key in `app.js` or any other file deployed to GitHub Pages. See [BACKEND-NOTES.md](BACKEND-NOTES.md).

## Supported upload rules in this demo

| Project kind | Extension | Extra checks |
|---|---|---|
| Mod | `.hmod` | ZIP archive containing `horizon-mod.toml`, `assets/` and `data/` at its root |
| Native mod | `.hnmod` | Extension and 64 MB maximum |
| Modpack | `.hpack` | ZIP archive containing `horizon-modpack.toml` at its root |
| Horizon shader pack | `.hshader` | Extension and 64 MB maximum |
| Compatible shader pack | `.zip` | ZIP archive containing a `shaders/` folder at its root |
| Resource pack | `.zip` | ZIP archive containing `pack.mcmeta` at its root |
| Data pack | `.zip` | ZIP archive containing `pack.mcmeta` and a `data/` folder at its root |

The `.hpack` manifest requirement follows the [Horizon registry and .hpack documentation](https://github.com/horizon-rust/horizon/blob/main/docs/api/mod-index.md). The form also checks project icons (PNG, square, 64–1024 px, up to 256 KiB) and screenshots (PNG/JPEG, 320×180 to 3840×2160, up to 1 MiB each, up to 8). These are client-side checks for convenience, not a security boundary. A production service must repeat validation server-side.

## Safety and trust

Horizon documents that native mods are Rust code and are not sandboxed. Only install native mods from creators you trust; inspect their source before running them. This fan-made site is independent and does not scan, review or certify uploaded projects. The reference cards are examples that point users back to the official Horizon registry.

## Branding and links

The navigation uses the Horizon wordmark as text, the official Horizon launcher icon from the project's public GitHub repository, and standard inline SVG interface icons. The website remains a fan-made, unaffiliated community project. For the official project, use:

- https://playhorizon.dev/
- https://playhorizon.dev/mods
- https://playhorizon.dev/docs/mods

## Files

- `index.html` — page structure and forms
- `styles.css` — responsive visual design
- `app.js` — navigation, local accounts, IndexedDB, validation, publishing and downloads
- The Horizon app icon is loaded from the official `horizon-rust/horizon` GitHub repository.
