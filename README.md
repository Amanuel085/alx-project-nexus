# Pollify

Pollify is a modern, full‑stack polling application built on Next.js App Router. It lets users create polls, vote, and view results. Admins can manage polls, users, and contact messages. The design follows a clean HSL theme with Tailwind CSS.

## Tech Stack
- Next.js 16 (App Router)
- TypeScript, React 19
- Tailwind CSS v4
- MySQL (`mysql2/promise`)
- JWT auth with `jose` and HttpOnly cookies
- Email via SMTP (`nodemailer`)
- Redux Toolkit for client state

## Key Features
- User signup with email verification
- Admin login and role‑based routes
- Create, list, and vote on polls
- Public polls listing (visible to anonymous users)
- Admin management: polls, users, contact messages
- Secure session via HttpOnly cookie

## Recent Updates
- Fixed poll detail errors with strict id validation and robust fallbacks
- Implemented owner‑only actions for edit/delete/close/share/analytics
- Added Share page QR code generation for each poll
- Made Settings functional: password change via email verification, account deletion via email confirmation, preferences save/load
- Implemented per‑user Dark Mode with a toggle in Settings and global application across pages
- Admin Categories page: create/delete categories reflected in Create Poll form
- Voting improvements: strict id checks, option validation, one‑vote enforcement
- Analytics: added endpoints and UI that summarize votes, options, and recent responses
- Added Back buttons and UX polish across screens

## Repository Structure
- `app/` – Next.js App Router pages and API route handlers
  - `app/page.tsx` – Homepage (Hero with calls to action)
  - `app/about/page.tsx` – About Pollify
  - `app/contact/page.tsx` – Contact form
  - `app/polls/` – Polls, detail, analytics, vote
  - `app/admin/` – Admin dashboard and sections
  - `app/api/` – Backend endpoints (auth, polls, categories, admin, contact)
- `components/` – Reusable UI (Navbar, Poll components)
- `sections/` – Landing sections (Hero, Footer)
- `lib/` – DB client, auth helpers, Redux store and slices
- `styles/` – Global styles and Tailwind theme tokens

## Environment Variables
Create `.env.local` at repo root:
```
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/pollify
AUTH_SECRET=<random-long-string>

MAIL_FROM=Pollify <no-reply@yourdomain.com>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASS=<gmail-app-password>

# Dev-only admin seed (optional)
ADMIN_EMAIL=admin@pollify.local
ADMIN_PASSWORD=Admin123!
```

## Database Schema

Recommended tables:

```
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','user') NOT NULL DEFAULT 'user',
  is_email_verified TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE polls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  description TEXT NULL,
  category_id INT NULL,
  created_by INT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  total_votes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE poll_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  poll_id INT NOT NULL,
  text VARCHAR(255) NOT NULL,
  votes_count INT NOT NULL DEFAULT 0,
  FOREIGN KEY (poll_id) REFERENCES polls(id)
);

CREATE TABLE votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  poll_id INT NOT NULL,
  option_id INT NOT NULL,
  user_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (poll_id) REFERENCES polls(id),
  FOREIGN KEY (option_id) REFERENCES poll_options(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE email_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new','reviewed','closed') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Backend Endpoints

- Auth
  - `POST /api/auth/signup` – creates user, stores verification token, sends email
  - `GET /api/auth/verify?token=...` – verifies and redirects to `/login`
  - `POST /api/auth/login` – sets `pollify_token` cookie and returns user info
  - `POST /api/auth/logout` – clears cookie
  - `GET /api/me` – returns current user payload or `null`

- Polls
  - `GET /api/polls` – list active polls (public)
  - `POST /api/polls` – create poll (authenticated)
  - `GET /api/polls/:id` – poll detail with options
  - `PATCH /api/polls/:id` – update question/description (owner)
  - `DELETE /api/polls/:id` – delete poll (owner or admin)
  - `POST /api/polls/:id/vote` – vote on an option; prevents double voting
  - `POST /api/polls/vote?id=...` – vote fallback using query param
  - `GET /api/polls/:id/analytics` – analytics for a poll
  - `GET /api/polls/analytics?id=...` – analytics fallback using query param

- Categories
  - `GET /api/categories` – list categories
  - `POST /api/categories` – create category (admin)

- Admin
  - `GET /api/admin/polls` – list all polls with creator
  - `PATCH /api/admin/polls/:id/status` – activate/deactivate poll
  - `GET /api/admin/users` – list users
  - `PATCH /api/admin/users/:id/status` – activate/deactivate user
  - `GET /api/admin/stats` – aggregate metrics

- Contact
  - `POST /api/contact` – submit contact message
  - `GET /api/contact` – list messages (admin)

## Authentication
- On login, server sets `pollify_token` (HttpOnly, SameSite=Lax) via `NextResponse.cookies.set`.
- Middleware protects `/admin/**` by verifying JWT role.
- Users must verify email before login (admins bypass email verification for dev seeding).
- Deactivated users cannot login and receive an error message.

## Frontend
- Global layout uses `Navbar` and `Footer` shared across pages.
- Hero links: `Create Poll` → `/create` (redirects to `/login` if anonymous, `/polls` if authenticated), `Browse Polls` → `/polls`.
- Polls page uses Redux Toolkit thunks to fetch, create, and vote.
- Admin pages:
  - `/admin/polls` – activate/deactivate/delete polls
  - `/admin/users` – activate/deactivate users; link to Contact Messages
  - `/admin/contacts` – view contact submissions

## Development
- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Lint: `npm run lint`

## Deploying to Vercel
1. Ensure `.env.local` is complete with DB and SMTP credentials
2. Push repository to GitHub/GitLab/Bitbucket
3. Create a Vercel account and import the project
4. Configure Environment Variables in Vercel Dashboard
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `MAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
5. Set Build & Output
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Set Vercel Project Settings
   - Enable Serverless Functions
   - Set Node version matching local (via `.nvmrc` or Vercel settings)
7. Provision MySQL (if not already)
   - Use a managed MySQL provider (PlanetScale, Neon MySQL, etc.)
   - Update `DATABASE_URL` to the managed instance
8. Run initial deploy
9. Post‑deploy checks
   - Verify `/api/auth/signup` and email delivery
   - Test poll creation, voting, analytics
   - Confirm Dark Mode toggles per user after login
10. Set custom domain (optional)
   - Add domain in Vercel, update DNS to Vercel nameservers

## Help Center
- A new Help Center is available at `/help` covering creation, voting, managing polls, and themes.

## Notes
- Email sending uses SMTP envs; for Gmail, generate an App Password.
- Ensure DB schema includes `users.is_active` and `polls.is_active` to support deactivation.
- Avoid storing secrets in the repo; use `.env.local`.
