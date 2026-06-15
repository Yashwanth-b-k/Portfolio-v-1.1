# Yashwanth Gowda B K — Developer Portfolio

A production-ready personal portfolio for a **backend-focused Full Stack Developer** specializing in ASP.NET Core, PostgreSQL, MongoDB, CQRS architecture, production support, and scalable enterprise applications.

Built with an Apple-inspired design system: clean, premium, minimal, and fully responsive with seamless dark/light mode.

## Tech Stack

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** (custom Apple-inspired theme + dark mode)
- **Framer Motion** (page transitions, reveal animations, micro-interactions)
- **React Router** (SPA routing)
- **Lucide Icons** + **React Icons**

## Features

- Full-viewport hero with resume download, GitHub, LinkedIn, and contact actions
- About, Experience (expandable timeline), Skills, Projects, Education, Contact sections
- Seamless dark/light theme toggle, persisted in `localStorage`
- Scroll progress indicator, active-section nav highlighting, responsive mobile menu
- Section reveal animations and loading screen
- Validated contact form (opens the visitor's mail client)
- SEO: dynamic title, meta description, Open Graph, Twitter cards, JSON-LD structured data, sitemap & robots
- Accessibility: semantic HTML, ARIA labels, keyboard navigation, focus states, skip-to-content link, WCAG AA contrast
- Performance: route/section code splitting, lazy loading, manual chunking, tree shaking

## Project Structure

```
src/
├── components/      # Navbar, Footer, ThemeToggle, ScrollProgress, Loader, ui/
├── pages/           # Home, NotFound
├── sections/        # Hero, About, Experience, Skills, Projects, Education, Contact
├── hooks/           # useTheme, useScrollProgress, useActiveSection
├── data/            # resume.ts (single source of content)
├── assets/
├── utils/           # helpers + motion variants
├── types/           # shared TypeScript types
└── App.tsx
```

All site content lives in `src/data/resume.ts` — edit that one file to update copy.

## Getting Started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # type-check + production build to /dist
npm run preview  # preview the production build locally
```

## Updating the Resume PDF

The downloadable resume is served from `public/Yashwanth_Gowda_Resume.pdf`. Replace that file to update the download (keep the filename, or update `profile.resume` in `src/data/resume.ts`).

## Deployment

### Vercel
1. Push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Vite**. Build: `npm run build`. Output: `dist`.
3. SPA routing is handled by the included `vercel.json`. Deploy.

### Netlify
1. Import the repo at [app.netlify.com](https://app.netlify.com).
2. Build command `npm run build`, publish directory `dist` (already set in `netlify.toml`).
3. `public/_redirects` handles SPA routing. Deploy.

### GitHub Pages
1. Set `base: "/<repo-name>/"` in `vite.config.ts` if not deploying to a root/custom domain.
2. Install is already configured:
   ```bash
   npm run deploy:gh
   ```
   This builds and publishes `/dist` to the `gh-pages` branch via the `gh-pages` package.
3. In repo Settings → Pages, set the source to the `gh-pages` branch.

## License

© Yashwanth Gowda B K. Personal portfolio — all rights reserved.

Built with React + Vite.
