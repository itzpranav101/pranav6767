# Pranav Ramanathan, portfolio

Source for [pranavr.me](https://pranavr.me). Vite + React, GSAP and Lenis for motion.

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
This runs `vite build` and then `scripts/prerender.mjs`, which writes a real HTML page for every route
(`/`, `/work`, `/work/<project>`, `/info`, `/violin`, `/contact`) with its own title, description, canonical
link, social tags and structured data, plus `sitemap.xml` and `robots.txt`. Output goes to `dist/`.

## Deploy (Cloudflare Workers)
`wrangler.jsonc` serves `dist/` as static assets.
- Connected to GitHub in Cloudflare: build command `npm run build`, output directory `dist`.
- Or from your machine: `npm run deploy` (after `npx wrangler login`).

## Credits
Hero footage: "A statue being smashed" by Wesley Ford, via Pexels (Pexels licence), graded and cut into frames.
