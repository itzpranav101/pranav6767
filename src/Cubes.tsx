import {useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent} from 'react';
import gsap from 'gsap';
import {nav, reduced} from './motion';
import {catLabel, imgOf, type Project} from './data';
import {Title} from './Thumb';

function Face({p, pos}: {p: Project; pos: 'front' | 'right' | 'left'}) {
  return (
    <div className={`cf cf-${pos}`} aria-hidden={pos !== 'front'}>
      <div className="cf-img"><img src={imgOf(p)} alt={pos === 'front' ? (p.media?.alt ?? `${p.title}, ${p.kicker}`) : ''} loading="lazy" draggable={false} /></div>
      <div className="cf-body">
        <span className="cf-meta">{catLabel(p)} · {p.year}</span>
        <h3 className="cf-title"><Title p={p} /></h3>
        <p className="cf-kicker">{p.kicker}</p>
      </div>
      <i className="cf-shade" />
    </div>
  );
}

/**
 * Projects on a cube: swipe sideways (or use the arrows / arrow keys) and the
 * cube turns to the next project. Tap the front face to open it.
 */
export default function Cubes({items, big, showBody}: {items: Project[]; big?: boolean; showBody?: boolean}) {
  const n = items.length;
  const [i, setI] = useState(0);
  const cube = useRef<HTMLDivElement>(null);
  const rot = useRef(0);
  const busy = useRef(false);
  const drag = useRef<{x: number; y: number; on: boolean; moved: boolean; axis: '' | 'x' | 'y'}>({x: 0, y: 0, on: false, moved: false, axis: ''});

  const set = (deg: number) => {
    rot.current = deg;
    const el = cube.current;
    if (!el) return;
    el.style.transform = `translateZ(calc(var(--s) / -2)) rotateY(${deg}deg)`;
    el.style.setProperty('--a', String(Math.min(1, Math.abs(deg) / 90)));
  };

  // after the index changes the new front face sits at 0deg; reset before paint
  useLayoutEffect(() => { set(0); busy.current = false; }, [i]);

  const turn = (dir: 1 | -1) => {
    if (busy.current) return;
    busy.current = true;
    const o = {v: rot.current};
    gsap.to(o, {v: -90 * dir, duration: reduced ? 0.01 : 0.7, ease: 'power3.inOut', onUpdate: () => set(o.v), onComplete: () => setI((k) => (k + dir + n) % n)});
  };
  const settle = () => {
    const o = {v: rot.current};
    gsap.to(o, {v: 0, duration: 0.45, ease: 'power3.out', onUpdate: () => set(o.v)});
  };

  useEffect(() => {
    const el = cube.current?.parentElement;
    if (!el) return;
    const size = () => el.getBoundingClientRect().width;
    const down = (e: PointerEvent) => {
      if (busy.current) return;
      drag.current = {x: e.clientX, y: e.clientY, on: true, moved: false, axis: ''};
    };
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.on) return;
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (!d.axis && Math.hypot(dx, dy) > 8) d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (d.axis !== 'x') return;
      d.moved = true;
      e.preventDefault();
      set(Math.max(-90, Math.min(90, (dx / size()) * 110)));
    };
    const up = () => {
      const d = drag.current;
      if (!d.on) return;
      d.on = false;
      if (d.axis !== 'x') return;
      const r = rot.current;
      if (r < -22) turn(1); else if (r > 22) turn(-1); else settle();
    };
    el.addEventListener('pointerdown', down);
    addEventListener('pointermove', move, {passive: false});
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
    return () => { el.removeEventListener('pointerdown', down); removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); };
  }, [n]);

  const p = items[i];
  const open = () => { if (!drag.current.moved) nav.go(`/work/${p.slug}`); drag.current.moved = false; };
  const key = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); turn(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); turn(-1); }
    if (e.key === 'Enter') nav.go(`/work/${p.slug}`);
  };

  return (
    <div className={`cubes ${big ? 'big' : ''}`} role="region" aria-roledescription="carousel" aria-label="Projects">
      <div className="cube-stage" tabIndex={0} onKeyDown={key} onClick={open} data-cursor="view" data-cursor-label="Open" aria-label={`${p.title}. Swipe or use the arrow keys for the next project. Press Enter to open.`}>
        <div className="cube" ref={cube}>
          <Face p={items[(i - 1 + n) % n]} pos="left" />
          <Face p={p} pos="front" />
          <Face p={items[(i + 1) % n]} pos="right" />
        </div>
      </div>
      <div className="cube-ctl">
        <button className="cube-btn" onClick={() => turn(-1)} aria-label="Previous project"><svg viewBox="0 0 84 85" fill="currentColor" aria-hidden="true"><g transform="rotate(180 42 42.5)"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z" /></g></svg></button>
        <p className="cube-count" aria-live="polite"><b>{String(i + 1).padStart(2, '0')}</b> / {String(n).padStart(2, '0')}</p>
        <button className="cube-btn" onClick={() => turn(1)} aria-label="Next project"><svg viewBox="0 0 84 85" fill="currentColor" aria-hidden="true"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z" /></svg></button>
      </div>
      {showBody && (
        <div className="cube-info" key={p.slug}>
          <p>{p.body}</p>
          <a href={`/work/${p.slug}`} className="cube-open" onClick={(e) => { e.preventDefault(); nav.go(`/work/${p.slug}`); }}>Open {p.title} <span aria-hidden="true">→</span></a>
        </div>
      )}
    </div>
  );
}
