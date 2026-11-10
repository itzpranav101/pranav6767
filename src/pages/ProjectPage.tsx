import {Link, Roll, Split} from '../motion';
import {B, catLabel, projects} from '../data';
import {Title} from '../Thumb';

function Arrow({back}: {back?: boolean}) {
  return <svg className="ar" viewBox="0 0 84 85" fill="currentColor" aria-hidden="true"><g transform={back ? 'rotate(-135 42 42.5)' : undefined}><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z" /></g></svg>;
}

export default function ProjectPage({slug}: {slug: string}) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) return <section className="page"><Split as="h1" className="ptitle2">Not found</Split><Link to="/work" className="back"><Arrow back />&nbsp;<Roll>BACK</Roll></Link></section>;
  const p = projects[i], next = projects[(i + 1) % projects.length];
  const m = p.media;
  return (
    <section className="page pj">
      <Link to="/work" className="pj-back" aria-label="Back to projects"><Arrow back />&nbsp;<Roll>All projects</Roll></Link>
      <header className="pj-head">
        <p className="pj-num" data-r>({String(i + 1).padStart(2, '0')})</p>
        {p.tm && <img className="pj-logo" src={`${B}img/rootstake-logo.png`} alt="RootStake logo with the TM mark" data-r />}
        <Split as="h1" className="pj-title">{p.title}{p.tm && <sup className="tm">™</sup>}</Split>
        <p className="pj-kicker" data-r><em>{p.kicker}</em></p>
      </header>
      <dl className="pj-meta" data-r>
        <div><dt>Year</dt><dd>{p.year}</dd></div>
        <div><dt>Field</dt><dd>{catLabel(p)}</dd></div>
        <div><dt>Status</dt><dd>{p.status}</dd></div>
        <div><dt>Built with</dt><dd>{p.stack.join(', ')}</dd></div>
      </dl>
      {m && (
        <figure className={`pj-media ${m.kind}`} data-r>
          {m.video
            ? <video src={m.video} poster={m.card} muted loop autoPlay playsInline preload="metadata" aria-label={m.alt} />
            : <img src={m.src} alt={m.alt} width={1280} height={800} />}
          <i className="pm tl" /><i className="pm tr" /><i className="pm bl" /><i className="pm br" />
          {m.caption && <figcaption>{m.caption}</figcaption>}
        </figure>
      )}
      <div className="pj-story">
        <p className="pj-lead" data-r>{p.body}</p>
        <div className="pj-side" data-r>
          <p>{p.detail}</p>
          {p.links.length > 0 && <div className="pj-links">{p.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer"><Roll>{l.label}</Roll><Arrow /></a>)}</div>}
        </div>
      </div>
      <Link to={`/work/${next.slug}`} className="pj-next" data-cursor="view" data-cursor-label="Next" aria-label={`Next project: ${next.title}`}>
        <small>Next project</small>
        <span>{next.title}<Arrow /></span>
      </Link>
    </section>
  );
}
