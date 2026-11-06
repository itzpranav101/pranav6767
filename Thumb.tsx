import type {Project} from './data';
import {imgOf} from './data';

/** A project's picture. Projects with a motion graphic play it when `play` is true; everything else is a still. Never cropped: every card is 16:10. */
export default function Thumb({p, play, className = '', eager}: {p: Project; play?: boolean; className?: string; eager?: boolean}) {
  const alt = p.media?.alt ?? `${p.title}, ${p.kicker}`;
  if (p.media?.video && play) {
    return <video className={className} src={p.media.video} poster={p.media.card} muted loop autoPlay playsInline preload="metadata" aria-label={alt} />;
  }
  return <img className={className} src={imgOf(p)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}

export const Title = ({p}: {p: Project}) => <>{p.title}{p.tm && <sup className="tm">™</sup>}</>;
