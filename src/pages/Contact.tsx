import {Link, Roll, Split} from '../motion';
import {EMAIL, socials} from '../data';

function Arrow() {
  return <svg className="ar" viewBox="0 0 84 85" fill="currentColor" aria-hidden="true"><g transform="rotate(-135 42 42.5)"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z" /></g></svg>;
}

export default function Contact() {
  return (
    <section className="page info-page contact-page">
      <Split as="h1" className="ptitle2">Contact</Split>
      <div className="i-grid">
        <aside className="i-side" data-r>
          <div className="glass">
            <h3>Let&rsquo;s talk about your project.</h3>
            <p>I reply to collaborations, questions and ideas, especially around dementia care, urban farming, robotics and student startups.</p>
          </div>
          <dl className="i-meta">
            <div><dt>Based in</dt><dd>Singapore</dd></div>
            <div><dt>Status</dt><dd>Student</dd></div>
            <div><dt>Open to</dt><dd>Collaborations</dd></div>
          </dl>
        </aside>
        <div className="i-main">
          <h2 className="i-name big" data-r>Let&rsquo;s build together.</h2>
          <p className="i-lead" data-r>Student builder, focused on care, detail and software that helps people.</p>
          <p className="i-p" data-r>If you have a project in mind, an idea or a question, I&rsquo;d be glad to talk it through and see where we can help each other.</p>
          <div className="i-cols two" data-r>
            <div><h3>Shortcuts</h3><ul>
              <li><a href={`mailto:${EMAIL}`} aria-label="Direct mail"><Roll>Direct mail</Roll></a></li>
              {socials.map((s) => <li key={s.href}><a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}><Roll>{s.label}</Roll></a></li>)}
            </ul></div>
            <div><h3>Helpful to include</h3><ul><li>What you&rsquo;re making</li><li>Who it&rsquo;s for</li><li>Your timeline</li><li>Any constraints</li></ul></div>
          </div>
        </div>
      </div>
      <div className="p-bottom"><a href={`mailto:${EMAIL}`} className="mailsm" aria-label={EMAIL}><Roll>{EMAIL}</Roll></a></div>
    </section>
  );
}
