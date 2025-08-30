# Easy LMS Frontend

Next.js 15 App Router frontend for Easy LMS.

## Stack
- Next.js (App Router) + React Server & Client Components
- Authentication: Better Auth React client (`lib/auth.jsx`)
- UI: Tailwind CSS + custom component library (`components/ui`)
- Rich Text: TipTap (see [`components/Editor/RichTextEditor`](components/Editor))
- Data Fetching: native `fetch` to backend (`NEXT_PUBLIC_API_URL`)
- State: Local component state + hooks (`hooks/`)
- Uploads: S3-compatible storage (FileUploader components)
- Notifications: `sonner`
- Icons: `lucide-react` + `@tabler/icons-react`

## Key Directories
```
app/
  (site)/        # Public marketing & catalog pages
  (auth)/        # /login /signup /verify-email
  dashboard/     # Authenticated learner experience
  admin/         # Admin dashboard (analytics, users, courses)
components/
  dashboard/     # Sidebar, navigation UI
  uploader/      # FileUploader abstraction
  ui/            # Shared primitives (Card, Button, etc.)
lib/
  auth.jsx       # Better Auth client config
  zodSchemas.jsx # Course validation schema
hooks/
  use-course-progress.js
```

## Authentication Integration
Better Auth client: [`lib/auth.jsx`](lib/auth.jsx)
```js
export const authClient = createAuthClient({
  baseURL: "https://easy-lms-backend.onrender.com/",
  plugins: [emailOTPClient(), adminClient()],
});
```
Used patterns:
- Session hook: `authClient.useSession()`
- Password signup: `authClient.signUp.email({ email, password, name })`
- Password login: `authClient.signIn.password({ email, password })`
- Google OAuth: `authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })`
- Email OTP: `authClient.emailOtp.sendVerificationOtp(...)`
- Admin user management: `authClient.admin.listUsers()` etc.
- Profile update (assumed): `authClient.user.update({ name, image })`

## Pages / Flows
| Area | File | Notes |
|------|------|-------|
| Signup | [`app/(auth)/signup/page.jsx`](app/(auth)/signup/page.jsx) | Email/password & Google; redirects if session |
| Login | [`app/(auth)/login/page.jsx`](app/(auth)/login/page.jsx) | Google, password, email OTP |
| Profile | [`app/dashboard/profile/page.jsx`](app/dashboard/profile/page.jsx) | Update name + avatar |
| Courses (public) | [`app/(site)/courses/page.jsx`](app/(site)/courses/page.jsx) | Searchable listing |
| Course detail (public) | [`app/(site)/courses/[slug]/page.jsx`](app/(site)/courses/[slug]/page.jsx) | Enrollment CTA |
| Dashboard home | [`app/dashboard/page.jsx`](app/dashboard/page.jsx) | Enrollments + progress |
| Enrolled course + lessons | `app/dashboard/[slug]/*` | Lesson navigation + progress |
| Admin Users | [`app/admin/users/page.jsx`](app/admin/users/page.jsx) | Role / ban / create |
| Admin Analytics | [`app/admin/analytics/page.jsx`](app/admin/analytics/page.jsx) | Stats panels |
| Admin Course Builder | [`app/admin/courses/create/page.jsx`](app/admin/courses/create/page.jsx) | Zod validation |

## Environment Variables
Current `.env` (see [`frontend/.env`](.env)):
```
NEXT_PUBLIC_API_URL=
CLIENT_URL=http://localhost:3000
AWS_ENDPOINT_URL_S3=https://t3.storage.dev
NEXT_PUBLIC_S3_URL=https://<bucket name>.t3.storage.dev
```
Add (if needed):
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
```
Notes:
- Any `NEXT_PUBLIC_` var is exposed to the browser.
- Fix spacing: `ARCJET_ENV = development` → `ARCJET_ENV=development`.

## Data Fetching Strategy
Server components (e.g. home page) fetch courses:
```js
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product?limit=6`)
```
If ISR needed, export `revalidate` constant in the page file.

Client components under `/dashboard` use `credentials: "include"` to forward session cookies for enrollment/progress endpoints.

## Validation
Course creation uses Zod schema: [`lib/zodSchemas.jsx`](lib/zodSchemas.jsx)

## Styling / UI
- Tailwind + custom tokens defined in [`app/globals.css`](app/globals.css)
- Shared components (`components/ui/`) implement design primitives (`Card`, `Button`, `Sidebar`, etc.)

## File Uploads
`FileUploader` stores `fileKey` referencing S3 object:
- Course thumbnails: `fileKey`
- Lessons: (thumbnailKey, videoKey)
- Avatar updates in profile use a generated object key; final URL assembled like:
  ```
  https://<Bucket name>.t3.storage.dev/<key>
  ```

## Progress Model (Frontend Mapping)
Dashboard expects user progress API to return:
```json
{
  "enrollment": { "course": { "title": "...", "fileKey": "..." }, "status": "active" },
  "progress": {
    "completionPercentage": 42,
    "completedLessons": 5,
    "totalLessons": 12,
    "lastActivity": "2025-08-30T12:00:00Z"
  }
}
```

## Running Locally
```bash
pnpm install
pnpm dev
# Open http://localhost:3000
```

## Build
```bash
pnpm build
pnpm start  # (Next.js standalone if configured) or deploy to Vercel
```

## Deployment (Vercel)
- Ensure `NEXT_PUBLIC_API_URL` points to deployed backend
- Set auth/social secrets in Vercel project settings
- Consider setting `revalidate` for static marketing pages to avoid dynamic warnings

## Admin Notes
Admin UI consumes Better Auth admin plugin directly (no custom backend endpoints for users). Ensure the authenticated admin user has `role: "admin"` (granted via `admin.setRole`).

## Common Issues
| Symptom | Cause | Fix |
|---------|-------|-----|
| Dynamic server usage build warning | `fetch` with `no-store` on a path you tried to prerender | Add `export const dynamic="force-dynamic"` or `export const revalidate = <seconds>` |
| 401 on protected pages | Missing cookies (different domain / CORS) | Set `CORS_ORIGIN` to exact frontend origin; ensure `credentials: "include"` |
| Avatar not updating | Missing `authClient.user.update` implementation | Verify backend exposes update route or adjust code to match actual endpoint |

## Suggested Enhancements
- Add optimistic UI for profile updates
- Persist course search params with URL state
- Implement skeleton states uniformly (extract to component)
- Add `loading.js`
