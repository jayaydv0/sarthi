<<<<<<< HEAD
## Learned User Preferences

- Prefer minimal, functional MVP code: avoid overengineering, unnecessary abstractions, and extra files unless something is required to run (for example a small `package.json` for ESM and dependencies).
- Expect polished UI: correct layout and stacking (for example fixed headers must not sit above sidebars and steal clicks), readable typography, sensible overflow and hit targets, and motion that respects reduced-motion preferences.
- Use **lucide-react** for icons across the **website** app; static HTML under **`website/designs/`** may still reference other icon stacks.
- When implementing designs, provide explicit App Router routes when requested (for example **`/landing`**), not only behavior on **`/`**.

## Learned Workspace Facts

- The workspace includes **`website/`** (Next.js App Router, Supabase auth with email and Google OAuth via **`/auth/callback`**, Tailwind; **Prisma** connects to Supabase Postgres via **`DATABASE_URL`** and server queries should scope by **`userId`** because Prisma does not apply **RLS**) and **`sync-engine/`** (Node ESM, chokidar; loads **`projects`** for **`SYNC_USER_ID`**; batches filesystem updates into **`changes`** and **`project_files`** and can upload to the **`project-files`** Storage bucket using **`SUPABASE_SERVICE_ROLE_KEY`**; flat module layout).
- UI/design references live under **`website/designs`** (including **`website/designs/designs/landing_page`**); mocks use ArchitectOS-style branding while the product name may differ.
- **`/`** shows the landing experience for logged-out users and redirects signed-in users to the dashboard; **`/landing`** always serves the same **`LandingPage`** component.
- Supabase **`projects`** uses fields such as **`notes`** (and related schema from **`website/supabase-schema.sql`**); create-project flows may map description into **`notes`**.
- **`website/.gitignore`** should use **`!.env.example`** alongside **`.env*`** so **`website/.env.example`** can be committed.
- For Supabase setup aligned with the repo, run **`website/supabase-schema.sql`** then **`website/supabase-storage.sql`**; set **sync-engine** **`SYNC_USER_ID`** to your real **Supabase Auth** user UUID (replace the **`.env.example`** placeholder) so projects and Storage object prefixes match the account you use in the app.
=======
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
>>>>>>> 115eb85c3a9d5c6ddf19947c4f67d1eeecc91918
