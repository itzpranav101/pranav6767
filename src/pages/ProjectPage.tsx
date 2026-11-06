import {Link, Roll, Split} from '../motion';
import {B, catLabel, imgOf, projects} from '../data';
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
    <section className="page detail">
      <Link to="/work" className="detail-back" aria-label="Back to projects"><Arrow back />&nbsp;<Roll>BACK</Roll></Link>
      <div className="d-grid">
        <div className="d-info">
          <p className="d-cat" data-r>{catLabel(p)} · {p.status}</p>
          {p.tm && <img className="d-logo" src={`${B}img/rootstake-logo.png`} alt="RootStake logo with the TM mark" data-r />}
          <div className="d-titlewrap">
            <Split as="h1" className="d-title">{p.title}{p.tm && <sup className="tm">™</sup>}</Split>
            <span className="d-year">{p.year}</span>
          </div>
          <p className="d-kicker" data-r>{p.kicker}</p>
          <p className="d-desc" data-r>{p.body}</p>
          <p className="d-desc muted" data-r>{p.detail}</p>
          <ul className="d-tags" data-r>{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
          <div className="d-links" data-r>
            {p.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer" aria-label={l.label}><Roll>{l.label.toUpperCase()}</Roll>&nbsp;<Arrow /></a>)}
          </div>
        </div>
        <div className="d-gallery" data-r>
          <div className={`d-sel ${m?.kind ?? ''}`}>
            {m?.video
              ? <video src={m.video} poster={m.card} muted loop autoPlay playsInline preload="metadata" aria-label={m.alt} />
              : <img src={m?.src ?? imgOf(p)} alt={m?.alt ?? `${p.title}, ${p.kicker}`} width={1280} height={800} />}
            {m?.caption && <small>{m.caption}</small>}
          </div>
        </div>
      </div>
      <Link to={`/work/${next.slug}`} className="d-next" data-cursor="view" data-cursor-label="Next" aria-label={`Next project: ${next.title}`}>
        <small>Next project</small><span>{next.title} <Arrow /></span>
      </Link>
    </section>
  );
}
