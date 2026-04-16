import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github, Maximize2, Minimize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCyberMode } from '@/hooks/useCyberMode';
import { useVisitorCount } from '@/hooks/useVisitorCount';
import { loginAdmin } from '@/lib/portfolioData';

type ProjectEntry = {
  title: string;
  slug: string;
  type: string;
  summary: string;
  description: string;
  image: string;
  stack: string[];
  liveUrl: string;
  githubUrl: string;
};

type DesignEntry = {
  title: string;
  slug: string;
  howItWorks: string[];
  lookFeel: string[];
  portfolioUse: string[];
};

type HistoryEntry = {
  id: string;
  type: 'log' | 'prompt' | 'output';
  text: string;
  project?: ProjectEntry;
  images?: ProfileImageEntry[];
  suggestions?: string[];
  revealDelayMs?: number;
};

type ComposeStep = 'name' | 'email' | 'subject' | 'message' | 'confirm';

type ComposeState = {
  step: ComposeStep;
  data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
};

type AdminLoginStep = 'email' | 'password';

type AdminLoginState = {
  step: AdminLoginStep;
  email: string;
};

type LookupMode = 'projects' | 'images' | null;

type ProfileImageEntry = {
  title: string;
  image: string;
  description: string;
};

const SECTION_MAP = {
  home: '#home',
  about: '#about',
  services: '#services',
  projects: '#projects',
  gallery: '#gallery',
  contact: '#contact',
} as const;

