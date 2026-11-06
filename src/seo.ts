import {NAME, SCHOOL_FULL, SCHOOL_SHORT, SITE, projects} from './data.ts';

export type Meta = {title: string; description: string; path: string};

export const KEYWORDS = [
  'Pranav Ramanathan', 'Pranav Ramanathan Singapore', 'Pranav Ramanathan SG', `Pranav Ramanathan ${SCHOOL_SHORT}`, `Pranav Ramanathan ${SCHOOL_FULL}`,
  'Pranav Ramanathan student', 'Pranav Ramanathan portfolio', 'Pranav Ramanathan Meco', 'Pranav Ramanathan ROOTED SG', 'Pranav Ramanathan LinguaBomb', 'Pranav Ramanathan violin',
  'Pranav Ramanthan', 'Pranav Ramanatan', 'Pranav Ramnathan', 'Pranav R', `${SCHOOL_SHORT} student Singapore`, 'student developer Singapore', 'teen builder Singapore',
].join(', ');

export function routeMeta(path: string): Meta {
  const p = path.replace(/\/+$/, '') || '/';
  const seg = p.split('/').filter(Boolean);
  if (!seg.length) return {path: '/', title: `${NAME} | Student Builder in Singapore (${SCHOOL_SHORT})`, description: `${NAME} is a student at ${SCHOOL_SHORT} in Singapore who builds robots and software that helps people: Meco for dementia care, ROOTED SG, RootStake and LinguaBomb. Portfolio, projects and contact.`};
  if (seg[0] === 'work' && seg[1]) {
    const pr = projects.find((x) => x.slug === seg[1]);
    if (pr) return {path: `/work/${pr.slug}`, title: `${pr.title} by ${NAME} | ${pr.kicker}`, description: `${pr.title}: ${pr.kicker}. ${pr.body} A project by ${NAME}, student builder in Singapore.`};
  }
  if (seg[0] === 'work') return {path: '/work', title: `Projects | ${NAME}, Singapore`, description: `Projects by ${NAME}, a ${SCHOOL_SHORT} student in Singapore: Meco, ROOTED SG, RootStake, LinguaBomb, Stavex, Kairo, Chorefolio, Cryped and more.`};
  if (seg[0] === 'info') return {path: '/info', title: `About ${NAME} | Student at ${SCHOOL_SHORT}, Singapore`, description: `About ${NAME}: student builder and creative developer at ${SCHOOL_SHORT}, Singapore. Software, hardware, design, and the violin.`};
  if (seg[0] === 'violin') return {path: '/violin', title: `Violin | ${NAME}, Singapore`, description: `${NAME} plays the violin. Why practice is a promise to your future self, and what patience, listening and repetition teach a student builder at ${SCHOOL_SHORT}, Singapore.`};
  if (seg[0] === 'contact') return {path: '/contact', title: `Contact ${NAME} | Singapore`, description: `Get in touch with ${NAME}, student builder in Singapore, about collaborations, dementia care, urban farming, robotics and student startups.`};
  return {path: '/', title: `${NAME} | Student Builder in Singapore (${SCHOOL_SHORT})`, description: `${NAME}, student builder in Singapore.`};
}

export function jsonLd(path: string): object[] {
  const person = {
    '@context': 'https://schema.org', '@type': 'Person', '@id': `${SITE}/#person`,
    name: NAME,
    alternateName: ['Pranav R', 'Pranav Ramanthan', 'Pranav Ramanatan', 'Pranav Ramnathan', 'prx50', 'itzpranav101'],
    url: `${SITE}/`, image: `${SITE}/og.jpg`,
    jobTitle: 'Student builder',
    description: `${NAME} is a student at ${SCHOOL_FULL} (${SCHOOL_SHORT}) in Singapore who builds robots and software that helps people.`,
    address: {'@type': 'PostalAddress', addressLocality: 'Singapore', addressCountry: 'SG'},
    homeLocation: {'@type': 'Place', name: 'Singapore'},
    affiliation: {'@type': 'EducationalOrganization', name: SCHOOL_FULL, alternateName: SCHOOL_SHORT, address: {'@type': 'PostalAddress', addressLocality: 'Singapore', addressCountry: 'SG'}},
    alumniOf: {'@type': 'EducationalOrganization', name: SCHOOL_FULL, alternateName: SCHOOL_SHORT},
    knowsAbout: ['Robotics', 'Software development', 'Dementia care technology', 'Urban farming', 'Violin', 'Student startups'],
    sameAs: ['https://www.linkedin.com/in/prx50/', 'https://github.com/itzpranav101/'],
  };
  const site = {'@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: `${NAME}, student builder`, inLanguage: 'en', publisher: {'@id': `${SITE}/#person`}};
  const out: object[] = [person, site];
  const seg = path.split('/').filter(Boolean);
  if (seg[0] === 'work' && seg[1]) {
    const pr = projects.find((x) => x.slug === seg[1]);
    if (pr) out.push({'@context': 'https://schema.org', '@type': 'CreativeWork', name: pr.title, description: pr.body, creator: {'@id': `${SITE}/#person`}, url: `${SITE}/work/${pr.slug}`, dateCreated: pr.year, keywords: pr.stack.join(', ')});
  }
  return out;
}
