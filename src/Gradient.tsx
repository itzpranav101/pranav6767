import {useEffect, useRef} from 'react';

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r, m; uniform float t, dim; uniform vec3 c0, c1, c2, c3;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  float asp=r.x/r.y;
  // tall soft vertical lobes: stretch noise along y
  vec2 p=vec2((uv.x-.5)*asp*1.5+(m.x-.5)*.35, (uv.y-.5)*.42);
  vec2 q=vec2(fbm(p*1.1+vec2(0.,t*.035)),fbm(p*1.1+vec2(4.3,1.7)-t*.03));
  float f=fbm(p*1.3+2.2*q+vec2(t*.02,0.));
  vec3 c=mix(c0,c1,smoothstep(.22,.62,f));
  c=mix(c,c2,smoothstep(.45,.82,f)*smoothstep(.15,.9,uv.y+q.x*.3));
  c=mix(c,c3,smoothstep(.72,.97,f)*.38*smoothstep(.3,1.,uv.y));
  float vig=smoothstep(.0,.55,uv.y)*.85+.15;
  c*=vig*dim;
  gl_FragColor=vec4(c,1.);
}`;

type Pal = {c: number[]; dim: number};
// black, deep navy, royal navy, soft white-blue glint
export const PALETTES: Pal[] = [
  {c: [.006, .008, .022, .02, .038, .13, .04, .08, .26, .40, .46, .74], dim: 1},
  {c: [.006, .008, .022, .016, .03, .11, .034, .068, .22, .36, .42, .68], dim: 1},
  {c: [.006, .008, .022, .02, .04, .135, .044, .086, .27, .42, .48, .76], dim: 1},
];

export default function Gradient({variant, dim}: {variant: number; dim: number}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const target = useRef<number[]>([]);
  const snap = useRef<() => void>(() => {});
  target.current = [...PALETTES[variant % PALETTES.length].c, dim];

  useEffect(() => { snap.current(); }, [variant, dim]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext('webgl', {antialias: false, alpha: false, powerPreference: 'low-power'});
    if (!gl) return;
    const mk = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const uM = U('m'), uR = U('r'), uT = U('t'), uD = U('dim'), uC = [U('c0'), U('c1'), U('c2'), U('c3')];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cur = [...target.current];
    const mt = {x: .5, y: .5}, mc = {x: .5, y: .5};
    const onMove = (e: PointerEvent) => { mt.x = e.clientX / innerWidth; mt.y = 1 - e.clientY / innerHeight; };
    if (!reduce) addEventListener('pointermove', onMove, {passive: true});
    let raf = 0, visible = true;
    const start = performance.now();
    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 1.25) * 0.6;
      cv.width = Math.max(2, Math.floor(cv.clientWidth * d));
      cv.height = Math.max(2, Math.floor(cv.clientHeight * d));
      gl.viewport(0, 0, cv.width, cv.height);
    };
    const draw = () => {
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uT, reduce ? 12 : (performance.now() - start) / 1000 + 12);
      for (let i = 0; i < 4; i++) gl.uniform3f(uC[i], cur[i * 3], cur[i * 3 + 1], cur[i * 3 + 2]);
      gl.uniform1f(uD, cur[12]);
      gl.uniform2f(uM, mc.x, mc.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const ease = () => { for (let i = 0; i < 13; i++) { const d = target.current[i] - cur[i]; if (Math.abs(d) > 0.002) cur[i] += d * 0.06; else cur[i] = target.current[i]; } };
    const loop = () => { ease(); mc.x += (mt.x - mc.x) * .04; mc.y += (mt.y - mc.y) * .04; draw(); raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0; };
    const kick = () => { if (!reduce && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    snap.current = () => { if (reduce) { for (let i = 0; i < 13; i++) cur[i] = target.current[i]; draw(); } else kick(); };
    size(); draw(); kick();
    const ro = new ResizeObserver(() => { size(); draw(); });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); });
    io.observe(cv);
    document.addEventListener('visibilitychange', kick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', kick); removeEventListener('pointermove', onMove); };
  }, []);
  return <canvas ref={ref} className="gl" aria-hidden="true" />;
}
