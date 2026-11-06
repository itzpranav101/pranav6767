import {useEffect, useRef, type MutableRefObject} from 'react';
import {B} from './data';

const FRAMES = 62;
const src = (i: number) => `${B}img/seq/f${String(i + 1).padStart(3, '0')}.webp`;

/**
 * A marble bust that shatters as you scroll. Stock clip ("A statue being smashed",
 * Wesley Ford, Pexels licence), graded to the site's palette and cut into frames so
 * scrubbing stays smooth on phones. `progress` 0..1 maps onto the frames.
 */
export default function StatueSeq({progress, from = 0.3, to = 0.84}: {progress: MutableRefObject<number>; from?: number; to?: number}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    const imgs: (HTMLImageElement | null)[] = Array(FRAMES).fill(null);
    let shown = -1, raf = 0, alive = true;
    const load = (i: number) => new Promise<void>((res) => {
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => { imgs[i] = im; res(); };
      im.onerror = () => res();
      im.src = src(i);
    });
    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.max(2, Math.floor(cv.clientWidth * d));
      cv.height = Math.max(2, Math.floor(cv.clientHeight * d));
      shown = -1;
    };
    const draw = (i: number) => {
      let k = i;
      while (k > 0 && !imgs[k]) k--;
      const im = imgs[k];
      if (!im) return;
      const W = cv.width, H = cv.height;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      const s = Math.min(W, H * 1.02) / im.width;
      const w = im.width * s, h = im.height * s;
      ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
      shown = i;
    };
    const tick = () => {
      if (!alive) return;
      const p = Math.min(1, Math.max(0, (progress.current - from) / (to - from)));
      const i = Math.round(p * (FRAMES - 1));
      if (i !== shown) draw(i);
      raf = requestAnimationFrame(tick);
    };
    size();
    load(0).then(() => { draw(0); });
    // rest in order, a few at a time, so the first part of the break is ready first
    (async () => { for (let i = 1; i < FRAMES && alive; i += 6) await Promise.all(Array.from({length: 6}, (_, k) => i + k < FRAMES ? load(i + k) : Promise.resolve())); })();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(() => { size(); });
    ro.observe(cv);
    return () => { alive = false; cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} className="shards" role="img" aria-label="A marble bust shatters as you scroll" />;
}
