import {useEffect, useLayoutEffect, useRef, useState, type MouseEvent} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Link, Roll, Split, nav, reduced, smooth} from '../motion';
import {B, EMAIL, SCHOOL_SHORT, projects, socials} from '../data';
import Thumb, {Title} from '../Thumb';
import StatueSeq from '../StatueSeq';

function Arrow({className}: {className?: string}) {
  return <svg className={className} viewBox="0 0 84 85" fill="currentColor" aria-hidden="true"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z" /></svg>;
}

export default function Home({ready}: {ready: boolean}) {
  const root = useRef<HTMLDivElement>(null);
  const prog = useRef(0);
  const list = projects;
  const [active, setActive] = useState(0);
  const cur = list[active];

  useLayoutEffect(() => {
    if (reduced) return;
    gsap.set(['.hero .blurb', '.hero .hero-foot'], {opacity: 0, y: 30});
    gsap.set('.hero .lead .li', {yPercent: 110});
    document.querySelector('.hero .lead')?.classList.add('ready');
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (reduced) { el.classList.add('reduced'); return; }
    if (!ready) return;
    const ctx = gsap.context(() => {
      const q = (s: string) => el.querySelector<HTMLElement>(s)!;
      const qa = (s: string) => gsap.utils.toArray<HTMLElement>(s, el);

      gsap.to(['.hero .blurb', '.hero .hero-foot'], {opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.15, delay: 0.5, onUpdate() { if (prog.current > 0.005) { this.kill(); gsap.set(['.hero .blurb', '.hero .hero-foot'], {opacity: Math.max(0, 1 - prog.current / 0.06)}); } }});

      /* pinned hero: image grows from the middle to full bleed, intro line appears */
      const tl = gsap.timeline({scrollTrigger: {trigger: q('.hero-wrap'), start: 'top top', end: 'bottom bottom', scrub: 0.7, onUpdate: (s) => { prog.current = s.progress; }}, defaults: {ease: 'none'}});
      /* the frame grows out of the gradient, the line sits in it and holds, then the frame opens to full bleed and fades */
      const framed = innerWidth < 760 ? 'inset(10% 5% 12% 5% round 16px)' : 'inset(5% 3.5% 5% 3.5% round 18px)';
      tl.fromTo('.hero .hero-foot, .hero .blurb', {opacity: 1}, {opacity: 0, duration: 0.06, immediateRender: false}, 0)
        .fromTo('.reveal', {clipPath: 'inset(50% 50% 50% 50% round 18px)'}, {clipPath: framed, duration: 0.34, ease: 'power2.inOut'}, 0.02)
        .to('.hero .name', {opacity: 0, scale: 1.04, duration: 0.12}, 0.2)
        .fromTo('.reveal .rm', {opacity: 0}, {opacity: 1, duration: 0.06}, 0.32)
        .fromTo('.hero .lead .li', {yPercent: 110}, {yPercent: 0, duration: 0.1, stagger: 0.006, ease: 'power2.out'}, 0.34)
        .fromTo('.hero .lead-veil', {opacity: 0}, {opacity: 1, duration: 0.1}, 0.34)
        .to('.hero .lead .li', {yPercent: -110, duration: 0.05, stagger: 0.004}, 0.6)
        .to('.hero .lead-veil', {opacity: 0, duration: 0.05}, 0.6)
        .to('.reveal .rm', {opacity: 0, duration: 0.04}, 0.64)
        .to('.reveal', {clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.1, ease: 'power2.inOut'}, 0.64)
        .fromTo('.hero .shade', {opacity: 0}, {opacity: 1, duration: 0.03}, 0.87);

      /* parallax on the two feature images */
      qa('.plx-img').forEach((img) => gsap.fromTo(img, {yPercent: -8, scale: 1.2}, {yPercent: 8, scale: 1.2, ease: 'none', scrollTrigger: {trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true}}));

      /* projects: list scrolls, preview swaps, ribbon draws, rail fills */
      const items = qa('.plist li');
      const ribbon = q('.ribbon path') as unknown as SVGPathElement;
      gsap.set(ribbon, {strokeDasharray: 1, strokeDashoffset: 1});
      let last = -1;
      ScrollTrigger.create({
        trigger: q('.proj-sec'), start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: (self) => {
          const pos = self.progress * (items.length - 1);
          const H = items[0].offsetHeight;
          q('.plist').style.transform = `translate3d(0, ${-pos * H}px, 0)`;
          items.forEach((li, i) => {
            const d = i - pos;
            li.style.opacity = String(Math.max(0.16, 1 - Math.abs(d) * 0.6));
            li.style.transform = `translate3d(${Math.abs(d) * 26 + d * 6}px,0,0)`;
          });
          const idx = Math.round(pos);
          if (idx !== last) { last = idx; setActive(idx); }
          ribbon.style.strokeDashoffset = String(1 - Math.min(1, self.progress * 1.6 + 0.05));
          q('.p-bar').style.transform = `scaleY(${self.progress})`;
        },
      });

      /* circle gallery */
      const cg = qa('.cg-img');
      const place = (p: number) => {
        const W = innerWidth, Hh = innerHeight;
        const rx = Math.min(W * (W < 760 ? 0.34 : 0.4), 620), ry = Math.min(Hh * (W < 760 ? 0.3 : 0.36), 300);
        cg.forEach((img, i) => {
          const a = (i / cg.length) * Math.PI * 2 + p * Math.PI * 2;
          const x = Math.cos(a) * rx, y = Math.sin(a) * ry;
          const depth = (Math.sin(a) + 1) / 2;
          img.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${0.7 + depth * 0.5}) rotate(${Math.cos(a) * 5}deg)`;
          img.style.zIndex = String(Math.round(depth * 10));
          img.style.opacity = String(0.5 + depth * 0.5);
        });
      };
      place(0);
      ScrollTrigger.create({trigger: q('.cg-sec'), start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: (s) => place(s.progress)});
      addEventListener('resize', () => place(0));

      /* contact: white circle takes the screen */
      const blob = q('.blob');
      const grow = () => Math.hypot(innerWidth, innerHeight) / blob.offsetWidth * 1.15;
      gsap.timeline({scrollTrigger: {trigger: q('.contact-sec'), start: 'top top', end: 'bottom bottom', scrub: 0.6}, defaults: {ease: 'none'}})
        .fromTo(blob, {scale: 0.2}, {scale: grow, duration: 0.5, ease: 'power2.in'}, 0)
        .fromTo('.c-in', {opacity: 0, y: 60}, {opacity: 1, y: 0, duration: 0.25}, 0.5)
        .fromTo('.c-shot img', {scale: 1.25}, {scale: 1, duration: 0.5}, 0.5);

    }, el);
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    return () => ctx.revert();
  }, [ready]);

  const go = (slug: string) => (e: MouseEvent) => { e.preventDefault(); nav.go(`/work/${slug}`); };
  const jumpTo = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    const t = document.getElementById(id);
    if (smooth.lenis) smooth.lenis.scrollTo(t ?? 0, {duration: 1.6}); else t?.scrollIntoView({behavior: reduced ? 'auto' : 'smooth'});
  };
  const LEAD = 'The people who are crazy enough to think they can change the world are the ones who do.';
  const LEAD_BY = '— Steve Jobs';
  const leadWords = LEAD.split(' ');

  return (
    <div ref={root} className="home">
      {/* 1 · pinned hero */}
      <section id="hero" className="hero-wrap">
        <div className="hero stage">
          <p className="blurb">Student building robots, <em>and software that helps people,</em> through care, detail and restraint.</p>
          <Split as="h1" by="char" className="name">Pranav <em>Ramanathan.</em></Split>
          <div className="reveal"><StatueSeq progress={prog} from={0.3} to={0.64} end={0.87} /><i className="rm tl" /><i className="rm tr" /><i className="rm bl" /><i className="rm br" /></div>
          <p className="lead" aria-label={`${LEAD} ${LEAD_BY}`}>
            {leadWords.map((w, i) => <span className="lw" key={i}><span className="li">{w}</span></span>)}
            <span className="lw lead-by"><span className="li">{LEAD_BY}</span></span>
          </p>
          <div className="lead-veil" aria-hidden="true" />
          <div className="shade" />
          <div className="hero-foot">
            <a href="#about" className="hf-l" onClick={jumpTo('about')} aria-label="Scroll to explore"><Arrow className="ar" />SG 2026</a>
            <span className="hf-c">{socials.map((x, i) => <span key={x.href}>{i > 0 && <i>/</i>}<a href={x.href} target="_blank" rel="noreferrer"><Roll>{x.label}</Roll></a></span>)}</span>
            <span className="hf-r"><Link to="/work"><Roll>Projects</Roll></Link><Link to="/info"><Roll>About</Roll></Link><a href="#contact" onClick={jumpTo('contact')}><Roll>Contact</Roll></a></span>
          </div>
        </div>
      </section>

      {/* 2 · about */}
      <section id="about" className="about">
        <div className="about-grid">
          <div className="about-text">
            <Split as="h2" className="about-big">As a <em>student builder</em>, I make robots and software that keep people in charge of their own day, blending care and <em>precision.</em></Split>
            <p className="about-small" data-r>Student builder from Singapore, studying at {SCHOOL_SHORT}. My work sits where finance, robotics and code meet: I&rsquo;m fascinated by how money and markets move, I build machines and sensors that touch the real world, and I ship apps and websites end to end.</p>
            <Link to="/info" className="tlink" data-r aria-label="More about me"><Roll>More about me</Roll> <Arrow className="ar" /></Link>
          </div>
        </div>
      </section>

      {/* 5 · projects: names roll past a ribbon, the preview swaps beside them */}
      <section id="projects" className="proj-sec" style={{height: `${list.length * 34 + 90}vh`}}>
        <div className="stage pstage">
          <svg className="ribbon" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength={1} d="M-60 -40 C 120 -20 760 -120 640 150 C 560 330 120 380 110 640 C 100 860 260 900 330 980" />
          </svg>
          <h2 className="sr">Projects</h2>
          <span className="p-count">({String(list.length).padStart(2, '0')})</span>
          <ul className="plist">
            {list.map((p, i) => (
              <li key={p.slug} className={i === active ? 'on' : ''}>
                <a href={`/work/${p.slug}`} onClick={go(p.slug)} data-cursor="view" data-cursor-label="View"><Title p={p} /></a>
              </li>
            ))}
          </ul>
          <a className={`pv${cur.media ? '' : ' none'}`} href={`/work/${cur.slug}`} onClick={go(cur.slug)} data-cursor="view" data-cursor-label="View" aria-label={`Open ${cur.title}`}>
            <span className="pv-top"><span>{cur.year}</span><span>Preview</span></span>
            <span className="pv-frame">
              {list.filter((p) => p.media).map((p) => <Thumb key={p.slug} p={p} play={p === cur} className={p === cur ? 'on' : ''} />)}
            </span>
          </a>
          <div className="p-rail" aria-hidden="true"><i className="p-bar" /><span>Projects</span></div>
        </div>
      </section>

      {/* 6 · circle gallery */}
      <section id="gallery" className="cg-sec" style={{height: '340vh'}}>
        <div className="stage cgstage">
          {(() => { const pics = list.filter((p) => p.media).slice(0, 4), art = list.filter((p) => !p.media).slice(0, 4); return pics.flatMap((p, i) => [art[i], p]).filter(Boolean); })().map((p) => <Thumb key={p.slug} p={p} className="cg-img" />)}
          <p className="cg-phrase"><span>Each build is a chance to <em>learn</em>, to test an idea, and to keep the help <em>small.</em></span></p>
        </div>
      </section>

      {/* 7 · contact: a pale sheet takes over, big type, two framed stills */}
      <section id="contact" className="contact-sec" style={{height: '200vh'}}>
        <div className="stage cstage">
          <div className="blob" />
          <div className="c-in">
            <h2 className="c-big">Contact</h2>
            <p className="c-note">Always keen to join a driven team and build things people actually use.</p>
            <figure className="c-shot c-shot1"><img src={`${B}img/seq/f046.webp`} alt="" /><i className="rm tl" /><i className="rm tr" /></figure>
            <figure className="c-shot c-shot2"><img src={`${B}img/seq/f022.webp`} alt="" /><i className="rm tl" /><i className="rm tr" /></figure>
            <p className="c-avail">I&rsquo;m open to <em>internships, collaborations</em> and <em>ambitious projects</em> anywhere in the world.</p>
            <div className="c-links">
              <ul>{socials.map((s) => <li key={s.href}><a href={s.href} target="_blank" rel="noreferrer"><Roll>{s.label}</Roll></a></li>)}</ul>
              <a className="c-mail" href={`mailto:${EMAIL}`} data-cursor="mail" data-cursor-label="Write"><Roll>{EMAIL}</Roll></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
