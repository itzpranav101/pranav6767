export const B: string = (import.meta as unknown as {env?: {BASE_URL?: string}}).env?.BASE_URL ?? '/';

export type Cat = 'Apps' | 'Web' | 'Hardware' | 'Education';
export type Project = {
  slug: string;
  title: string;
  kicker: string;
  year: string;
  cat: Cat;
  status: string;
  body: string;
  detail: string;
  stack: string[];
  accent: 0 | 1 | 2;
  featured?: boolean;
  tm?: boolean;
  media?: {src: string; card: string; video?: string; alt: string; kind: 'wide' | 'phone' | 'square'; caption?: string};
  links: {label: string; href: string}[];
};

export const projects: Project[] = [
  {
    slug: 'meco', title: 'Meco', kicker: 'Memory, given back.', year: '2026', cat: 'Apps', status: 'Live', accent: 0, featured: true,
    body: 'Dementia steals context. Meco hands it back: it learns the people, routines and memories that matter to one person and offers the smallest cue at the exact moment it is needed. It never takes over. It keeps people in charge of their own lives.',
    detail: 'It never does the task for the person. The goal is the least help that works, so they stay in charge of their own day.',
    stack: ['JavaScript', 'No build step', 'Zero runtime dependencies'],
    media: {src: `${B}img/meco.jpg`, card: `${B}img/meco-card.jpg`, alt: 'The Meco website: Dementia takes away context. Meco rebuilds it.', kind: 'wide'},
    links: [{label: 'Live site', href: 'https://heymeco.xyz'}, {label: 'Source', href: 'https://github.com/itzpranav101/meco-67-website-final'}],
  },
  {
    slug: 'rooted-sg', title: 'ROOTED SG', kicker: 'A city that counts what it keeps alive.', year: '2026', cat: 'Apps', status: 'iOS and Android', accent: 1, featured: true,
    body: 'Hundreds of thousands of free seed packets, and nobody counts the survivors. ROOTED SG does. Keep a garden on the register, trade produce with neighbours, finish quests, fill your BioDex. Don’t count what we plant. Count what we keep alive.',
    detail: 'Native SwiftUI on iOS with an Android port. Plant checks run on the phone using Apple’s Vision framework. Entered in Samsung Solve for Tomorrow 2026.',
    stack: ['SwiftUI', 'Kotlin', 'On-device Vision'],
    media: {src: `${B}img/rooted.gif`, card: `${B}img/rooted-card.jpg`, alt: 'Screen recording of the ROOTED SG app showing a plant page and the produce market', kind: 'phone', caption: 'Screen recording of the iOS app'},
    links: [{label: 'Source', href: 'https://github.com/itzpranav101/rootedsg'}],
  },
  {
    slug: 'rootstake', title: 'RootStake', tm: true, kicker: 'Plants, finally given a voice.', year: '2026', cat: 'Hardware', status: 'In progress', accent: 2, featured: true,
    body: 'A stake that listens to the plant itself. A probe in the pot, two needles in the stem and an ESP32 that reads soil, air and light together, then sends it all to your phone over Bluetooth. Plant care, run on evidence instead of guesswork.',
    detail: 'The app side is built into ROOTED. The hardware is still a design and firmware in progress, and every reading carries the tier it is allowed to claim: built, prototype or roadmap.',
    stack: ['ESP32', 'Bluetooth LE', 'CAD', 'Firmware'],
    media: {src: `${B}img/rootstake.jpg`, card: `${B}img/rootstake-card.jpg`, alt: 'Render of the RootStake enclosure: a white and green module with a small solar panel and a dragonfly on top', kind: 'square', caption: 'Design render, not a photo of a built unit'},
    links: [],
  },
  {
    slug: 'linguabomb', title: 'LinguaBomb', kicker: 'Five languages. Zero fear.', year: '2026', cat: 'Web', status: 'Live', accent: 0, featured: true,
    body: 'An AI tutor that teaches, quizzes and role-plays with you in English, Hindi, Spanish, French and Mandarin, and turns every exchange into XP. Built in a single day, under competition pressure.',
    detail: 'Built with Team Bomb Island for Battle of Bots, a one-day AI chatbot competition.',
    stack: ['JavaScript', 'Chatbot', 'Knowledge base'],
    media: {src: `${B}img/linguabomb-card.jpg`.replace('-card',''), card: `${B}img/linguabomb-card.jpg`, alt: 'The LinguaBomb website: Speak a new language with confidence', kind: 'wide'},
    links: [{label: 'Live site', href: 'https://itzpranav101.github.io/linguabomb/'}, {label: 'Source', href: 'https://github.com/itzpranav101/linguabomb'}],
  },
  {
    slug: 'stavex', title: 'Stavex', kicker: 'Where teenagers become founders.', year: '2026', cat: 'Web', status: 'Live', accent: 2,
    body: 'Ideas are cheap. Shipping is rare. Stavex turns a teenager’s idea into a real project, with structured weekly tasks and peer validation, so starting something becomes a habit instead of a leap.',
    detail: 'Started in May 2026.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    links: [{label: 'Live site', href: 'https://stavex.org'}, {label: 'Source', href: 'https://github.com/itzpranav101/stavex'}],
  },
  {
    slug: 'kairo', title: 'Kairo', kicker: 'Time, built around you.', year: '2026', cat: 'Apps', status: 'Prototype', accent: 1,
    body: 'Calendars treat every hour the same. You don’t. Kairo plans around your energy, so deep work lands when your focus actually peaks, with balanced breaks and checklists that spread out instead of piling up.',
    detail: 'It schedules balanced focus breaks, spreads out task checklists and tracks daily milestones.',
    stack: ['Scheduling'],
    links: [{label: 'GitHub', href: 'https://github.com/itzpranav101'}],
  },
  {
    slug: 'chorefolio', title: 'Chorefolio', kicker: 'Chores, turned into a track record.', year: '2026', cat: 'Web', status: 'Live', accent: 0,
    body: 'Housework is invisible work. Chorefolio makes it count: every chore tracked like an entry in a portfolio, and gamified until doing your share feels like progress.',
    detail: 'Built in March 2026 in TypeScript and deployed on Vercel.',
    stack: ['TypeScript', 'Vercel'],
    links: [{label: 'Live site', href: 'https://chorefolio.vercel.app'}, {label: 'Source', href: 'https://github.com/itzpranav101/Chorefolio'}],
  },
  {
    slug: 'ecoflex', title: 'EcoFlex', kicker: 'Green, built for the web.', year: '2026', cat: 'Web', status: 'Built', accent: 1,
    body: 'A sustainability project, built on the web, because the planet’s problems deserve better interfaces.',
    detail: 'Built in August 2026.',
    stack: ['CSS', 'Web'],
    links: [{label: 'Source', href: 'https://github.com/itzpranav101/EcoFlex'}],
  },
  {
    slug: 'finflow', title: 'FinFlow Academy', kicker: 'Money, decoded for students.', year: '2026', cat: 'Education', status: 'Built', accent: 2,
    body: 'Finance is a language nobody teaches you at school. FinFlow Academy does: lessons that make money make sense, built in React and TypeScript.',
    detail: 'Started in January 2026.',
    stack: ['React', 'TypeScript'],
    links: [{label: 'Source', href: 'https://github.com/itzpranav101/fin-flow-academy-verse'}],
  },
  {
    slug: 'cryped', title: 'Cryped', kicker: 'Crypto, cracked open.', year: '2025', cat: 'Education', status: 'Built', accent: 0,
    body: 'My very first Swift app: a crash course in crypto, built to make a confusing world make sense. Where it all started.',
    detail: 'Swift is also what ROOTED SG’s iOS app is written in.',
    stack: ['Swift'],
    links: [{label: 'Source', href: 'https://github.com/itzpranav101/CryptoEducation'}],
  },
];

