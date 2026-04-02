import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import { revealElements } from '@/hooks/useScrollReveal';

export default function Projects() {
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
      title: 'MarketPlace Pro',
      description:
        'A full-stack marketplace app with multi-role access, claims support, chat, announcements, payments, and real-world e-commerce workflows.',
      image: '/assets/marketplacepro.png',
      technologies: ['Next.js', 'TypeScript', 'Vite', 'shadcn-ui', 'Tailwind', 'Firebase', 'React', 'HTML', 'CSS3'],
      liveUrl: 'https://marketplacepro.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/MarketPlace-Pro',
      type: 'Web Development',
    },
    {
      title: 'Nyagatare Secondary School Website',
      description:
        'A modern school website with events, enrollment, donations, board pages, and a public AI assistant powered by Firebase integrations.',
      image: '/assets/nss.png',
      technologies: ['React', 'Vite', 'TypeScript', 'Supabase', 'Stripe', 'Tailwind CSS', 'shadcn-ui', 'Firebase', 'React Router', 'Zod', 'Recharts'],
      liveUrl: 'https://nyagatare-secondary-school.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development',
    },
    {
      title: 'UR Academic Resource Hub',
      description:
        'An academic resource platform for University of Rwanda students with searchable materials, uploads, moderation, and a FastAPI backend.',
      image: '/assets/ur-academic-resource-hub.png',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Router', 'React Query', 'FastAPI', 'SQLAlchemy', 'Firebase'],
      liveUrl: 'https://paperhubur.vercel.app',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/UR-PAST-PAPER-HUB',
      type: 'Web Development',
    },
    {
      title: 'Private Couple Chat',
      description:
        'A private chat app with web, desktop, and mobile clients, built with real-time messaging, secure auth, and file sharing support.',
      image: '/assets/privatecouplechat.png',
      technologies: ['React', 'Vite', 'Node.js', 'Express', 'Socket.IO', 'MongoDB', 'JWT', 'Electron', 'Expo', 'CSS'],
      liveUrl: 'https://ournests.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/chatApp',
      type: 'Web Development',
    },
    {
      title: 'Tour Booking & Exploring',
      description:
        'A responsive tour booking website with a full tour showcase, smooth animation, and a working booking flow.',
      image: '/assets/tour.png',
      technologies: ['React', 'HTML', 'CSS3', 'Web3', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite'],
      liveUrl: 'https://winning4tours.com',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development',
    },
    {
      title: 'Consulting Platform',
      description:
        'A responsive consulting website that showcases services, includes working forms, and uses polished animation throughout.',
      image: '/assets/bright.png',
      technologies: ['React', 'TypeScript', 'Next.js', 'JavaScript', 'HTML', 'CSS3'],
      liveUrl: 'https://bright-bridge.vercel.app',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development',
    },
    {
      title: 'Online Learning Platform',
      description:
        'A responsive online learning platform with authentication, a user-friendly UI, and a modern web stack.',
      image: '/assets/twigane-class.png',
      technologies: ['Supabase', 'React', 'JavaScript', 'HTML', 'CSS3', 'Node.js', 'Next.js', 'Vite'],
      liveUrl: 'https://twigane-class.vercel.app',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development',
    },
    {
      title: 'Tuyizere Tresor - Portfolio Website',
      description:
        'A professional portfolio platform designed to highlight skills, experience, and technical projects with a modern visual style.',
      image: '/assets/tresor.png',
      technologies: ['React', 'JavaScript', 'HTML', 'CSS3', 'Node.js', 'Next.js', 'Vite'],
      liveUrl: 'https://tuyizere-tresor.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/Tresor-portfolio',
      type: 'Web Development',
    },
    {
      title: 'Movie Streaming Site',
      description:
        'A full-featured movie platform with authentication, an admin dashboard, and a strong user-friendly interface.',
      image: '/assets/orangeflix.png',
      technologies: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'React', 'HTML', 'CSS3'],
      liveUrl: 'https://orangeflixx.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development',
    },
    {
      title: 'Aimable Bizimungu - Personal Portfolio',
      description:
        'A modern personal portfolio website built to showcase professional experience, skills, and completed projects with clarity and performance.',
      image: '/assets/aimable.png',
      technologies: ['React', 'JavaScript', 'HTML', 'CSS3', 'Node.js', 'Next.js', 'Vite'],
      liveUrl: 'https://aimable-bizimungu.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/aimable-bizimungu',
      type: 'Web Development',
    },
    {
      title: 'AKIMANA Etienne - Portfolio Website',
      description:
        'A modern responsive business website that presents services, brand identity, and company information in a polished way.',
      image: '/assets/akimana.png',
      technologies: ['React', 'JavaScript', 'HTML', 'CSS3', 'Node.js', 'Next.js', 'Vite'],
      liveUrl: 'https://akimana.com/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/akimana-etienne',
      type: 'Web Development',
    },
    {
      title: 'Music Streaming Interface',
      description:
        'A modern music streaming interface concept with intuitive navigation and visual storytelling.',
      image: '/assets/archive.png',
      technologies: ['ChatGPT', 'Suno AI', 'Leonardo AI', 'Runway AI', 'After Effects'],
      liveUrl: 'https://www.youtube.com/@ashola-1',
      githubUrl: '#',
      type: 'UI/UX Design',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Web Development':
        return 'bg-blue-500/10 text-blue-900 border-blue-500/90';
      case 'UI/UX Design':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Audio Production':
        return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <section id="projects" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="projects-title text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="projects-description text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A showcase of my recent work across web development, design, and audio production.
            Each project reflects a different challenge and solution.
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
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4">
                  <Badge className={`${getTypeColor(project.type)} border`}>
                    {project.type}
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
                      <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                        <Github className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
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
                    <Button size="sm" variant="outline" className="flex-1 group/btn">
                      <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                      Live Demo
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
                View All Projects
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
