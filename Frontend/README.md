# Online Learning Portal — Frontend

React 19 + Vite 7 + Tailwind CSS v4 single-page application for the Online Learning Platform.

## Tech Stack

- **React 19** — UI library with concurrent features
- **Vite 7** — Build tool & dev server
- **Tailwind CSS v4** — Utility-first styling via `@theme` (CSS-first config)
- **react-router-dom v7** — Client-side routing
- **react-i18next** — Internationalization (en, hi, mr)
- **lucide-react** — Icon library
- **sonner** — Toast notifications
- **react-hook-form** — Form validation
- **react-pdf / pdfjs-dist** — PDF rendering
- **shadcn/ui pattern** — Accessible components (`src/components/ui/button.jsx`, etc.)

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Base reusable components (Button, etc.)
│   ├── Auth/               # Login/Signup/AdminLogin
│   ├── Teacher/            # Teacher dashboard, test/material management
│   ├── Leraners/           # Learner dashboard, courses, tests, progress
│   ├── Parents/            # Parent dashboard
│   ├── Admin/              # Admin dashboard
│   ├── Results/            # Results page sections (achievers, charts, stats)
│   ├── Courses/            # Course catalog & foundation programs
│   ├── Contact/            # Contact page sections
│   ├── SiteChrome.jsx      # Navbar (SiteNav) + Footer (SiteFooter)
│   ├── Home.jsx            # Landing page
│   ├── AboutPage.jsx
│   └── LanguageSwitcher.jsx
├── hooks/
│   └── useTranslatedName.js
├── i18n/
│   ├── index.js            # i18n initialization
│   └── locales/            # en.json, hi.json, mr.json
├── mockData/               # Static data for courses, results
├── styles/
│   └── sidebar-animations.css
├── App.jsx                 # Routes + providers
├── main.jsx                # Entry point
└── index.css               # Tailwind v4 @theme + global styles
```

## Key Features

- **Responsive Navbar**: Fixed header with slide-out right drawer on mobile (translate-x transition)
- **Hover Animations**: Nav links use `.link-hover` (sliding underline)
- **Login Button**: `ButtonWithIcon` (shadcn Button + animated icon) in header & drawer
- **Internationalization**: LanguageSwitcher in header & drawer; translations via `t()`
- **Route Structure**:
  - `/` — Home (landing)
  - `/about` — About
  - `/login`, `/signup` — Auth
  - `/learners/*` — Learner portal
  - `/teachers/*` — Teacher portal
  - `/parents/*` — Parent portal
  - `/admin/*` — Admin portal
  - `/results`, `/courses`, `/contact` — Public pages

## Development

```bash
cd Frontend
bun install        # or npm install
bun run dev        # or npm run dev  → http://localhost:5173
```

### Build
```bash
bun run build      # outputs to dist/
```

### Lint
```bash
bun run lint
```

## Configuration

- **Path alias**: `@/*` → `./src/*` (configured in `vite.config.js` + `jsconfig.json`)
- **Tailwind theme**: Defined in `src/index.css` under `@theme` — colors, spacing, fonts, radii
- **Fonts**: Inter (body/UI), Slabo 27px (display/headings via `font-display` utility)
- **i18n**: Namespaces in `src/i18n/locales/*.json`; initialized in `src/i18n/index.js`

## Adding UI Components (shadcn pattern)

1. Create component in `src/components/ui/` (e.g., `button.jsx`)
2. Use `cn()` from `@/lib/utils` for class merging
3. Export for use across the app

## Environment Variables

Create `.env` (optional):
```env
VITE_API_URL=http://localhost:3000/api
```

## Docker

```bash
# From repo root
docker-compose up -d
```

## License

MIT