export const principles = [
  {n: '01', t: 'The smallest useful cue', d: 'Good help is the least that works. I would rather build something quiet that people trust than something loud they put up with.'},
  {n: '02', t: 'Say only what you measured', d: 'A spec should separate what is built, what is a prototype and what is just an idea. A smaller true claim beats a bigger one someone can poke a hole in.'},
  {n: '03', t: 'Respect the person on the other side', d: 'Privacy is a feature, not a setting. If something can stay on someone’s own device, it should.'},
];

export const timeline: [string, string, string][] = [
  ['Jan 2024', 'Joined GitHub', 'First web projects'],
  ['Jan 2025', 'Cryped', 'My first Swift app'],
  ['Jan 2026', 'FinFlow Academy', 'React and TypeScript'],
  ['Mar 2026', 'Chorefolio', 'Chores, gamified'],
  ['May 2026', 'Stavex', 'Startups for teens'],
  ['Aug 2026', 'Meco and EcoFlex', 'Dementia support, sustainability'],
  ['Sep 2026', 'ROOTED SG', 'iOS and Android'],
  ['Oct 2026', 'LinguaBomb', 'AI language tutor'],
];

export const SITE = 'https://pranavr.me';
export const NAME = 'Pranav Ramanathan';
export const SCHOOL_SHORT = 'GIIS';
export const SCHOOL_FULL = 'Global Indian International School';
export const EMAIL = 'ramjipranavji@gmail.com';
export const socials = [
  {label: 'GitHub', href: 'https://github.com/itzpranav101/'},
  {label: 'LinkedIn', href: 'https://www.linkedin.com/in/prx50/'},
];
/** Image used for a project: its real screenshot, or generated artwork. */
export const imgOf = (p: Project) => p.media?.card ?? `${B}img/art/${p.slug}.jpg`;
export const catLabel = (p: Project) => p.cat.toUpperCase();



export const manifesto: [string, string, string][] = [
  ['', 'Build small.', ' Build true.'],
  ['Keep the help ', 'as small as it can be,', ' and keep people in charge of their own day.'],
  ['Say only what you have ', 'measured.', ''],
];


/** What Pranav works on. Each line points at something real he has done. */
export const focus: {t: string; line: string; proof: string}[] = [
  {t: 'Finance', line: 'Markets, money and how decisions compound.', proof: 'Competing in the Wharton Global High School Investment Competition, and built FinFlow Academy to teach students finance.'},
  {t: 'Robotics', line: 'Machines that touch the real world.', proof: 'RootStake puts a probe, two stem needles and an ESP32 into a plant pot and streams it all to a phone.'},
  {t: 'Code', line: 'Apps and the web, end to end.', proof: 'SwiftUI and Kotlin on phones, React and TypeScript on the web: Meco, ROOTED SG, LinguaBomb.'},
];
