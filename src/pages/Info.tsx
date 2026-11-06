import {Link, Roll, Split} from '../motion';
import {B, EMAIL, SCHOOL_SHORT, principles, violin} from '../data';

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
            <div><dt>Focus</dt><dd>Software, hardware, design</dd></div>
            <div><dt>Away from screens</dt><dd>Violin</dd></div>
          </dl>
        </aside>
        <div className="i-main">
          <h2 className="i-name" data-r>Pranav Ramanathan<b>.</b></h2>
          <p className="i-lead" data-r>Student builder and creative developer, studying at {SCHOOL_SHORT} in Singapore.</p>
          <p className="i-p" data-r>I build things that sit quietly in people&rsquo;s lives: software, hardware and everything in between. Passionate about design, motion and the details nobody notices, I&rsquo;m always looking for the point where precision meets <em>care</em>, and where technology stops being noticed and starts being useful.</p>
          <p className="i-q" data-r><em>{violin.line}</em></p>
          <p className="i-p" data-r>{violin.body}</p>
          <div className="i-cols" data-r>
            {principles.map((p) => <div key={p.n}><h3>{p.t}</h3><p>{p.d}</p></div>)}
          </div>
        </div>
      </div>
      <div className="p-bottom"><a href={`mailto:${EMAIL}`} className="mailsm" aria-label={EMAIL}><Roll>{EMAIL}</Roll></a></div>
    </section>
  );
}
