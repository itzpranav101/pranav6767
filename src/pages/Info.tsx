import {Link, Roll, Split} from '../motion';
import {EMAIL, SCHOOL_SHORT, principles} from '../data';

function Arrow() {
  return <svg className="ar" viewBox="0 0 84 85" fill="currentColor" aria-hidden="true"><g transform="rotate(-135 42 42.5)"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z" /></g></svg>;
}

export default function Info() {
  return (
    <section className="page info-page">
      <Split as="h1" className="ptitle2">About</Split>
      <div className="i-grid">
        <aside className="i-side" data-r>
          
          <dl className="i-meta">
            <div><dt>Based in</dt><dd>Singapore</dd></div>
            <div><dt>School</dt><dd>{SCHOOL_SHORT}, Singapore</dd></div>
            <div><dt>Focus</dt><dd>Finance, robotics, code</dd></div>
          </dl>
        </aside>
        <div className="i-main">
          <h2 className="i-name" data-r>Pranav Ramanathan<b>.</b></h2>
          <p className="i-lead" data-r>Student builder and creative developer, studying at {SCHOOL_SHORT} in Singapore.</p>
          <p className="i-p" data-r>My work sits where finance, robotics and code meet. I&rsquo;m fascinated by how money and markets move and how small decisions compound; I build machines and sensors that touch the real world, from firmware up; and I ship apps and websites end to end, from SwiftUI and Kotlin on phones to React and TypeScript on the web. Whatever I&rsquo;m making, I care about <em>care</em>, detail, and saying only what I&rsquo;ve measured.</p>
          <div className="i-cols" data-r>
            {principles.map((p) => <div key={p.n}><h3>{p.t}</h3><p>{p.d}</p></div>)}
          </div>
        </div>
      </div>
      <div className="p-bottom"><a href={`mailto:${EMAIL}`} className="mailsm" aria-label={EMAIL}><Roll>{EMAIL}</Roll></a></div>
    </section>
  );
}
