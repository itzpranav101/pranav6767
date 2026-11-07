import {useEffect, useRef, type MutableRefObject} from 'react';
import {B} from './data';

const FRAMES = 62;
const src = (i: number) => `${B}img/seq/f${String(i + 1).padStart(3, '0')}.webp`;

type Dust = {u: number; v: number; l: number; delay: number; vx: number; vy: number; sw: number; ph: number; sz: number};

/**
 * A marble bust that shatters as you scroll, then crumbles into dust and blows away.
 * Stock clip ("A statue being smashed", Wesley Ford, Pexels licence), graded to the
 * site's palette and cut into frames so scrubbing stays smooth on phones.
 * `progress` 0..1: frames play between `from` and `to`, the dust runs from `to` to `end`.
 */
export default function StatueSeq({progress, from = 0.3, to = 0.8, end = 0.97}: {progress: MutableRefObject<number>; from?: number; to?: number; end?: number}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    const imgs: (HTMLImageElement | null)[] = Array(FRAMES).fill(null);
    let dust: Dust[] | null = null, grid = 0, delays: Float32Array | null = null;
    let mask: HTMLCanvasElement | null = null, mdata: ImageData | null = null, tmp: HTMLCanvasElement | null = null;
    let shown = '', raf = 0, alive = true;
    const rnd = (() => { let s = 7; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();

    const load = (i: number) => new Promise<void>((res) => {
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => { imgs[i] = im; res(); };
      im.onerror = () => res();
      im.src = src(i);
    });

    /* sample the final rubble frame into dust grains: one per bright cell */
    const buildDust = () => {
      const im = imgs[FRAMES - 1];
      if (!im || dust) return;
      grid = innerWidth < 760 ? 150 : 190;
      const oc = document.createElement('canvas');
      oc.width = grid; oc.height = grid;
      const o = oc.getContext('2d', {willReadFrequently: true})!;
      o.drawImage(im, 0, 0, grid, grid);
      const px = o.getImageData(0, 0, grid, grid).data;
      const out: Dust[] = [];
      delays = new Float32Array(grid * grid);
      mask = document.createElement('canvas'); mask.width = grid; mask.height = grid;
      mdata = mask.getContext('2d')!.createImageData(grid, grid);
      tmp = document.createElement('canvas');
      for (let y = 0; y < grid; y++) for (let x = 0; x < grid; x++) {
        const k = (y * grid + x) * 4;
        const l = (px[k] * 0.3 + px[k + 1] * 0.59 + px[k + 2] * 0.11) / 255;
        const u = (x + 0.5) / grid, v = (y + 0.5) / grid;
        // the wind takes the left side first, sweeping right and up, with grain-level jitter
        const delay = 0.5 * (0.62 * u + 0.38 * (1 - v)) + 0.16 * rnd();
        delays![y * grid + x] = delay;
        if (l < 0.09) continue;
        for (let n = 0; n < 2; n++) out.push({l, delay, vx: 0.05 + rnd() * 0.22, vy: -(0.06 + rnd() * 0.26), sw: 0.004 + rnd() * 0.012, ph: rnd() * 6.28, sz: 0.3 + rnd() * 0.5, u: u + (rnd() - 0.5) / grid, v: v + (rnd() - 0.5) / grid});
      }
      dust = out;
    };

    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.max(2, Math.floor(cv.clientWidth * d));
      cv.height = Math.max(2, Math.floor(cv.clientHeight * d));
      shown = '';
    };
    const rect = (im: HTMLImageElement) => {
      const W = cv.width, H = cv.height;
      const s = Math.min(W * 1.1, H * 1.3) / im.width;
      const w = im.width * s, h = im.height * s;
      return {x: (W - w) / 2, y: (H - h) / 2, w, h};
    };
    /* soft radial falloff so the footage melts into the dark instead of sitting in a square */
    const fe = document.createElement('canvas'); fe.width = fe.height = 256;
    { const f = fe.getContext('2d')!, g = f.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, '#000'); g.addColorStop(0.55, '#000'); g.addColorStop(0.85, 'rgba(0,0,0,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      f.fillStyle = g; f.fillRect(0, 0, 256, 256); }
    const feather = (c: CanvasRenderingContext2D, r: {x: number; y: number; w: number; h: number}) => {
      c.globalCompositeOperation = 'destination-in'; c.drawImage(fe, r.x, r.y, r.w, r.h); c.globalCompositeOperation = 'source-over';
    };
    const clear = () => { ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.clearRect(0, 0, cv.width, cv.height); };

    const drawFrame = (i: number) => {
      let k = i;
      while (k > 0 && !imgs[k]) k--;
      const im = imgs[k];
      if (!im) return;
      clear();
      const r = rect(im);
      ctx.drawImage(im, r.x, r.y, r.w, r.h);
      feather(ctx, r);
    };

    const drawDust = (d: number) => {
      const im = imgs[FRAMES - 1];
      if (!im || !dust) { drawFrame(FRAMES - 1); return; }
      clear();
      const r = rect(im);
      const cell = r.w / grid;
      // the settled rubble, eroded by a soft per-cell mask: each patch crumbles just as its grains lift
      const md = mdata!.data, dl = delays!;
      for (let k = 0; k < dl.length; k++) md[k * 4 + 3] = Math.max(0, Math.min(255, (dl[k] - d) * 255 / 0.05 + 255));
      mask!.getContext('2d')!.putImageData(mdata!, 0, 0);
      const tc = tmp!; if (tc.width !== cv.width || tc.height !== cv.height) { tc.width = cv.width; tc.height = cv.height; }
      const t2 = tc.getContext('2d')!;
      t2.globalCompositeOperation = 'source-over'; t2.clearRect(0, 0, tc.width, tc.height);
      t2.drawImage(im, r.x, r.y, r.w, r.h);
      t2.globalCompositeOperation = 'destination-in'; t2.imageSmoothingEnabled = true;
      t2.drawImage(mask!, r.x, r.y, r.w, r.h);
      feather(t2, r);
      ctx.drawImage(tc, 0, 0);
      // the grains themselves: drift up and away on the wind, shrink, thin out
      ctx.globalCompositeOperation = 'source-over';
      for (const g of dust) {
        const t = (d - g.delay) / 0.34;
        if (t <= 0 || t >= 1) continue;
        const e = t * t * (3 - 2 * t);
        const x = r.x + (g.u + g.vx * e + Math.sin(g.ph + t * 7) * g.sw * t) * r.w;
        const y = r.y + (g.v + g.vy * e - 0.04 * t * t) * r.h;
        const s = Math.max(1.3, cell * g.sz * (1 - t * 0.7));
        const a = (1 - t) ** 1.4;
        const c = Math.min(255, Math.round(g.l * 255 * 1.25 + 30));
        ctx.fillStyle = `rgba(${Math.round(c * 0.92)},${Math.round(c * 0.95)},${c},${a})`;
        ctx.fillRect(x, y, s, s);
      }
    };

    const tick = () => {
      if (!alive) return;
      const p = progress.current;
      let key: string;
      if (p < to) {
        const i = Math.round(Math.min(1, Math.max(0, (p - from) / (to - from))) * (FRAMES - 1));
        key = `f${i}`;
        if (key !== shown) { drawFrame(i); shown = key; }
      } else {
        const d = Math.min(1, (p - to) / (end - to));
        key = `d${d.toFixed(4)}`;
        if (key !== shown) { buildDust(); drawDust(d); shown = key; }
      }
      raf = requestAnimationFrame(tick);
    };

    size();
    load(0).then(() => { if (progress.current < to) drawFrame(0); });
    (async () => {
      for (let i = 1; i < FRAMES && alive; i += 6) await Promise.all(Array.from({length: 6}, (_, k) => (i + k < FRAMES ? load(i + k) : Promise.resolve())));
      buildDust();
    })();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(() => { size(); });
    ro.observe(cv);
    return () => { alive = false; cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} className="shards" role="img" aria-label="A marble bust shatters, then crumbles into dust and blows away as you scroll" />;
}
