# Backend upgrade notes (for shared, public publishing)

The included website is deliberately self-contained and local-first. A static GitHub Pages site cannot securely publish visitor uploads to a shared registry on its own.

To make posts visible to everyone, add a backend service with these responsibilities:

1. **Authentication** — real user registration, email verification, sessions, password reset and account recovery.
2. **Metadata database** — project rows with a unique project ID, owner ID, type, version, Minecraft version, licence, summary, description, changelog, tags, categories, source link and publish timestamp.
3. **Private upload endpoint / object storage** — store project files, icons and screenshots. Enforce the 64 MB project limit, icon/screenshot limits and MIME / file-structure checks on the server.
4. **Authorization** — only the signed-in owner can publish, edit or remove their project. Do not trust an `owner` field sent by the browser; derive it from the authenticated session.
5. **Abuse and safety controls** — rate limits, duplicate detection, file scanning, reporting, takedown process, source-link checks, audit logs and backups.
6. **Public listing API** — Home and Discovery fetch only published/approved metadata and signed or public download URLs from the backend.

A managed database + object-storage service (for example Supabase, Firebase or a small API you control) can provide the building blocks. Configure it outside the public repository. Any browser-side key must be explicitly designed for public use and protected by strict server-side policies; never ship a service-role, admin or storage-secret key in GitHub Pages files.

## Suggested data model

`projects`: `id`, `owner_id`, `project_id`, `name`, `kind`, `version`, `minecraft_version`, `license`, `summary`, `description`, `changelog`, `categories`, `tags`, `authors`, `source_url`, `file_path`, `file_name`, `file_size`, `icon_path`, `screenshot_paths`, `status`, `published_at`.

`users`: managed by the identity provider, not by a custom browser password table.

## Publishing sequence

1. The browser authenticates the creator.
2. The backend verifies the session and validates all required fields.
3. Upload the project binary and images to object storage under an owner-scoped path.
4. The backend validates file content and ZIP structure (not just file extensions).
5. The backend inserts a published project row in a database transaction.
6. Home and Discovery read the new published row; the detail page exposes its download URL.

The project form and client-side checks in `app.js` are useful UI components, but they are not a substitute for these server-side controls.
