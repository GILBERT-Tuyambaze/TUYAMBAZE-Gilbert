// Configuration for typing animations
export const TYPING_ROLES: string[] = [
  'A Frontend Developer',
  'Youtuber', 
  'Blogger',
  'A Backend Developer',
  'Graphic Designer',
  'A Creative Web Developer'
];

export const TYPING_CONFIG = {
  typeSpeed: 100,
  backSpeed: 100,
  backDelay: 1000,
  loop: true
} as const;

// Alternative role sets for different contexts
export const TYPING_ROLES_ALTERNATIVE = {
  technical: [
    'A React Developer',
    'A TypeScript Expert',
    'A UI/UX Designer',
    'A Full-Stack Engineer'
  ],
  creative: [
    'A Digital Artist',
    'A Content Creator',
    'A Brand Designer',
    'A Visual Storyteller'
  ],
  professional: [
    'A Software Engineer',
    'A Project Manager',
    'A Technical Lead',
    'A Solution Architect'
  ]
} as const;