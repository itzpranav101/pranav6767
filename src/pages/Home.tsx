import {useEffect, useLayoutEffect, useRef, useState, type MouseEvent} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Link, Roll, Split, reduced, smooth} from '../motion';
import {B, EMAIL, SCHOOL_SHORT, projects, socials} from '../data';
import Thumb from '../Thumb';
import Cubes from '../Cubes';
import StatueSeq from '../StatueSeq';

function Arrow({className}: {className?: string}) {
  return <svg className={className} viewBox="0 0 84 85" fill="currentColor" aria-hidden="true"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z" /></svg>;
}

export default function Home({ready}: {ready: boolean}) {
  const root = useRef<HTMLDivElement>(null);
  const prog = useRef(0);
  const list = projects;

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

      gsap.to(['.hero .blurb', '.hero .hero-foot'], {opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.15, delay: 0.5});

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
        .to('.hero .lead .li', {yPercent: -110, duration: 0.05, stagger: 0.008}, 0.84)
        .to('.reveal .rm', {opacity: 0, duration: 0.04}, 0.84)
        .to('.reveal', {clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.1, ease: 'power2.inOut'}, 0.84)
        .fromTo('.hero .shade', {opacity: 0}, {opacity: 1, duration: 0.05}, 0.95);

      /* parallax on the two feature images */
      qa('.plx-img').forEach((img) => gsap.fromTo(img, {yPercent: -8, scale: 1.2}, {yPercent: 8, scale: 1.2, ease: 'none', scrollTrigger: {trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true}}));

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
        .fromTo('.c-in', {opacity: 0, y: 60}, {opacity: 1, y: 0, duration: 0.25}, 0.5);

    }, el);
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    return () => ctx.revert();
  }, [ready]);

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
          <div className="reveal"><StatueSeq progress={prog} /><i className="rm tl" /><i className="rm tr" /><i className="rm bl" /><i className="rm br" /></div>
          <p className="lead" aria-label={`${LEAD} ${LEAD_BY}`}>
            {leadWords.map((w, i) => <span className="lw" key={i}><span className="li">{w}</span></span>)}
            <span className="lw lead-by"><span className="li">{LEAD_BY}</span></span>
          </p>
          <div className="lead-veil" aria-hidden="true" />
          <div className="shade" />
          <div className="hero-foot">
            <a href="#about" className="cue" onClick={jumpTo('about')} aria-label="Scroll to explore"><i aria-hidden="true" />Scroll</a>
          </div>
        </div>
      </section>

      {/* 2 · about */}
      <section id="about" className="about">
        <div className="about-grid">
          <div className="about-text">
            <Split as="h2" className="about-big">As a <em>student builder</em>, I make robots and software that keep people in charge of their own day, blending care and <em>precision.</em></Split>
            <p className="about-small" data-r>Student builder from Singapore, studying at {SCHOOL_SHORT}. I work across finance, robotics and code: competing in the Wharton investment competition, building sensors that live in the soil, and shipping apps and websites end to end.</p>
            <Link to="/info" className="tlink" data-r aria-label="More about me"><Roll>More about me</Roll> <Arrow className="ar" /></Link>
          </div>
        </div>
      </section>

      {/* 5 · projects: a cube to swipe through, names and pictures only */}
      <section id="projects" className="home-cubes">
        <Split as="h2" className="hc-h">Things I&rsquo;ve <em>made.</em></Split>
        <Cubes items={list} />
        <Link to="/work" className="tlink hc-all" aria-label="All projects"><Roll>All projects</Roll> <Arrow className="ar" /></Link>
      </section>

      {/* 6 · circle gallery */}
      <section id="gallery" className="cg-sec" style={{height: '340vh'}}>
        <div className="stage cgstage">
          {list.slice(0, 8).map((p) => <Thumb key={p.slug} p={p} className="cg-img" />)}
          <p className="cg-phrase"><span>Each build is a chance to <em>learn</em>, to test an idea, and to keep the help <em>small.</em></span></p>
        </div>
      </section>

      {/* 7 · contact: white circle takes over */}
      <section id="contact" className="contact-sec" style={{height: '200vh'}}>
        <div className="stage cstage">
          <div className="blob" />
          <div className="c-in">
            <p className="c-tiny">Contact</p>
            <h2 className="c-big">Let&rsquo;s build <em>together.</em></h2>
            <p className="c-p">Work on dementia care, urban farming, robotics or student startups? Or want to compare notes? Write to me.</p>
            <a className="c-mail mag" href={`mailto:${EMAIL}`} aria-label={EMAIL} data-cursor="mail" data-cursor-label="Write"><Roll>{EMAIL}</Roll></a>
            <ul className="c-soc">{socials.map((s) => <li key={s.href}><a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}><Roll>{s.label}</Roll></a></li>)}</ul>
          </div>
        </div>
      </section>
    </div>
  );
}