const SERVICES = ['Web Development', 'UI/UX Design', 'Music Production', 'Full-Stack Development', 'Mobile-First Design', 'Audio Services'];
const PROFILE_IMAGES: ProfileImageEntry[] = [
  {
    title: 'Hero Portrait - Gilbert',
    image: '/images/gilbert-tuyambaze-dark.jpeg',
    description: 'Primary portrait used in cyber mode and hero sections.',
  },
  {
    title: 'Casual Portrait - Tuyambaze Gilbert',
    image: '/images/gilbert-tuyambaze-light.jpeg',
    description: 'Clean personal portrait for light mode and personal branding.',
  },
  {
    title: 'Business Card - Tuyambaze Gilbert',
    image: '/images/Bussiness-card-TUYAMBAZE-Gilbert.png',
    description: 'Personal brand card with contact and identity details.',
  },
];
const singularize = (value: string) => value.replace(/(?:'s|s)$/i, '');
const COMMAND_MATCHES = [
  'help',
  'clear',
  'minimize',
  'exit',
  'sections',
  'about',
  'hero',
  'gilbert',
  'images',
  'image',
  'education',
  'certifications',
  'services',
  'projects',
  'project',
  'gallery',
  'contact',
  'socials',
  'resume',
  'cv',
  'message',
  'login',
  'dashboard',
  'admin',
];
const listProfileImages = () => PROFILE_IMAGES.map((image, index) => `${index + 1}. ${image.title}`).join('\n');
const findProfileImage = (query: string) => {
  const normalized = normalize(query);
  const numeric = Number(normalized);
  if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= PROFILE_IMAGES.length) {
    return PROFILE_IMAGES[numeric - 1];
  }

  return (
    PROFILE_IMAGES.find((image) => normalize(image.title).includes(normalized)) ??
    PROFILE_IMAGES.find((image) => squash(image.title).includes(squash(normalized))) ??
    null
  );
};
const scoreCommand = (query: string, command: string) => {
  const queryText = normalize(query);
  const querySquashed = squash(query);
  const candidate = normalize(command);
  const target = squash(candidate);
  const querySingular = singularize(queryText);
  const querySingularSquashed = squash(querySingular);
  const candidateSingular = singularize(candidate);
  const targetSingular = squash(candidateSingular);

  if (!queryText) return 0;
  if (queryText === candidate || querySquashed === target) return 1;
  if (querySingular === candidate || querySingular === candidateSingular || querySingularSquashed === target || querySingularSquashed === targetSingular) return 0.97;
  if (candidate.includes(queryText) || target.includes(querySquashed)) return 0.92;
  if (candidate.includes(querySingular) || candidateSingular.includes(querySingular) || target.includes(querySingularSquashed) || targetSingular.includes(querySingularSquashed)) return 0.9;
  if (chars(query) && chars(query) === chars(command)) return 0.88;
  if (chars(querySingular) && chars(querySingular) === chars(command)) return 0.86;
  if (subsequence(querySquashed, target)) return 0.74;
  if (subsequence(querySingularSquashed, target) || subsequence(querySingularSquashed, targetSingular)) return 0.72;

  const overlap = tokens(queryText).filter((token) => tokens(candidate).some((part) => part.includes(token))).length;
  const tokenScore = overlap / Math.max(tokens(queryText).length, 1);
  const editScore = 1 - levenshtein(querySquashed, target) / Math.max(querySquashed.length, target.length, 1);
  const singularEditScore = 1 - levenshtein(querySingularSquashed, targetSingular) / Math.max(querySingularSquashed.length, targetSingular.length, 1);
  return Math.max(tokenScore * 0.72, editScore * 0.68, singularEditScore * 0.72);
};
const findCommandMatch = (query: string) => {
  const ranked = COMMAND_MATCHES
    .map((command) => ({ command, score: scoreCommand(query, command) }))
    .sort((a, b) => b.score - a.score);

  return ranked[0] ?? null;
};

const DESIGNS: DesignEntry[] = [
  {
    title: 'CMatrix - Matrix Rain',
    slug: 'cmatrix',
    howItWorks: [
      'Characters rain down the screen in vertical streams.',
      'Background effect, usually green on black.',
      'Can adjust speed, density, and color.',
    ],
    lookFeel: [
      'Futuristic, hacker-style aesthetic.',
      'Subtle if low opacity, chaotic if full screen.',
    ],
    portfolioUse: [
      'As a background animation in Cyber Mode.',
      'Could fade in when loading a section.',
    ],
  },
  {
    title: 'Rainbow Stream / Rainbow Mode',
    slug: 'rainbow',
    howItWorks: [
      'Text or characters shift through rainbow colors.',
      'Can be animated to move, scroll, or flicker.',
    ],
    lookFeel: [
      'Colorful, chaotic, flashy.',
      'Works best in small bursts; otherwise overwhelming.',
    ],
    portfolioUse: [
      'Easter egg mode.',
      'Accent effect on hover or transition.',
    ],
  },
  {
    title: 'Hollywood Fake Hacker Terminal',
    slug: 'hollywood',
    howItWorks: [
      'Opens multiple terminal panes.',
      'Shows fake commands running simultaneously.',
      'Can include typing animations.',
    ],
    lookFeel: [
      'Busy, technical, cinematic.',
      'Creates the Hollywood hacker vibe.',
    ],
    portfolioUse: [
      'Intro animation when entering Cyber Mode.',
      'Could show loading system logs.',
    ],
  },
  {
    title: 'Pipes.sh Animated Pipes',
    slug: 'pipes',
    howItWorks: [
      'Draws moving ASCII pipe lines that flow across the screen.',
      'Purely visual and non-interactive.',
    ],
    lookFeel: [
      'Retro and geometric with steady motion.',
      'Adds movement without heavy text clutter.',
    ],
    portfolioUse: [
      'Background animation in a hero section.',
      'Subtle overlay under main content.',
    ],
  },
  {
    title: 'Asciiquarium',
    slug: 'asciiquarium',
    howItWorks: [
      'Shows ASCII fish swimming in real time.',
      'Terminal scene is decorative rather than functional.',
    ],
    lookFeel: [
      'Quirky, fun, and lighthearted.',
      'More decorative than technical.',
    ],
    portfolioUse: [
      'Easter egg or playful Cyber Mode section.',
      'Best used in a small corner instead of full screen.',
    ],
  },
  {
    title: 'NeoFetch System Info Display',
    slug: 'neofetch',
    howItWorks: [
      'Shows stylized system info in ASCII-art format.',
      'Fully textual and structured like a terminal profile card.',
    ],
    lookFeel: [
      'Clean, structured, technical.',
      'Feels like a profile card inside a terminal.',
    ],
    portfolioUse: [
      'About Me section in Cyber Mode.',
      'Display personal info like name, role, and stack.',
    ],
  },
  {
    title: 'HTOP Skills Bars',
    slug: 'htop',
    howItWorks: [
      'Shows live-style CPU or memory bars in terminal.',
      'Can be adapted into dynamic skill bars.',
    ],
    lookFeel: [
      'Minimalist and interactive.',
      'Works well for animated progress visualization.',
    ],
    portfolioUse: [
      'Skills section with animated proficiency bars.',
      'Bars can animate on scroll or mode activation.',
    ],
  },
  {
    title: 'Terminal Command Mode',
    slug: 'command-mode',
    howItWorks: [
      'User types commands in a fake terminal interface.',
      'Commands produce output like projects list, about info, and contact flow.',
    ],
    lookFeel: [
      'Interactive and hacker-style.',
      'Real-time typing animation with blinking cursor.',
    ],
    portfolioUse: [
      'Main Cyber Mode interaction.',
      'Commands like help, projects, about, and contact.',
    ],
  },
  {
    title: 'System Boot Hollywood-style Logs',
    slug: 'boot-logs',
    howItWorks: [
      'Simulates a system initializing sequence in terminal.',
      'Typing animation plus optional glitch effects.',
    ],
    lookFeel: [
      'Cinematic, suspenseful, and techy.',
      'Feels immersive during entry into Cyber Mode.',
    ],
    portfolioUse: [
      'Preloader animation when Cyber Mode is activated.',
      'Shows lines like initializing modules and access granted.',
    ],
  },
  {
    title: 'Glitch / Rainbow RGB Split Effects',
    slug: 'glitch-rgb',
    howItWorks: [
      'Text or cursor shifts in red, green, and blue channels.',
      'Flickers occasionally for short periods.',
    ],
    lookFeel: [
      'Futuristic and cyberpunk.',
      'Best when used subtly instead of constantly.',
    ],
    portfolioUse: [
      'Accent for hover effects or transitions.',
      'Good as an easter egg mode or Cyber Mode accent.',
    ],
  },
];

const PROJECTS: ProjectEntry[] = [
  { title: 'MarketPlace Pro', slug: 'marketplace-pro', type: 'Web Development', summary: 'Multi-role marketplace with chat, payments, announcements, and claims support.', description: 'A full-stack marketplace web app with support for multiple user roles including buyer, seller, editor, content manager, and admin. It features role-based access control, a claims support system, advanced chat, announcements, notifications, payment support, and a modern UI.', image: '/assets/marketplacepro.png', stack: ['Next.js', 'TypeScript', 'Vite', 'shadcn-ui', 'Tailwind', 'Firebase', 'React'], liveUrl: 'https://marketplacepro.vercel.app/', githubUrl: 'https://github.com/GILBERT-Tuyambaze/MarketPlace-Pro' },
  { title: 'Nyagatare Secondary School Website', slug: 'nyagatare-secondary-school', type: 'Web Development', summary: 'Modern school platform with public pages, assistant features, and Firebase integration.', description: 'A modern school website built with React, TypeScript, Vite, Tailwind CSS, and shadcn-ui. It includes pages for events, enrollment, donations, board members, and a public AI assistant.', image: '/assets/nss.png', stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn-ui', 'Firebase'], liveUrl: 'https://nyagatare-secondary-school.vercel.app/', githubUrl: 'https://github.com/GILBERT-Tuyambaze/' },
  { title: 'UR Academic Resource Hub', slug: 'ur-academic-resource-hub', type: 'Web Development', summary: 'Academic resource platform with uploads, moderation, auth, and search.', description: 'A full-stack academic resource platform for University of Rwanda students with Firebase auth, user profiles, paper uploads, moderation, and a FastAPI plus SQLAlchemy backend.', image: '/assets/ur-academic-resource-hub.png', stack: ['React', 'TypeScript', 'Vite', 'FastAPI', 'SQLAlchemy', 'Firebase'], liveUrl: 'https://paperhubur.vercel.app', githubUrl: 'https://github.com/GILBERT-Tuyambaze/UR-PAST-PAPER-HUB' },
  { title: 'Private Couple Chat', slug: 'private-couple-chat', type: 'Web Development', summary: 'Private real-time chat app with web, desktop, and mobile clients.', description: 'A full-stack private chat app featuring real-time messaging with Socket.IO, secure auth with JWT, file uploads, and React/Vite frontend clients.', image: '/assets/privatecouplechat.png', stack: ['React', 'Node.js', 'Express', 'Socket.IO', 'MongoDB', 'Electron', 'Expo'], liveUrl: 'https://ournests.vercel.app/', githubUrl: 'https://github.com/GILBERT-Tuyambaze/chatApp' },
  { title: 'Tour Booking & Exploring', slug: 'tour-booking-exploring', type: 'Web Development', summary: 'Responsive tour booking experience with smooth animation and booking flow.', description: 'A responsive tour booking and exploring website with full tour showcase, booking flow, smooth animation, and modern design.', image: '/assets/tour.png', stack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite'], liveUrl: 'https://winning4tours.com', githubUrl: 'https://github.com/GILBERT-Tuyambaze/' },
  { title: 'Consulting Platform', slug: 'consulting-platform', type: 'Web Development', summary: 'Consulting website with services, forms, and polished motion.', description: 'A responsive consulting platform showcasing services, working forms, and strong animation work.', image: '/assets/bright.png', stack: ['React', 'TypeScript', 'Next.js', 'HTML', 'CSS3'], liveUrl: 'https://bright-bridge.vercel.app', githubUrl: 'https://github.com/GILBERT-Tuyambaze/' },
  { title: 'Online Learning Platform', slug: 'online-learning-platform', type: 'Web Development', summary: 'Learning platform with auth and a user-friendly study experience.', description: 'A responsive website for online learning with user auth, user-friendly UI, and supporting features.', image: '/assets/twigane-class.png', stack: ['Supabase', 'React', 'Node.js', 'Next.js', 'Vite'], liveUrl: 'https://twigane-class.vercel.app', githubUrl: 'https://github.com/GILBERT-Tuyambaze/' },
  { title: 'Tuyizere Tresor Portfolio Website', slug: 'tuyizere-tresor-portfolio', type: 'Web Development', summary: 'Personal portfolio platform with modern design and project storytelling.', description: 'A professional portfolio platform designed to highlight skills, experience, and technical projects with interactive UI elements.', image: '/assets/tresor.png', stack: ['React', 'JavaScript', 'Next.js', 'Vite'], liveUrl: 'https://tuyizere-tresor.vercel.app/', githubUrl: 'https://github.com/GILBERT-Tuyambaze/Tresor-portfolio' },
  { title: 'Movie Streaming Site', slug: 'movie-streaming-site', type: 'Web Development', summary: 'Full-featured movie platform with auth, admin features, and strong UI.', description: 'A movie streaming platform with user-friendly UI, auth flows, and admin features.', image: '/assets/orangeflix.png', stack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'React'], liveUrl: 'https://orangeflixx.vercel.app/', githubUrl: 'https://github.com/GILBERT-Tuyambaze/' },
  { title: 'Aimable Bizimungu Personal Portfolio', slug: 'aimable-bizimungu-portfolio', type: 'Web Development', summary: 'Clean portfolio focused on elegance, performance, and professional clarity.', description: 'A modern personal portfolio website built to showcase professional experience, skills, and completed projects.', image: '/assets/aimable.png', stack: ['React', 'JavaScript', 'Next.js', 'Vite'], liveUrl: 'https://aimable-bizimungu.vercel.app/', githubUrl: 'https://github.com/GILBERT-Tuyambaze/aimable-bizimungu' },
  { title: 'AKIMANA Etienne Portfolio Website', slug: 'akimana-etienne-portfolio', type: 'Web Development', summary: 'Business-forward portfolio with strong brand presentation and navigation.', description: 'A modern, responsive business website designed to present services, brand identity, and company information in a professional and engaging way.', image: '/assets/akimana.png', stack: ['React', 'JavaScript', 'Next.js', 'Vite'], liveUrl: 'https://akimana.com/', githubUrl: 'https://github.com/GILBERT-Tuyambaze/akimana-etienne' },
  { title: 'Music Streaming Interface', slug: 'music-streaming-interface', type: 'UI/UX Design', summary: 'Interface concept with visual storytelling and music-focused interaction design.', description: 'A modern music streaming interface design with intuitive navigation and visual treatment.', image: '/assets/archive.png', stack: ['ChatGPT', 'Suno AI', 'Leonardo AI', 'Runway AI', 'After Effects'], liveUrl: 'https://www.youtube.com/@ashola-1', githubUrl: '#' },
];

const HINTS = ['help', 'education', 'projects', 'project 1', 'market place', 'ur hub', 'resume', 'contact', 'minimize', 'exit'];
const LOGS = ['Initializing cyber terminal...', 'Loading portfolio modules...', 'Approximate project matcher online.', 'Type help to inspect available commands.'];
const MATRIX_STREAMS = ['10100101', 'GILBERT', 'REACT', 'TSX', 'NODE', 'A2SV', 'CYBER', 'PORTFOLIO', 'VITE'];
const CONTACT_ACCESS_KEY = 'e0331897-d912-4f1d-a5f1-2a8dcd09d928';
const BOOT_SEQUENCE = [
  '[ OK ] Initializing cyber modules',
  '[ OK ] Linking project index',
  '[ OK ] Enabling visual overlays',
  '[ OK ] Syncing portfolio routes',
  '[ OK ] Access granted',
];
const HOLLYWOOD_SEQUENCE = [
  '[scan] Mirroring project database',
  '[scan] Building live route map',
  '[trace] Watching gallery assets',
  '[auth] Session fingerprint accepted',
  '[ui] Split-pane overlay online',
];
const NEOFETCH_CARD = `gilbert@portfolio
--------------------------
Name      Gilbert Tuyambaze
Role      Frontend and Full-Stack Developer
Location  Kigali, Rwanda
Focus     React, TypeScript, Next.js, Node.js
Mode      Cyber portfolio navigator
Resume    /assets/Gilbert-TUYAMBAZE-CV1.pdf`;
const HTOP_SKILLS = `skills@monitor
JavaScript  ██████████  95%
TypeScript  █████████░  90%
React       █████████░  92%
Next.js     ████████░░  84%
UI Design   ████████░░  82%
Node.js     ████████░░  80%`;
const AQUARIUM_SCENE = `><((('>      ><(((('>      ><>
      bubbles rising through the terminal
   <'))><         <'))><         <')))><`;

const linkifyText = (text: string) => {
  const pattern = /(https?:\/\/[^\s]+|mailto:[^\s]+)/g;
  const parts = text.split(pattern);
  return parts.map((part, index) => {
    if (/^(https?:\/\/[^\s]+|mailto:[^\s]+)$/.test(part)) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto underline decoration-[#00ff9f]/50 underline-offset-4 hover:text-[#e6ffe6]"
        >
          {part}
        </a>
      );
    }
    return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
  });
};

function TypewriterText({
  text,
  delay,
  animate,
  onProgress,
}: {
  text: string;
  delay: number;
  animate: boolean;
  onProgress?: () => void;
}) {
  const [output, setOutput] = useState('');
  const timeoutRef = useRef<number | null>(null);
  const stepDelay = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches ? 24 : 14;
  useEffect(() => {
    if (!animate) {
      setOutput(text);
      onProgress?.();
      return;
    }
    setOutput('');
    if (!text) return;
    let index = 0;
    const startTimer = window.setTimeout(() => {
      const tick = () => {
        setOutput(text.slice(0, index + 1));
        onProgress?.();
        if (index < text.length - 1) {
          index += 1;
          timeoutRef.current = window.setTimeout(tick, stepDelay);
        }
      };
      tick();
    }, delay);
    timeoutRef.current = startTimer;
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, [text, delay, animate, onProgress, stepDelay]);
  return <span>{linkifyText(output)}</span>;
}

const createUniqueId = (type: string) => `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const openExternal = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
const scrollToSection = (selector: string) => {
  const element = document.querySelector(selector);
  if (!element) return false;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
};

const normalize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const squash = (value: string) => normalize(value).replace(/\s+/g, '');
const chars = (value: string) => squash(value).split('').sort().join('');
const tokens = (value: string) => normalize(value).split(' ').filter(Boolean);
const subsequence = (query: string, target: string) => {
  let i = 0;
  for (const char of target) {
    if (char === query[i]) i += 1;
    if (i === query.length) return true;
  }
  return false;
};
const levenshtein = (a: string, b: string) => {
  const grid = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) grid[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) grid[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      grid[i][j] = Math.min(grid[i - 1][j] + 1, grid[i][j - 1] + 1, grid[i - 1][j - 1] + cost);
    }
  }
  return grid[a.length][b.length];
};
const scoreProject = (query: string, project: ProjectEntry) => {
  const queryText = normalize(query);
  const querySquashed = squash(query);
  if (!queryText) return 0;
  const candidates = [project.title, project.slug, `${project.title} ${project.slug}`, project.stack.join(' ')].map(normalize);
  let best = 0;
  for (const candidate of candidates) {
    const target = squash(candidate);
    const overlap = tokens(queryText).filter((token) => tokens(candidate).some((part) => part.includes(token))).length;
    const tokenScore = overlap / Math.max(tokens(queryText).length, 1);
    const editScore = 1 - levenshtein(querySquashed, target) / Math.max(querySquashed.length, target.length, 1);
    let score = Math.max(tokenScore * 0.72, editScore * 0.68);
    if (queryText === candidate || querySquashed === target) score = 1;
    else if (candidate.includes(queryText) || target.includes(querySquashed)) score = 0.92;
    else if (chars(query) && chars(query) === chars(candidate)) score = 0.89;
    else if (subsequence(querySquashed, target)) score = 0.76;
    best = Math.max(best, score);
  }
  return best;
};
const rankProjects = (query: string) => PROJECTS.map((project) => ({ project, score: scoreProject(query, project) })).sort((a, b) => b.score - a.score);
const findProject = (query: string) => {
  const normalized = normalize(query);
  const numeric = Number(normalized);
  if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= PROJECTS.length) return { project: PROJECTS[numeric - 1], score: 1, suggestions: [] as string[] };
  const ranked = rankProjects(query);
  const best = ranked[0];
  const suggestions = ranked.filter((entry) => entry.score >= 0.28).slice(0, 4).map((entry) => entry.project.slug);
  if (!best || best.score < 0.46) return { project: null, score: best?.score ?? 0, suggestions };
  return { project: best.project, score: best.score, suggestions };
};
const listProjects = () => PROJECTS.map((project, index) => `${index + 1}. ${project.title} [${project.slug}]`).join('\n');
const listDesigns = () => DESIGNS.map((design, index) => `${index + 1}. ${design.title} [${design.slug}]`).join('\n');
const findDesign = (query: string) => {
  const normalized = normalize(query);
  const numeric = Number(normalized);
  if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= DESIGNS.length) return DESIGNS[numeric - 1];
  return (
    DESIGNS.find((design) => normalize(`${design.title} ${design.slug}`).includes(normalized)) ??
    DESIGNS.find((design) => squash(`${design.title} ${design.slug}`).includes(squash(normalized))) ??
    null
  );
};
export default function CyberConsole() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isCyberMode, toggleCyberMode } = useCyberMode();
  const { count: visitorCount, loading: visitorCountLoading, error: visitorCountError } = useVisitorCount();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [command, setCommand] = useState('');
  const [secretCommand, setSecretCommand] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [composeState, setComposeState] = useState<ComposeState | null>(null);
  const [adminLoginState, setAdminLoginState] = useState<AdminLoginState | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [lookupMode, setLookupMode] = useState<LookupMode>(null);
  const [viewportInset, setViewportInset] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [visitorLogAdded, setVisitorLogAdded] = useState(false);
  const consoleRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const historyRef = useRef<HTMLDivElement | null>(null);
  const historyEndRef = useRef<HTMLDivElement | null>(null);
  const startupTimerIds = useRef<number[]>([]);
  const settledEntryIdsRef = useRef<Set<string>>(new Set());

  const startupMessages = useMemo(
    () => [
      t('console.initializingTracking'),
      t('console.fetchingVisitorData'),
      t('console.loadingModules'),
      t('console.matcherOnline'),
      t('console.helpHint'),
    ],
    [t]
  );

  const scrollHistoryToBottom = useCallback(() => {
    if (!historyRef.current) return;
    historyRef.current.scrollTop = historyRef.current.scrollHeight;
    historyEndRef.current?.scrollIntoView({ block: 'end' });
  }, []);

  const addHistory = (item: Omit<HistoryEntry, 'id'>) => setHistory((previous) => [...previous, { ...item, id: createUniqueId(item.type) }]);
  const clearStartupTimers = () => {
    startupTimerIds.current.forEach(window.clearTimeout);
    startupTimerIds.current = [];
  };
  useEffect(() => {
    if (!isCyberMode) setIsMinimized(false);
  }, [isCyberMode]);

  useEffect(() => {
    if (isCyberMode && !isMinimized) return;

    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && consoleRef.current?.contains(activeElement)) {
      activeElement.blur();
    }
  }, [isCyberMode, isMinimized]);

  useEffect(() => {
    clearStartupTimers();
    if (!isCyberMode) {
        setHistory([]);
        setCommand('');
        setSecretCommand('');
        setIsMinimized(false);
        setComposeState(null);
        setAdminLoginState(null);
      setIsSendingMessage(false);
      setLookupMode(null);
      return;
    }
      setHistory([]);
      setCommand('');
      setSecretCommand('');
      setIsMinimized(false);
      setComposeState(null);
      setAdminLoginState(null);
    setIsSendingMessage(false);
    setLookupMode(null);
    const timers: number[] = [];
    startupMessages.forEach((message, index) => {
      const timerId = window.setTimeout(() => addHistory({ type: 'log', text: message }), 280 + index * 260);
      timers.push(timerId);
    });
    startupTimerIds.current = timers;
    return () => {
      timers.forEach(window.clearTimeout);
      startupTimerIds.current = [];
    };
  }, [isCyberMode]);

  useEffect(() => {
    if (!isCyberMode || isMinimized) return;
    const timerId = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timerId);
  }, [isCyberMode, isMinimized]);

  useEffect(() => {
    const viewport = window.visualViewport;

    const updateViewport = () => {
      if (!viewport) {
        setViewportInset(0);
        setViewportHeight(window.innerHeight);
        return;
      }

      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setViewportInset(inset);
      setViewportHeight(viewport.height);
    };

    updateViewport();

    if (!viewport) {
      window.addEventListener('resize', updateViewport);
      return () => window.removeEventListener('resize', updateViewport);
    }

    viewport.addEventListener('resize', updateViewport);
    viewport.addEventListener('scroll', updateViewport);
    return () => {
      viewport.removeEventListener('resize', updateViewport);
      viewport.removeEventListener('scroll', updateViewport);
    };
  }, []);

  useEffect(() => {
    scrollHistoryToBottom();
  }, [history, command]);

  useEffect(() => {
    if (visitorCountLoading || visitorLogAdded) return;
    if (!isCyberMode || isMinimized) return;

    if (visitorCount !== null) {
      addHistory({ type: 'log', text: t('console.totalVisitors', { count: new Intl.NumberFormat(i18n.language).format(visitorCount) }) });
      setVisitorLogAdded(true);
      return;
    }

    if (visitorCountError) {
      addHistory({ type: 'log', text: t('console.visitorError') });
      setVisitorLogAdded(true);
    }
  }, [visitorCount, visitorCountError, visitorCountLoading, visitorLogAdded, isCyberMode, isMinimized, t, i18n.language]);

  useEffect(() => {
    if (!historyRef.current || isMinimized) return;
    const startedAt = window.performance.now();
    const intervalId = window.setInterval(() => {
      scrollHistoryToBottom();
      if (window.performance.now() - startedAt > 2400) {
        window.clearInterval(intervalId);
      }
    }, 45);
    return () => window.clearInterval(intervalId);
  }, [history, isMinimized]);

  useEffect(() => {
    if (history.length <= 1) return;
    history.slice(0, -1).forEach((entry) => settledEntryIdsRef.current.add(entry.id));
  }, [history]);

  useEffect(() => {
    if (!isCyberMode || isMinimized) return;

    const input = inputRef.current;
    if (!input) return;

    const handleFocus = () => {
      window.setTimeout(() => {
        input.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        scrollHistoryToBottom();
      }, 180);
    };

    input.addEventListener('focus', handleFocus);
    return () => input.removeEventListener('focus', handleFocus);
  }, [isCyberMode, isMinimized]);

  const showProject = (query: string) => {
    setLookupMode('projects');
    scrollToSection(SECTION_MAP.projects);
    const { project, score, suggestions } = findProject(query);
    if (!project) {
      addHistory({
        type: 'output',
        text: `No strong project match found for "${query}".${suggestions.length ? `\nClosest matches: ${suggestions.join(', ')}` : '\nRun projects to inspect available names or use a project number.'}`,
        suggestions,
      });
      return;
    }
    const confidence = score >= 0.85 ? 'exact' : score >= 0.65 ? 'strong' : 'approximate';
    addHistory({
      type: 'output',
      text: `${project.title}\nType: ${project.type}\nSummary: ${project.summary}\nDescription: ${project.description}\nStack: ${project.stack.join(', ')}\nLive: ${project.liveUrl}\nGitHub: ${project.githubUrl}\nMatch quality: ${confidence}`,
      project,
      suggestions: score < 0.65 ? [project.slug] : undefined,
    });
  };

  const showHero = () => {
    setLookupMode(null);
    scrollToSection(SECTION_MAP.home);
    addHistory({
      type: 'output',
      text:
        "Hero Overview\nGilbert Tuyambaze is a frontend and full-stack developer focused on modern, responsive, and polished web experiences.\nAchievements: A2SV Software Engineering Fellow, multiple shipped portfolio and client platforms, and strong work across web apps, branding, and creative technology.\nBest at: React, TypeScript, Tailwind CSS, UI polish, responsive interfaces, and turning ideas into clean product experiences.\nRecent work: marketplace systems, academic resource platforms, private chat apps, consulting websites, and personal portfolio builds.",
    });
  };

  const showGilbertProfile = () => {
    setLookupMode(null);
    scrollToSection(SECTION_MAP.about);
    addHistory({
      type: 'output',
      text:
        `Gilbert Hub
Tuyambaze Gilbert is a Kigali-based frontend and full-stack developer, UI/UX designer, and creative technologist.
He builds modern interfaces, scalable web applications, and smooth user experiences with React, TypeScript, Next.js, Node.js, and Tailwind CSS.

What you can open next:
- hero: achievements, strengths, and recent work
- about: short professional summary
- education: education and certifications
- contact: email, phone, and guided terminal message
- projects: project list

Project shortcuts:
${listProjects()}

Next step:
Type hero, about, education, contact, projects, or images.
You can also type project followed by a project number or project name for more details.`,
      images: PROFILE_IMAGES,
      revealDelayMs: 420,
    });
  };

  const showEducation = () => {
    setLookupMode(null);
    scrollToSection(SECTION_MAP.about);
    addHistory({
      type: 'output',
      text:
        "Education & Certifications\n- Software Engineering Fellowship | A2SV (Africa to Silicon Valley) | 2026 - Present\n- Planned Double Major in BSc Computer Science and BSc Applied Physics | University | 2025 - Present\n- Full Stack Web Development | Coding Bootcamp | 2024 - 2025\n- Music Production Certificate | Audio Institute | 2024",
    });
  };

  const showProfileImages = () => {
    setLookupMode('images');
    scrollToSection(SECTION_MAP.gallery);
    addHistory({
      type: 'output',
      text: `Gilbert's Images\n${listProfileImages()}\n\nEnter an image number or image name to expand it.`,
      images: PROFILE_IMAGES,
      revealDelayMs: 320,
    });
  };

  const showProfileImage = (query: string) => {
    setLookupMode('images');
    scrollToSection(SECTION_MAP.gallery);
    const image = findProfileImage(query);

    if (!image) {
      addHistory({
        type: 'output',
        text: `Image not found for "${query}".\nType images to list available images, then enter an image number or image name.`,
      });
      return;
    }

    addHistory({
      type: 'output',
      text: `${image.title}\n${image.description}`,
      images: [image],
      revealDelayMs: 380,
    });
  };

  const openProject = (query: string, target: 'live' | 'github') => {
    setLookupMode('projects');
    const { project, suggestions } = findProject(query);
    if (!project) {
      addHistory({
        type: 'output',
        text: `Project not found for "${query}".${suggestions.length ? `\nTry one of these: ${suggestions.join(', ')}` : '\nRun projects to inspect available entries.'}`,
        suggestions,
      });
      return;
    }
    openExternal(target === 'live' ? project.liveUrl : project.githubUrl);
    addHistory({ type: 'output', text: target === 'live' ? `Opening live project: ${project.title}` : `Opening GitHub repository for ${project.title}`, project });
  };

  const startComposeFlow = () => {
    setAdminLoginState(null);
    setSecretCommand('');
    setComposeState({
      step: 'name',
      data: { name: '', email: '', subject: '', message: '' },
    });
    addHistory({ type: 'output', text: 'Terminal message mode started.\nname > Enter your full name' });
  };

  const startAdminLoginFlow = () => {
    setComposeState(null);
    setSecretCommand('');
    setAdminLoginState({ step: 'email', email: '' });
    addHistory({
      type: 'output',
      text: 'Admin login started.\nemail > Enter your admin email address',
    });
  };

  const submitComposeMessage = async (state: ComposeState) => {
    setIsSendingMessage(true);
    addHistory({ type: 'output', text: 'Sending terminal message...' });
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: CONTACT_ACCESS_KEY,
          name: state.data.name,
          email: state.data.email,
          subject: state.data.subject,
          message: state.data.message,
        }),
      });
      const result = await response.json();
      if (result.success) {
        addHistory({ type: 'output', text: 'Message sent successfully from terminal mode.' });
        setComposeState(null);
      } else {
        addHistory({ type: 'output', text: 'Message failed to send. You can type `message` to try again.' });
      }
    } catch {
      addHistory({ type: 'output', text: 'Network error while sending message. Type `message` to try again.' });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const continueComposeFlow = async (rawCommand: string) => {
    if (!composeState) return false;

    const value = rawCommand.trim();
    if (!value) {
      addHistory({ type: 'output', text: `${composeState.step} > Please enter a value.` });
      return true;
    }

    if (value.toLowerCase() === 'cancel') {
      setComposeState(null);
      addHistory({ type: 'output', text: 'Terminal message mode cancelled.' });
      return true;
    }

    if (composeState.step === 'name') {
      setComposeState({ ...composeState, step: 'email', data: { ...composeState.data, name: value } });
      addHistory({ type: 'output', text: 'email > Enter your email address' });
      return true;
    }

    if (composeState.step === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        addHistory({ type: 'output', text: 'email > Please enter a valid email address' });
        return true;
      }
      setComposeState({ ...composeState, step: 'subject', data: { ...composeState.data, email: value } });
      addHistory({ type: 'output', text: 'subject > Enter your subject line' });
      return true;
    }

    if (composeState.step === 'subject') {
      setComposeState({ ...composeState, step: 'message', data: { ...composeState.data, subject: value } });
      addHistory({ type: 'output', text: 'message > Enter your message text' });
      return true;
    }

    if (composeState.step === 'message') {
      const nextState = { ...composeState, step: 'confirm' as const, data: { ...composeState.data, message: value } };
      setComposeState(nextState);
      addHistory({
        type: 'output',
        text:
          `Review:\nName: ${nextState.data.name}\nEmail: ${nextState.data.email}\nSubject: ${nextState.data.subject}\nMessage: ${nextState.data.message}\nconfirm > Type yes to send or cancel to stop`,
      });
      return true;
    }

    if (composeState.step === 'confirm') {
      if (value.toLowerCase() !== 'yes') {
        addHistory({ type: 'output', text: 'confirm > Type yes to send or cancel to stop' });
        return true;
      }
      await submitComposeMessage(composeState);
      return true;
    }

    return false;
  };

  const continueAdminLoginFlow = async (rawCommand: string) => {
    if (!adminLoginState) return false;

    const value = rawCommand.trim();
    if (!value) {
      addHistory({ type: 'output', text: `${adminLoginState.step} > Please enter a value.` });
      return true;
    }

      if (value.toLowerCase() === 'cancel') {
        setAdminLoginState(null);
        setSecretCommand('');
        addHistory({ type: 'output', text: 'Admin login cancelled.' });
        return true;
      }

      if (adminLoginState.step === 'email') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          addHistory({ type: 'output', text: 'email > Please enter a valid email address' });
        return true;
      }

      setAdminLoginState({ step: 'password', email: value });
      setCommand('');
      setSecretCommand('');
      addHistory({ type: 'output', text: 'password > Enter your password' });
      return true;
    }

    if (adminLoginState.step === 'password') {
      try {
        await loginAdmin(adminLoginState.email, value);
        setAdminLoginState(null);
        setSecretCommand('');
        addHistory({ type: 'output', text: 'Access granted. Redirecting to dashboard...' });
        navigate('/dashboard');
      } catch {
        setAdminLoginState(null);
        setSecretCommand('');
        addHistory({ type: 'output', text: 'Access denied. Invalid admin credentials.' });
      }
      return true;
    }

    return false;
  };

  const runCommand = async (rawCommand: string) => {
    const cleaned = rawCommand.trim();
    const normalized = cleaned.toLowerCase();
    if (!normalized) return;

    if (adminLoginState?.step === 'password') {
      addHistory({ type: 'prompt', text: '********' });
    } else {
      addHistory({ type: 'prompt', text: cleaned });
    }

    if (composeState) {
      const handledCompose = await continueComposeFlow(cleaned);
      if (handledCompose) {
        setCommand('');
        return;
      }
    }

    if (adminLoginState) {
        const handledAdminLogin = await continueAdminLoginFlow(cleaned);
        if (handledAdminLogin) {
          setCommand('');
          setSecretCommand('');
          return;
        }
      }

    if (normalized === 'clear') {
      clearStartupTimers();
      setHistory([]);
      setCommand('');
      return;
    }
    if (normalized === 'help') {
      addHistory({ type: 'output', text: `Available commands:\nhelp, clear, minimize, exit\nsections, goto <section>\nhero, about, gilbert, images, image <name|number>, education, services\nprojects, project <name|number>, gallery\ncontact, socials, resume, cv\nopen <project>, github <project>\nmessage, send message\nProfile guide:\n- Type hero to see the hero summary, achievements, strengths, and recent work\n- Type gilbert to see about me and personal images\n- Type images to list Gilbert's portraits and branding visuals\n- Then enter an image number or image name to expand it\n- Type education to see education and certifications\n\nProjects guide:\n- Run or click projects to list all project names\n- Then type a project name or project number for more details\n\nProject matching understands numbers, partial names, token swaps, loose typing, and approximate names.\nTerminal message mode prompts step by step: name > email > subject > message > confirm.\nAdmin login prompts step by step: email > password.\nType cancel anytime to stop.\n\nExamples:\n${HINTS.map((hint) => `- ${hint}`).join('\n')}\n- login\n- dashboard\n- hero\n- images\n- image 1` });
      setCommand('');
      return;
    }
    if (normalized === 'sections') {
      addHistory({ type: 'output', text: `Sections:\n${Object.keys(SECTION_MAP).map((section) => `- ${section}`).join('\n')}` });
      setCommand('');
      return;
    }
    if (normalized.startsWith('goto ')) {
      const section = normalized.replace(/^goto\s+/, '').trim() as keyof typeof SECTION_MAP;
      const selector = SECTION_MAP[section];
      addHistory({ type: 'output', text: selector && scrollToSection(selector) ? `Navigating to ${section}...` : `Unknown section: ${section}. Use sections to list valid targets.` });
      setCommand('');
      return;
    }
    if (normalized === 'about') {
      setLookupMode(null);
      scrollToSection(SECTION_MAP.about);
      addHistory({ type: 'output', text: "Gilbert Tuyambaze\nFrontend and full-stack developer, UI/UX designer, and creative technologist.\nCurrently training as a Software Engineering Fellow at A2SV.\nCore stack: React, TypeScript, Next.js, Node.js, Tailwind CSS." });
      setCommand('');
      return;
    }
    if (normalized === 'education' || normalized === 'education & certifications' || normalized === 'certifications') {
      showEducation();
      setCommand('');
      return;
    }
    if (normalized === 'hero') {
      showHero();
      setCommand('');
      return;
    }
    if (normalized === 'gilbert' || normalized === 'tuyambaze gilbert' || normalized === 'about gilbert') {
      showGilbertProfile();
      setCommand('');
      return;
    }
    if (
      normalized === 'images' ||
      normalized === "gilbert's images" ||
      normalized === 'gilbert images' ||
      normalized === 'my images' ||
      normalized.includes('image')
    ) {
      showProfileImages();
      setCommand('');
      return;
    }
    if (normalized.startsWith('image ')) {
      showProfileImage(cleaned.replace(/^image\s+/i, '').trim());
      setCommand('');
      return;
    }
    if (normalized === 'services') {
      setLookupMode(null);
      scrollToSection(SECTION_MAP.services);
      addHistory({ type: 'output', text: `Services:\n${SERVICES.map((service) => `- ${service}`).join('\n')}` });
      setCommand('');
      return;
    }
    if (normalized === 'projects') {
      setLookupMode('projects');
      scrollToSection(SECTION_MAP.projects);
      addHistory({ type: 'output', text: `Featured projects:\n${listProjects()}\n\nEnter a project number or a project name to get more info.` });
      setCommand('');
      return;
    }
    if (normalized.startsWith('project ')) {
      showProject(cleaned.replace(/^project\s+/i, '').trim());
      setCommand('');
      return;
    }
    if (normalized === 'gallery') {
      setLookupMode(null);
      scrollToSection(SECTION_MAP.gallery);
      addHistory({ type: 'output', text: 'Opening gallery section...\nExplore portraits, branding assets, UI ideas, and project visuals.\nFeatured personal images:\n- Hero Portrait - Gilbert\n- Casual Portrait - Tuyambaze Gilbert\n- Business Card - Tuyambaze Gilbert' });
      setCommand('');
      return;
    }
    if (normalized === 'contact') {
      setLookupMode(null);
      scrollToSection(SECTION_MAP.contact);
      addHistory({ type: 'output', text: 'Contact channels:\n- Email: mailto:tuyambazegilbert05@gmail.com\n- Phone: +250 (79) 343-8873\n- Location: Kigali, Rwanda\n- Type `message` to send a guided terminal message.' });
      setCommand('');
      return;
    }
    if (normalized === 'socials') {
      setLookupMode(null);
      addHistory({ type: 'output', text: 'Social links:\n- GitHub: https://github.com/GILBERT-Tuyambaze/\n- LinkedIn: https://www.linkedin.com/in/gilbert-tuyambaze-02044a3bb/\n- Email: mailto:tuyambazegilbert05@gmail.com' });
      setCommand('');
      return;
    }
    if (normalized === 'resume' || normalized === 'cv') {
      setLookupMode(null);
      openExternal('/assets/Gilbert-TUYAMBAZE-CV1.pdf');
      addHistory({ type: 'output', text: 'Opening resume asset in a new tab...' });
      setCommand('');
      return;
    }
    if (normalized === 'message' || normalized === 'send message' || normalized === 'contact form') {
      setLookupMode(null);
      startComposeFlow();
      setCommand('');
      return;
    }
    if (normalized === 'login' || normalized === 'dashboard' || normalized === 'admin') {
      setLookupMode(null);
      startAdminLoginFlow();
      setCommand('');
      return;
    }
    if (normalized.startsWith('open ')) {
      openProject(cleaned.replace(/^open\s+/i, '').trim(), 'live');
      setCommand('');
      return;
    }
    if (normalized.startsWith('github ')) {
      openProject(cleaned.replace(/^github\s+/i, '').trim(), 'github');
      setCommand('');
      return;
    }
    if (normalized === 'minimize' || normalized === 'hide') {
      setLookupMode(null);
      setIsMinimized(true);
      addHistory({ type: 'output', text: t('console.minimized') });
      setCommand('');
      return;
    }
    if (normalized === 'exit' || normalized === 'close') {
      toggleCyberMode();
      setCommand('');
      return;
    }
    if (/^\d+$/.test(normalized) && lookupMode === 'images') {
      showProfileImage(cleaned);
      setCommand('');
      return;
    }
    if (/^\d+$/.test(normalized) && lookupMode === 'projects') {
      showProject(cleaned);
      setCommand('');
      return;
    }
    const matchedCommand = findCommandMatch(cleaned);
    const matchedProject = findProject(cleaned);
    if (matchedCommand && matchedCommand.score >= 0.3 && matchedCommand.score >= (matchedProject.score ?? 0) + 0.08) {
      addHistory({ type: 'output', text: t('console.commandRunning', { command: matchedCommand.command }) });
      setCommand('');
      await runCommand(matchedCommand.command);
      return;
    }
    if (lookupMode === 'projects' && (normalized.split(' ').length <= 5 || normalized.includes('-'))) {
      showProject(cleaned);
      setCommand('');
      return;
    }
    if (matchedCommand && matchedCommand.score >= 0.3) {
      addHistory({ type: 'output', text: t('console.commandRunning', { command: matchedCommand.command }) });
      setCommand('');
      await runCommand(matchedCommand.command);
      return;
    }
    if (lookupMode === 'projects') {
      addHistory({ type: 'output', text: t('console.projectNotRecognized', { query: cleaned }) });
      setCommand('');
      return;
    }
    if (lookupMode === 'images') {
      addHistory({ type: 'output', text: t('console.imageNotRecognized', { query: cleaned }) });
      setCommand('');
      return;
    }

      addHistory({ type: 'output', text: t('console.commandUnknown', { command: cleaned }) });
      setCommand('');
      setSecretCommand('');
    };

  const visibleHistory = useMemo(() => history.slice(-18), [history]);
  const inputType = adminLoginState?.step === 'password' ? 'password' : 'text';
  const activeInputValue = adminLoginState?.step === 'password' ? secretCommand : command;

  const terminalMaxHeight = viewportHeight ? Math.max(320, viewportHeight - 16) : undefined;

  return (
    <section ref={consoleRef} className={`cyber-console fixed inset-0 pointer-events-none transition-opacity duration-300 ${isCyberMode ? 'z-50 opacity-100' : '-z-10 hidden opacity-0'}`}>
      {!isMinimized && <div className="absolute inset-0 bg-[#050505]/20 backdrop-blur-sm" />}
      <div className="relative h-full w-full overflow-hidden px-2 py-2 pointer-events-none sm:px-6 sm:py-8" style={{ paddingBottom: `${Math.max(8, viewportInset + 8)}px` }}>
        {!isMinimized ? (
          <div className="pointer-events-auto mx-auto flex h-[calc(100dvh-1rem)] w-full max-w-6xl min-h-[320px] flex-col overflow-hidden rounded-2xl border border-[#00ff9f]/20 bg-[#050505]/90 p-3 shadow-[0_0_120px_rgba(0,255,159,0.08)] backdrop-blur-xl sm:min-h-[420px] sm:max-h-[85vh] sm:rounded-3xl sm:p-6" style={{ maxHeight: terminalMaxHeight }}>
            <div className="cyber-console__beam" />
            <div className="cyber-console__matrix" aria-hidden="true">
              {MATRIX_STREAMS.map((stream, index) => (
                <span key={`${stream}-${index}`} className="cyber-console__matrix-column" style={{ left: `${(index + 1) * 9}%`, animationDelay: `${index * 0.9}s`, animationDuration: `${8 + (index % 4)}s` }}>
                  {stream}<br />{stream.split('').reverse().join('')}<br />{stream}
                </span>
              ))}
            </div>
            <div ref={historyRef} className="cyber-console__history min-h-0 flex-1 overflow-y-auto pr-1 pb-4 text-sm leading-6 text-[#b8ffcc] sm:pr-2">
              <div className="mb-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.24em] text-[#00ff9f]/70 sm:text-xs sm:tracking-[0.3em]">
                  <div className="flex flex-wrap gap-2 sm:gap-3"><span>{t('console.modeLabel')}</span><span>{t('console.shortcut')}</span><span>{t('console.navigatorLabel')}</span></div>
                  <button type="button" onClick={() => setIsMinimized(true)} className="inline-flex items-center gap-2 rounded-full border border-[#00ff9f]/30 bg-[#000000b3] px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-[#00ff9f] transition hover:bg-[#00ff9f]/10"><Minimize2 className="h-3.5 w-3.5" />{t('console.commands.minimize')}</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['help', 'projects', 'contact', 'minimize', 'exit'].map((quickCommand) => (
                    <button key={quickCommand} type="button" onClick={() => void runCommand(quickCommand)} className="rounded-full border border-[#00ff9f]/20 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#8fffd1] transition hover:bg-[#00ff9f]/10">{quickCommand}</button>
                  ))}
                </div>
              </div>
              {visibleHistory.length === 0 && <p className="mb-4 text-[#00ff9f]/75">{t('console.readyPrefix')} <span className="font-medium text-[#00ff9f]">{t('console.commands.help')}</span> {t('console.readySuffix')}</p>}
              <div className="space-y-4">
                {visibleHistory.map((entry, index) => {
                  const prefix = entry.type === 'prompt' ? '> ' : entry.type === 'log' ? '[sys] ' : '';
                  return (
                    <div key={entry.id} className="overflow-hidden whitespace-pre-wrap">
                      {entry.project ? (
                        <div className="mt-3 overflow-hidden rounded-2xl border border-[#00ff9f]/20 bg-black/30">
                          <img src={entry.project.image} alt={entry.project.title} className="h-40 w-full object-cover opacity-90 sm:h-44" />
                          <div className="space-y-3 p-4">
                            <p><span className="text-[#00ff9f]/70">{prefix}</span><TypewriterText text={entry.text} delay={index * 80} animate={!settledEntryIdsRef.current.has(entry.id)} onProgress={scrollHistoryToBottom} /></p>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div><h3 className="text-base font-semibold text-[#e6ffe6]">{entry.project.title}</h3><p className="text-xs uppercase tracking-[0.2em] text-[#00ff9f]/70">{entry.project.type}</p></div>
                              <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={() => openExternal(entry.project!.liveUrl)} className="inline-flex items-center gap-2 rounded-full border border-[#00ff9f]/25 px-3 py-1.5 text-xs text-[#b8ffcc] transition hover:bg-[#00ff9f]/10"><ExternalLink className="h-3.5 w-3.5" />{t('projects.liveDemo')}</button>
                                <button type="button" onClick={() => openExternal(entry.project!.githubUrl)} className="inline-flex items-center gap-2 rounded-full border border-[#00ff9f]/25 px-3 py-1.5 text-xs text-[#b8ffcc] transition hover:bg-[#00ff9f]/10"><Github className="h-3.5 w-3.5" />{t('console.githubButton')}</button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {entry.project.stack.map((item) => <span key={item} className="rounded-full border border-[#00ff9f]/20 bg-[#00ff9f]/5 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-[#8fffd1]">{item}</span>)}
                            </div>
                          </div>
                        </div>
                      ) : null}
                      {entry.images && entry.images.length > 0 ? (
                        entry.images.length === 1 ? (
                          <button type="button" onClick={() => void runCommand(`image ${PROFILE_IMAGES.findIndex((item) => item.title === entry.images![0].title) + 1}`)} className="cyber-console__image-card mt-3 w-full overflow-hidden rounded-2xl border border-[#00ff9f]/20 bg-black/30 text-left transition hover:bg-[#00ff9f]/5" style={{ animationDelay: `${entry.revealDelayMs ?? 0}ms` }}>
                            <div className="flex justify-center bg-black/50 p-3 sm:p-4">
                              <img src={entry.images[0].image} alt={entry.images[0].title} className="max-h-[70vh] w-full rounded-xl object-contain opacity-95" />
                            </div>
                            <div className="space-y-2 p-4">
                              <h3 className="text-base font-semibold text-[#e6ffe6]">{entry.images[0].title}</h3>
                              <p className="text-sm text-[#b8ffcc]/80">{entry.images[0].description}</p>
                            </div>
                          </button>
                        ) : (
                          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {entry.images.map((image, imageIndex) => (
                              <button key={image.title} type="button" onClick={() => void runCommand(`image ${PROFILE_IMAGES.findIndex((item) => item.title === image.title) + 1 || imageIndex + 1}`)} className="cyber-console__image-card overflow-hidden rounded-2xl border border-[#00ff9f]/20 bg-black/30 text-left transition hover:bg-[#00ff9f]/5" style={{ animationDelay: `${(entry.revealDelayMs ?? 0) + imageIndex * 140}ms` }}>
                                <img src={image.image} alt={image.title} className="h-40 w-full object-cover opacity-95" />
                                <div className="space-y-2 p-3">
                                  <h3 className="text-sm font-semibold text-[#e6ffe6]">{image.title}</h3>
                                  <p className="text-xs text-[#b8ffcc]/80">{image.description}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )
                      ) : null}
                      {!entry.project ? (
                        <p className={entry.images ? 'mt-3' : ''}>
                          <span className="text-[#00ff9f]/70">{prefix}</span>
                          <TypewriterText text={entry.text} delay={index * 80} animate={!settledEntryIdsRef.current.has(entry.id)} onProgress={scrollHistoryToBottom} />
                        </p>
                      ) : null}
                      {entry.suggestions && entry.suggestions.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {entry.suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void runCommand(`project ${suggestion}`)} className="rounded-full border border-[#00ff9f]/18 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#8fffd1] transition hover:bg-[#00ff9f]/10">{suggestion}</button>)}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                <div ref={historyEndRef} />
              </div>
            </div>
            <form onSubmit={(event) => { event.preventDefault(); void runCommand(adminLoginState?.step === 'password' ? secretCommand : command); }} className="pointer-events-auto shrink-0 pt-3">
              <label htmlFor="cyber-input" className="sr-only">{t('console.inputLabel')}</label>
              <div className="cyber-console__prompt flex items-center gap-2 rounded-2xl border border-[#00ff9f]/30 bg-black/30 px-3 py-3 shadow-inner shadow-[#00ff9f]/5 sm:gap-3 sm:px-4">
                <span className="text-[#00ff9f]">&gt;</span>
                <input ref={inputRef} id="cyber-input" type={inputType} value={activeInputValue} onChange={(event) => {
                  if (adminLoginState?.step === 'password') {
                    setSecretCommand(event.target.value);
                    setCommand('');
                    return;
                  }
                  setCommand(event.target.value);
                }} placeholder={composeState ? t('console.composePlaceholder', { step: composeState.step }) : adminLoginState?.step === 'password' ? 'password > secure entry' : t('console.promptPlaceholder')} autoComplete={adminLoginState?.step === 'password' ? 'new-password' : 'off'} autoCapitalize="none" autoCorrect="off" data-lpignore="true" spellCheck={false} className="cyber-console__input min-w-0 flex-1 bg-transparent text-sm text-[#e6ffe6] outline-none placeholder:text-[#00ff9f]/30" />
                <span className="cyber-console__typing-indicator hidden text-[10px] uppercase tracking-[0.24em] text-[#00ff9f]/55 sm:inline">
                  {isSendingMessage
                    ? t('console.typingStatus.sending')
                    : activeInputValue
                    ? t('console.typingStatus.typing')
                    : composeState
                    ? composeState.step
                    : t('console.typingStatus.ready')}
                </span>
                <button type="submit" disabled={isSendingMessage} className="rounded-full border border-[#00ff9f]/40 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-[#00ff9f] transition hover:bg-[#00ff9f]/10 disabled:opacity-50 sm:px-4 sm:text-xs sm:tracking-[0.2em]">{t('console.run')}</button>
              </div>
            </form>
          </div>
        ) : null}
        <div className="absolute inset-0 pointer-events-none"><div className="cyber-scanlines absolute inset-0" /><div className="cyber-glitch absolute inset-0" /></div>
      </div>
      {isCyberMode && isMinimized && <div className="absolute bottom-5 right-5 z-[10000] pointer-events-auto"><button type="button" onClick={() => setIsMinimized(false)} className="inline-flex items-center gap-2 rounded-full border border-[#00ff9f]/30 bg-[#050505]/95 px-4 py-3 text-sm font-medium uppercase tracking-[0.25em] text-[#00ff9f] shadow-[0_0_24px_rgba(0,255,159,0.16)] transition hover:bg-[#00ff9f]/10"><Maximize2 className="h-4 w-4" />{t('console.reopen')}</button></div>}
    </section>
  );
}
