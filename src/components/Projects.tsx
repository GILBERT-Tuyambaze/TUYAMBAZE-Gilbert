import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import { revealElements } from '@/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

export default function Projects() {
  const { t } = useTranslation();
  useEffect(() => {
    revealElements('.projects-title', {
      origin: 'top',
      distance: '60px',
      duration: 1000,
      delay: 200,
    });

    revealElements('.projects-description', {
      origin: 'bottom',
      distance: '40px',
      duration: 800,
      delay: 400,
    });

    revealElements('.project-card', {
      origin: 'bottom',
      distance: '80px',
      duration: 1000,
      delay: 200,
      interval: 200,
    });

    revealElements('.project-image', {
      origin: 'top',
      distance: '40px',
      duration: 800,
      delay: 400,
      scale: 0.9,
    });

    revealElements('.project-tech', {
      origin: 'bottom',
      distance: '30px',
      duration: 600,
      delay: 600,
      interval: 50,
    });
  }, []);

  const projects = [
    {
      titleKey: 'projects.items.marketplacePro.title',
      descriptionKey: 'projects.items.marketplacePro.description',
      image: '/assets/marketplacepro.png',
      technologies: ['Next.js', 'TypeScript', 'Vite', 'shadcn-ui', 'Tailwind', 'Firebase', 'React', 'HTML', 'CSS3'],
      liveUrl: 'https://marketplacepro.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/MarketPlace-Pro',
      type: 'webDevelopment',
      titleDefault: 'MarketPlace Pro',
      descriptionDefault:
        'A full-stack marketplace app with multi-role access, claims support, chat, announcements, payments, and real-world e-commerce workflows.',
    },
    {
      titleKey: 'projects.items.nyagatareSchool.title',
      descriptionKey: 'projects.items.nyagatareSchool.description',
      image: '/assets/nss.png',
      technologies: ['React', 'Vite', 'TypeScript', 'Supabase', 'Stripe', 'Tailwind CSS', 'shadcn-ui', 'Firebase', 'React Router', 'Zod', 'Recharts'],
      liveUrl: 'https://nyagatare-secondary-school.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'webDevelopment',
      titleDefault: 'Nyagatare Secondary School Website',
      descriptionDefault:
        'A modern school website with events, enrollment, donations, board pages, and a public AI assistant powered by Firebase integrations.',
    },
    {
      titleKey: 'projects.items.urAcademicHub.title',
      descriptionKey: 'projects.items.urAcademicHub.description',
      image: '/assets/ur-academic-resource-hub.png',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Router', 'React Query', 'FastAPI', 'SQLAlchemy', 'Firebase'],
      liveUrl: 'https://paperhubur.vercel.app',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/UR-PAST-PAPER-HUB',
      type: 'webDevelopment',
      titleDefault: 'UR Academic Resource Hub',
      descriptionDefault:
        'An academic resource platform for University of Rwanda students with searchable materials, uploads, moderation, and a FastAPI backend.',
    },
    {
      titleKey: 'projects.items.privateCoupleChat.title',
      descriptionKey: 'projects.items.privateCoupleChat.description',
      image: '/assets/privatecouplechat.png',
      technologies: ['React', 'Vite', 'Node.js', 'Express', 'Socket.IO', 'MongoDB', 'JWT', 'Electron', 'Expo', 'CSS'],
      liveUrl: 'https://ournests.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/chatApp',
      type: 'webDevelopment',
      titleDefault: 'Private Couple Chat',
      descriptionDefault:
        'A private chat app with web, desktop, and mobile clients, built with real-time messaging, secure auth, and file sharing support.',
    },
    {
      titleKey: 'projects.items.tourBooking.title',
      descriptionKey: 'projects.items.tourBooking.description',
      image: '/assets/tour.png',
      technologies: ['React', 'HTML', 'CSS3', 'Web3', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite'],
      liveUrl: 'https://winning4tours.com',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'webDevelopment',
      titleDefault: 'Tour Booking & Exploring',
      descriptionDefault:
        'A responsive tour booking website with a full tour showcase, smooth animation, and a working booking flow.',
    },
    {
      titleKey: 'projects.items.consultingPlatform.title',
      descriptionKey: 'projects.items.consultingPlatform.description',
      image: '/assets/bright.png',
      technologies: ['React', 'TypeScript', 'Next.js', 'JavaScript', 'HTML', 'CSS3'],
      liveUrl: 'https://bright-bridge.vercel.app',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'webDevelopment',
      titleDefault: 'Consulting Platform',
      descriptionDefault:
        'A responsive consulting website that showcases services, includes working forms, and uses polished animation throughout.',
    },
    {
      titleKey: 'projects.items.onlineLearning.title',
      descriptionKey: 'projects.items.onlineLearning.description',
      image: '/assets/twigane-class.png',
      technologies: ['Supabase', 'React', 'JavaScript', 'HTML', 'CSS3', 'Node.js', 'Next.js', 'Vite'],
      liveUrl: 'https://twigane-class.vercel.app',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'webDevelopment',
      titleDefault: 'Online Learning Platform',
      descriptionDefault:
        'A responsive online learning platform with authentication, a user-friendly UI, and a modern web stack.',
    },
    {
      titleKey: 'projects.items.tresor.title',
      descriptionKey: 'projects.items.tresor.description',
      image: '/assets/tresor.png',
      technologies: ['React', 'JavaScript', 'HTML', 'CSS3', 'Node.js', 'Next.js', 'Vite'],
      liveUrl: 'https://tuyizere-tresor.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/Tresor-portfolio',
      type: 'webDevelopment',
      titleDefault: 'Tuyizere Tresor - Portfolio Website',
      descriptionDefault:
        'A professional portfolio platform designed to highlight skills, experience, and technical projects with a modern visual style.',
    },
    {
      titleKey: 'projects.items.orangeflix.title',
      descriptionKey: 'projects.items.orangeflix.description',
      image: '/assets/orangeflix.png',
      technologies: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'React', 'HTML', 'CSS3'],
      liveUrl: 'https://orangeflixx.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'webDevelopment',
      titleDefault: 'Movie Streaming Site',
      descriptionDefault:
        'A full-featured movie platform with authentication, an admin dashboard, and a strong user-friendly interface.',
    },
    {
      titleKey: 'projects.items.aimablePortfolio.title',
      descriptionKey: 'projects.items.aimablePortfolio.description',
      image: '/assets/aimable.png',
      technologies: ['React', 'JavaScript', 'HTML', 'CSS3', 'Node.js', 'Next.js', 'Vite'],
      liveUrl: 'https://aimable-bizimungu.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/aimable-bizimungu',
      type: 'webDevelopment',
      titleDefault: 'Aimable Bizimungu - Personal Portfolio',
      descriptionDefault:
        'A modern personal portfolio website built to showcase professional experience, skills, and completed projects with clarity and performance.',
    },
    {
      titleKey: 'projects.items.akimana.title',
      descriptionKey: 'projects.items.akimana.description',
      image: '/assets/akimana.png',
      technologies: ['React', 'JavaScript', 'HTML', 'CSS3', 'Node.js', 'Next.js', 'Vite'],
      liveUrl: 'https://akimana.com/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/akimana-etienne',
      type: 'webDevelopment',
      titleDefault: 'AKIMANA Etienne - Portfolio Website',
      descriptionDefault:
        'A modern responsive business website that presents services, brand identity, and company information in a polished way.',
    },
    {
      titleKey: 'projects.items.musicStreaming.title',
      descriptionKey: 'projects.items.musicStreaming.description',
      image: '/assets/archive.png',
      technologies: ['ChatGPT', 'Suno AI', 'Leonardo AI', 'Runway AI', 'After Effects'],
      liveUrl: 'https://www.youtube.com/@ashola-1',
      githubUrl: '#',
      type: 'uiuxDesign',
      titleDefault: 'Music Streaming Interface',
      descriptionDefault:
        'A modern music streaming interface concept with intuitive navigation and visual storytelling.',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'webDevelopment':
        return 'bg-blue-500/10 text-blue-900 border-blue-500/90';
      case 'uiuxDesign':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'audioProduction':
        return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <section id="projects" className="py-20 px-4 bg-muted">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="projects-title text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t('projects.title')}
          </h2>
          <p className="projects-description text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('projects.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="project-card group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-background border-2 hover:border-primary/20"
            >
              <div className="project-image relative overflow-hidden">
                <img
                  src={project.image}
                  alt={t(project.titleKey, { defaultValue: project.titleDefault })}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4">
                  <Badge className={`${getTypeColor(project.type)} border`}>
                    {t(`projects.types.${project.type}`)}
                  </Badge>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-3">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>

                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="secondary" className="backdrop-blur-sm" aria-label={`GitHub ${t(project.titleKey, { defaultValue: project.titleDefault })}`}>
                        <Github className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {t(project.titleKey, { defaultValue: project.titleDefault })}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t(project.descriptionKey, { defaultValue: project.descriptionDefault })}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="outline"
                      className="project-tech text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button size="sm" variant="outline" className="flex-1 group/btn w-full">
                      <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                      {t('projects.liveDemo')}
                    </Button>
                  </a>

                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost" className="group/btn">
                      <Github className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <a href="https://github.com/GILBERT-Tuyambaze?tab=repositories" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="group">
              <span className="flex items-center gap-2">
                {t('projects.viewAll')}
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
