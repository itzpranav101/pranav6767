import {useEffect, useRef, useState, type ReactNode} from 'react';
import gsap from 'gsap';
import Gradient from './Gradient';
import {Cursor, Preloader} from './fx';
import {Link, Roll, initScroll, nav, reduced, smooth, usePageMotion} from './motion';
import {EMAIL, SCHOOL_SHORT, projects, socials} from './data';
import {routeMeta} from './seo';
import Home from './pages/Home';
import Work from './pages/Work';
import ProjectPage from './pages/ProjectPage';
import Info from './pages/Info';
import Contact from './pages/Contact';
import Violin from './pages/Violin';

const pathNow = () => location.pathname.replace(/\/+$/, '') || '/';

function useRoute() {
  const [r, setR] = useState(pathNow);
  useEffect(() => {
    const f = () => setR(pathNow());
    addEventListener('popstate', f);
    return () => removeEventListener('popstate', f);
  }, []);
  return r;
}

const labelFor = (to: string) => {
  const s = to.split('/').filter(Boolean);
  if (!s.length) return 'Home';
  if (s[0] === 'work' && s[1]) return projects.find((p) => p.slug === s[1])?.title ?? 'Project';
  return ({work: 'Projects', info: 'About', violin: 'Violin', contact: 'Contact'} as Record<string, string>)[s[0]] ?? 'Pranav';
};

function setMeta(sel: string, attr: string, value: string) {
  document.querySelector(sel)?.setAttribute(attr, value);
}

function Footer() {
  return (
    <footer className="footer">
      <div className="f-top">
        <div className="f-col"><a href={`mailto:${EMAIL}`} aria-label={EMAIL}><Roll>{EMAIL}</Roll></a><p>© 2026 · Singapore</p></div>
        <ul className="f-col">{socials.map((s) => <li key={s.href}><a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}><Roll>{s.label}</Roll></a></li>)}</ul>
        <ul className="f-col">
          <li><Link to="/work" aria-label="Projects"><Roll>Projects</Roll></Link></li>
          <li><Link to="/info" aria-label="About"><Roll>About</Roll></Link></li>
          <li><Link to="/violin" aria-label="Violin"><Roll>Violin</Roll></Link></li>
          <li><Link to="/contact" aria-label="Contact"><Roll>Contact</Roll></Link></li>
        </ul>
      </div>
      <div className="f-dots" aria-hidden="true" />
      <p className="f-name" aria-label="Pranav Ramanathan"><span>Pranav</span> <em>Ramanathan<b>.</b></em></p>
    </footer>
  );
}

const NAV: [string, string][] = [['/work', 'Projects'], ['/info', 'About'], ['/violin', 'Violin'], ['/contact', 'Contact']];

export default function App() {
  const route = useRoute();
  const [intro, setIntro] = useState(!reduced);
  const [ready, setReady] = useState(reduced);
  const [past, setPast] = useState(false);
  const [solid, setSolid] = useState(false);
  const curtain = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const seg = route.split('/').filter(Boolean);
  const top = seg[0] ?? '';

  useEffect(() => initScroll(), []);
  useEffect(() => { document.documentElement.classList.add('js'); }, []);

  useEffect(() => {
    nav.go = (to: string) => {
      if (busy.current || pathNow() === to) return;
      const c = curtain.current;
      const swap = () => { history.pushState({}, '', to); dispatchEvent(new PopStateEvent('popstate')); };
      if (reduced || !c) { swap(); return; }
      busy.current = true;
      const l = c.firstElementChild as HTMLElement;
      l.textContent = labelFor(to);
      gsap.timeline()
        .set(c, {pointerEvents: 'all'})
        .fromTo(c, {clipPath: 'inset(100% 0% 0% 0%)'}, {clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut'})
        .fromTo(l, {yPercent: 110, opacity: 0}, {yPercent: 0, opacity: 1, duration: 0.8, ease: 'expo.out'}, '-=0.45')
        .add(() => { setReady(false); swap(); smooth.lenis?.scrollTo(0, {immediate: true}); scrollTo(0, 0); }, '+=0.05')
        .to(l, {yPercent: -110, opacity: 0, duration: 0.55, ease: 'expo.in'}, '+=0.3')
        .to(c, {clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut'}, '-=0.3')
        .add(() => setReady(true), '-=0.6')
        .set(c, {pointerEvents: 'none'})
        .add(() => { busy.current = false; });
    };
  }, []);

  /* per-route title, description, canonical and social tags (same text the static HTML was built with) */
  useEffect(() => {
    smooth.lenis?.scrollTo(0, {immediate: true});
    scrollTo(0, 0);
    const m = routeMeta(route);
    document.title = m.title;
    setMeta('meta[name="description"]', 'content', m.description);
    setMeta('link[rel="canonical"]', 'href', `https://pranavr.me${m.path === '/' ? '/' : m.path}`);
    setMeta('meta[property="og:title"]', 'content', m.title);
    setMeta('meta[property="og:description"]', 'content', m.description);
    setMeta('meta[property="og:url"]', 'content', `https://pranavr.me${m.path === '/' ? '/' : m.path}`);
    setMeta('meta[name="twitter:title"]', 'content', m.title);
    setMeta('meta[name="twitter:description"]', 'content', m.description);
  }, [route]);

  useEffect(() => {
    const f = () => setPast(scrollY > innerHeight * 2.4);
    f();
    addEventListener('scroll', f, {passive: true});
    return () => removeEventListener('scroll', f);
  }, []);

  useEffect(() => {
    const f = () => setSolid(scrollY > 40);
    f();
    addEventListener('scroll', f, {passive: true});
    return () => removeEventListener('scroll', f);
  }, []);
  usePageMotion(route, ready);

  const variant = top === 'info' ? 1 : top === 'contact' ? 2 : top === 'work' ? 1 : 0;
  const dim = top === '' ? (past ? 0.45 : 1) : top === 'work' ? 0.55 : 0.8;

  let page: ReactNode;
  if (top === '') page = <Home ready={ready} />;
  else if (top === 'work') page = seg[1] ? <ProjectPage slug={seg[1]} /> : <Work />;
  else if (top === 'info') page = <Info />;
  else if (top === 'violin') page = <Violin />;
  else if (top === 'contact') page = <Contact />;
  else page = <section className="page"><h1 className="ptitle2">Not found</h1><Link to="/" className="back">BACK</Link></section>;

  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
      <Gradient variant={variant} dim={dim} />
      <div className="vignette" aria-hidden="true" />
      <Cursor />
      {intro && <Preloader onReveal={() => setReady(true)} onDone={() => setIntro(false)} />}
      <div ref={curtain} className="curtain" aria-hidden="true"><span /></div>

      <header className={`site-nav ${solid ? 'solid' : ''} ${top === '' ? 'on-home' : ''}`}>
        <Link to="/" className="sn-logo" aria-label="Pranav Ramanathan, home">pranav<i>.</i></Link>
        <nav aria-label="Primary">
          <ul>
            {NAV.map(([to, l]) => (
              <li key={to}><Link to={to} aria-label={l} aria-current={top === to.slice(1) ? 'page' : undefined} className={top === to.slice(1) ? 'cur' : ''}><Roll>{l}</Roll></Link></li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main" tabIndex={-1} key={route} className="view">{page}</main>
      {top === '' && <Footer />}
    </>
  );
}
