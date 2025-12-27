
'use client';

import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import { revealElements } from '@/hooks/useScrollReveal';

export default function Projects() {
  useEffect(() => {
    // small delay so DOM/layout/images have time to render
    const timer = window.setTimeout(() => {
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

      // NOTE: removed .project-image reveal to avoid clipping/overflow conflicts
      revealElements('.project-tech', {
        origin: 'bottom',
        distance: '30px',
        duration: 600,
        delay: 600,
        interval: 50,
      });
    }, 80);

    return () => clearTimeout(timer);
  }, []);

  const projects = [
    {
      title: 'Nyagatare ss',
      description:
        'A full-featured School platform with full applying process, payment processing, and admin dashboard.',
      image: '/assets/nss.png',
      technologies: [
        'React',
        'Next.js',
        'TypeScript',
        'Supabase',
        'Stripe',
        'Tailwind CSS',
        'HTML',
        'CSS3',
      ],
      liveUrl: 'https://nyagatare-secondary-school.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development',
    },
    {
      title: 'Movie Streaming Site',
      description:
        'A collaborative, full-featured movie streaming platform with a user-friendly UI, auth, and admin dashboard.',
      image: '/assets/orangeflix.png',
      technologies: [
        'Next.js',
        'TypeScript',
        'Tailwind',
        'Supabase',
        'React',
        'HTML',
        'CSS3',
      ],
      liveUrl: 'https://orangeflixx.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development',
    },
    {
      title: 'Music Streaming Interface',
      description:
        'A modern music streaming interface design with intuitive navigation and visualizations.',
      image: '/assets/archive.png',
      technologies: ['ChatGPT', 'Suno AI', 'ElevenLabs', 'Runway', 'After Effects'],
      liveUrl: 'https://www.youtube.com/@ashola-1',
      githubUrl: '#',
      type: 'UI/UX Design',
    },
    {
      title: 'Tour Booking & Exploring',
      description:
        'A responsive tour booking website with full tour showcase, booking, smooth animations and modern design.',
      image: '/assets/tour.png',
      technologies: [
        'React',
        'HTML',
        'CSS3',
        'Web3',
        'TypeScript',
        'Next.js',
        'Tailwind CSS',
        'Vite',
      ],
      liveUrl: 'https://winning4tours.com',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development',
    },
    {
      title: 'Consulting Platform',
      description:
        'A responsive consulting platform showcasing services, fully working forms, and polished animations.',
      image: '/assets/bright.png',
      technologies: ['React', 'TypeScript', 'Next.js', 'JavaScript', 'HTML', 'CSS3'],
      liveUrl: 'https://bright-bridge.vercel.app',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development',
    },
    {
      title: 'Online Learning Platform',
      description:
        'A responsive site for online learning with user auth, user-friendly UI, and course management features.',
      image: '/assets/twigane-class.png',
      technologies: [
        'Supabase',
        'React',
        'JavaScript',
        'HTML',
        'CSS3',
        'Node.js',
        'Next.js',
        'Vite',
      ],
      liveUrl: 'https://twigane-class.vercel.app',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development',
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
            Each project represents a unique challenge and creative solution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            // wrapper handles hover transform so ScrollReveal can animate the .project-card safely
            <div
              key={index}
              className="hover:-translate-y-2 transition-transform duration-300"
            >
              <Card
                className="project-card group overflow-hidden hover:shadow-2xl bg-background border-2 hover:border-primary/20"
              >
                <div className="relative overflow-hidden">
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
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>

                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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
            </div>
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
