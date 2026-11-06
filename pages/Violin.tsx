import {Link, Roll, Split} from '../motion';
import {B, EMAIL, violin, violinClose, violinLessons} from '../data';

function Arrow() {
  return <svg className="ar" viewBox="0 0 84 85" fill="currentColor" aria-hidden="true"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z" /></svg>;
}

export default function Violin() {
  return (
    <section className="page violin-page">
      <div className="vp-grid">
        <div className="vp-text">
          <Split as="h1" className="vp-h">Violin<em>.</em></Split>
          <p className="vp-line" data-r>{violin.line}</p>
          <p className="vp-p" data-r>{violin.body}</p>
          <ol className="vp-lessons">
            {violinLessons.map(([a, b], i) => (
              <li key={a} data-r><span>0{i + 1}</span><div><h2>{a}</h2><p>{b}</p></div></li>
            ))}
          </ol>
          <p className="vp-close" data-r><em>{violinClose}</em></p>
          <Link to="/contact" className="tlink" data-r aria-label="Say hello"><Roll>Say hello</Roll> <Arrow /></Link>
        </div>
        <figure className="vp-img" data-r>
          <img src={`${B}img/art/violin.jpg`} alt="Four violin strings vibrating above a bridge, drawn in midnight blue and white" width={1200} height={1500} />
        </figure>
      </div>
      <div className="p-bottom"><a href={`mailto:${EMAIL}`} className="mailsm" aria-label={EMAIL}><Roll>{EMAIL}</Roll></a></div>
    </section>
  );
}
