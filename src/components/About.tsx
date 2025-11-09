import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Palette, Music, GraduationCap, Award, Users } from 'lucide-react';
import { revealElements } from '@/hooks/useScrollReveal';

export default function About() {
  useEffect(() => {
    // About section animations
    revealElements('.about-title', { 
      origin: 'top', 
      distance: '60px', 
      duration: 1000,
      reset: true,
      delay: 200 
    });
    
    revealElements('.about-description', { 
      origin: 'bottom', 
      distance: '40px', 
      duration: 800,
      reset: true,
      delay: 400 
    });
    
    revealElements('.about-card', { 
      origin: 'bottom', 
      distance: '80px', 
      duration: 1000,
      delay: 200,
      reset: true,
      interval: 200 
    });
    
    revealElements('.skill-badge', { 
      origin: 'left', 
      distance: '40px', 
      duration: 600,
      delay: 600,
      reset: true,
      interval: 50 
    });
    
    revealElements('.education-item', { 
      origin: 'right', 
      distance: '60px', 
      duration: 800,
      delay: 400,
      reset: true,
      interval: 150, 
    });
  }, []);

  

  const skills = [
    'React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'JavaScript',
    'HTML5', 'CSS3', 'Tailwind CSS', 'Git','PHP','JAVA',
    'Adobe Creative Suite'
  ];

  const expertise = [
    {
      icon: Code,
      title: 'Frontend Development',
      description: 'Building responsive and interactive user interfaces with modern frameworks and libraries.',
      color: 'text-blue-500'
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Creating beautiful and intuitive designs that enhance user experience and engagement.',
      color: 'text-purple-500'
    },
    {
      icon: Music,
      title: 'Music Production',
      description: 'Producing high-quality music and audio content for various media and entertainment projects.',
      color: 'text-pink-500'
    }
  ];

  const education = [
    {
      degree: 'Bachelor of Computer Science & Applied Physics',
      institution: 'University of Technology',
      year: '2025-now',
      icon: GraduationCap
    },
    {
      degree: 'Full Stack Web Development',
      institution: 'Coding Bootcamp',
      year: '2024-2025',
      icon: Award
    },
    {
      degree: 'Music Production Certificate',
      institution: 'Audio Institute',
      year: '2024',
      icon: Music
    }
  ];

  return (
    <section id="about" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="about-title text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            About <span className="text-primary">Me</span>
          </h2>
          <p className="about-description text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            I'm a passionate developer and creative professional with expertise in web development, 
            design, and music production. I love turning ideas into reality through code and creativity.
          </p>
        </div>

        {/* Expertise Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {expertise.map((item, index) => (
            <Card key={index} className="about-card group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className={`inline-flex p-4 rounded-full bg-muted mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Skills */}
          <div>
            <h3 className="about-title text-2xl font-bold mb-8 flex items-center gap-3">
              <Code className="w-6 h-6 text-primary" />
              Technical Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="skill-badge px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="about-title text-2xl font-bold mb-8 flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-primary" />
              Education & Certifications
            </h3>
            <div className="space-y-6">
              {education.map((item, index) => (
                <div key={index} className="education-item flex items-start gap-4 p-4 rounded-lg bg-background/50 hover:bg-background transition-colors">
                  <div className="p-2 rounded-full bg-primary/10">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{item.degree}</h4>
                    <p className="text-muted-foreground">{item.institution}</p>
                    <p className="text-sm text-primary font-medium">{item.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
