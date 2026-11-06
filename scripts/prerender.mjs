// Writes one real HTML file per route (dist/work/index.html, ...) with its own
// <title>, description, canonical, social tags, JSON-LD and readable content,
// plus sitemap.xml and robots.txt. React then takes over in the browser.
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {projects, principles, socials, EMAIL, SITE, NAME, SCHOOL_SHORT, SCHOOL_FULL, violin, violinLessons, violinClose} from '../src/data.ts';
import {routeMeta, jsonLd, KEYWORDS} from '../src/seo.ts';

const dist = new URL('../dist/', import.meta.url);
const tpl = readFileSync(new URL('index.html', dist), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const link = (href, text) => `<a href="${href}">${esc(text)}</a>`;
const nav = `<nav aria-label="Primary">${link('/', 'Home')} ${link('/work', 'Projects')} ${link('/info', 'About')} ${link('/violin', 'Violin')} ${link('/contact', 'Contact')}</nav>`;

const bodies = {
  '/': () => `<h1>${NAME}</h1>
<p>${NAME} is a student at ${SCHOOL_SHORT} in Singapore. He builds robots and software that helps people, plays the violin, and cares about care, detail and restraint.</p>
<h2>What I care about</h2><ul>${principles.map((p) => `<li><strong>${esc(p.t)}.</strong> ${esc(p.d)}</li>`).join('')}</ul>
<h2>${esc(violin.label)}</h2><p>${esc(violin.line)} ${esc(violin.body)}</p>
<h2>Projects</h2><ul>${projects.map((p) => `<li>${link(`/work/${p.slug}`, p.title)}: ${esc(p.kicker)} (${p.year})</li>`).join('')}</ul>`,
  '/work': () => `<h1>Projects by ${NAME}</h1><ul>${projects.map((p) => `<li>${link(`/work/${p.slug}`, p.title)}: ${esc(p.kicker)}. ${esc(p.body)}</li>`).join('')}</ul>`,
  '/info': () => `<h1>About ${NAME}</h1>
<p>${NAME} is a student builder and creative developer from Singapore, studying at ${SCHOOL_SHORT}. He builds software, hardware and everything in between, and cares about design, detail and technology that is genuinely useful.</p>
<p>${esc(violin.body)}</p>
`,
  '/violin': () => `<h1>Violin</h1><p>${esc(violin.line)}</p><p>${esc(violin.body)}</p><ul>${violinLessons.map(([a, b]) => `<li><strong>${esc(a)}.</strong> ${esc(b)}</li>`).join('')}</ul><p>${esc(violinClose)}</p>`,
  '/contact': () => `<h1>Contact ${NAME}</h1><p>Based in Singapore. Email <a href="mailto:${EMAIL}">${EMAIL}</a>.</p><ul>${socials.map((s) => `<li>${link(s.href, s.label)}</li>`).join('')}</ul>`,
};
for (const p of projects) bodies[`/work/${p.slug}`] = () => `<h1>${esc(p.title)}</h1><p>${esc(p.kicker)} (${p.year}, ${p.cat})</p><p>${esc(p.body)}</p><p>${esc(p.detail)}</p><p>Built with ${esc(p.stack.join(', '))}.</p>${p.links.length ? `<ul>${p.links.map((l) => `<li>${link(l.href, l.label)}</li>`).join('')}</ul>` : ''}<p>${link('/work', 'All projects')}</p>`;

const paths = Object.keys(bodies);
for (const path of paths) {
  const m = routeMeta(path);
  const url = `${SITE}${m.path === '/' ? '/' : m.path}`;
  let html = tpl
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(m.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(m.description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(m.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(m.description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(m.title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(m.description)}$2`)
    .replace(/<!--JSONLD-->/, jsonLd(path).map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n    '))
    .replace('<div id="root"></div>', `<div id="root"><main class="prerender">${nav}${bodies[path]()}</main></div>`);
  if (path === '/') writeFileSync(new URL('index.html', dist), html);
  else { mkdirSync(new URL(`.${path}/`, dist), {recursive: true}); writeFileSync(new URL(`.${path}/index.html`, dist), html); }
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(new URL('sitemap.xml', dist), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${p === '/' ? '1.0' : p.split('/').length > 2 ? '0.6' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(new URL('robots.txt', dist), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`prerendered ${paths.length} pages + sitemap.xml + robots.txt`);
