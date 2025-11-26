import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Play } from 'lucide-react';
import { revealElements } from '@/hooks/useScrollReveal';

export default function Projects() {
  {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Featured Projects by Gilbert Tuyambaze",
  "creator": {
    "@type": "Person",
    "name": "Gilbert Tuyambaze"
  },
  "url": "https://tuyambaze-gilbert.vercel.app/#projects"
},

  useEffect(() => {
    // Projects section animations
    revealElements('.projects-title', { 
      origin: 'top', 
      distance: '60px', 
      duration: 1000,
      delay: 200 
    });
    
    revealElements('.projects-description', { 
      origin: 'bottom', 
      distance: '40px', 
      duration: 800,
      delay: 400 
    });
    
    revealElements('.project-card', { 
      origin: 'bottom', 
      distance: '80px', 
      duration: 1000,
      delay: 200,
      interval: 200 
    });
    
    revealElements('.project-image', { 
      origin: 'top', 
      distance: '40px', 
      duration: 800,
      delay: 400,
      scale: 0.9 
    });
    
    revealElements('.project-tech', { 
      origin: 'bottom',  
      distance: '30px', 
      duration: 600,
      delay: 600,
      interval: 50 
    });
  }, []);

  const projects = [
    {
      title: 'Nyagatare ss',
      description: 'A full-featured School platform with full Applying process, payment processing, and admin dashboard.',
      image: '/assets/nss.png',
      technologies: ['React', 'Next.js','TypeScript', 'Supabase', 'Stripe', 'Tailwind CSS','Html','css3'],
      liveUrl: 'https://nyagatare-secondary-school.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development'
    },
    {
      title: 'Movie Streaming Site',
      description: 'A collaborative, and A full-featured Movie Streaming platform with Best user-friendly UI, User Auth, and admin dashboard.',
      image: '/assets/orangeflix.png',
      technologies: ['Next.js', 'TypeScript', 'Tailwind', 'SupaBase', 'react','Html','css3'],
      liveUrl: 'https://orangeflixx.vercel.app/',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development'
    },
    {
      title: 'Music Streaming Interface',
      description: 'A modern music streaming interface design with intuitive navigation and beautiful visualizations.',
      image: '/assets/archive.png',
      technologies: ['Chtgpt','suno ai', 'leornord.ai','runway.ai' ,'After Effects'],
      liveUrl: 'https://www.youtube.com/@ashola-1',
      githubUrl: '#',
      type: 'UI/UX Design'
    },
    {
      title: 'Tour booking & Exploring',
      description: 'A responsive Tour booking & Exploring website with full tour showcase, full function booking, smooth animations and modern design.',
      image: '/assets/tour.png',
      technologies: ['React', 'Html','Css3','web3','Typescript','Nexr.js','Tailwind CSS', 'Vite'],
      liveUrl: 'https://winning4tours.com',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development'
    },
    {
      title: 'Consulting Platform',
      description: 'A responsive Consluring Platform, Showcasing all service offerd, Containing different fully working forms, and best animations',
      image: '/assets/bright.png',
      technologies: ['react', 'typscript', 'Next.js','js', 'Html','Css3'],
      liveUrl: 'https://bright-bridge.vercel.app',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development'
    },
    {
      title: 'Online learning Platform',
      description: 'A responsive web site for online learning with user auth, user-friendly UI, and other more tech.',
      image: '/assets/twigane-class.png',
      technologies: ['SupaBase', 'react', 'js','Html','Css3', 'Node.js', 'Next.js', 'vite'],
      liveUrl: 'https://twigane-class.vercel.app',
      githubUrl: 'https://github.com/GILBERT-Tuyambaze/',
      type: 'Web Development'
    }
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
