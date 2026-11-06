# Pranav Ramanathan Portfolio

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy to Cloudflare Workers
```bash
npm run deploy
```

The Wrangler configuration publishes the Vite build output in `dist/` as static assets and enables SPA fallback for client-side routes.

For GitHub + Cloudflare: upload the contents of this folder to the repository root, then connect the repository in Cloudflare Workers & Pages. Set the build command to `npm run build` and the build output directory to `dist`. If using the Wrangler deploy workflow instead, run `npm run deploy` after authenticating Wrangler.
