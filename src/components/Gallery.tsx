
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ZoomIn } from 'lucide-react';
import { revealElements } from '@/hooks/useScrollReveal';

export default function Gallery() {
  useEffect(() => {
    revealElements('.gallery-title', {
      origin: 'top',
      distance: '60px',
      duration: 1000,
      delay: 200,
    });

    revealElements('.gallery-intro', {
      origin: 'bottom',
      distance: '40px',
      duration: 800,
      delay: 400,
    });

    revealElements('.gallery-card', {
      origin: 'bottom',
      distance: '80px',
      duration: 1000,
      interval: 200,
    });

    revealElements('.gallery-image', {
      origin: 'top',
      distance: '40px',
      duration: 800,
      scale: 0.9,
    });

    revealElements('.gallery-tech', {
      origin: 'bottom',
      distance: '30px',
      duration: 600,
      interval: 80,
    });
  }, []);

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryItems = [
    {
      title: 'Portrait — Gilbert',
      category: 'Personal',
      description: 'Profile portrait of Tuyambaze Gilbert.',
      image: '/images/gilbert-tuyambaze-dark.jpeg',
      personal: {
        name: 'Tuyambaze Gilbert',
        role: 'Frontend Web Developer',
        bio: 'I build modern, responsive web applications with React and Tailwind.',
        email: 'tuyambazegilbert05@gmail.com',
        website: 'https://tuyambaze-gilbert.vercel.app/',
        github: 'https://github.com/GILBERT-Tuyambaze',
      },
    },
    {
      title: 'Casual Portrait',
      category: 'Personal',
      description: 'Another portrait shot for personal branding.',
      image: '/images/gilbert-tuyambaze-light.jpeg',
      personal: {
        name: 'Tuyambaze Gilbert',
        role: 'Frontend Web Developer',
        bio: 'Passionate about clean UI and smooth interactions.',
        email: 'tuyambazegilbert05@gmail.com',
        website: 'https://tuyambaze-gilbert.vercel.app/',
        github: 'https://github.com/GILBERT-Tuyambaze',
      },
    },
    {
      title: 'Business Card',
      category: 'Personal',
      description: 'Business card for personal branding.',
      image: '/images/Bussiness-card-TUYAMBAZE-Gilbert.png',
      personal: {
        name: 'Tuyambaze Gilbert',
        role: 'Frontend Web Developer',
        bio: 'Clean, modern personal brand.',
        email: 'tuyambazegilbert05@gmail.com',
        website: 'https://tuyambaze-gilbert.vercel.app/',
        github: 'https://github.com/GILBERT-Tuyambaze',
      },
    },
{
      title: 'Business Landing Page',
      category: 'UI/UX',
      description:
        'Clean and conversion-focused landing page designed for small businesses and startups.',
      image:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    },
    {
      title: 'E-Commerce Web App',
      category: 'Full Stack',
      description:
        'Full-featured e-commerce platform with product management, cart, and secure checkout.',
      image:
        'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
    },
    {
      title: 'Admin Dashboard',
      category: 'Web App',
      description:
        'Interactive dashboard with charts, analytics, and role-based access control.',
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    },
    {
      title: 'Blog Platform',
      category: 'Frontend',
      description:
        'Responsive blog platform with markdown support and SEO-friendly structure.',
      image:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    },
    {
      title: 'API Integration Project',
      category: 'Technical',
      description:
        'REST API integration with authentication, error handling, and optimized data fetching.',
      image:
        '/assets/API-Integration-Diagram.png',
    },
    {
      title: 'UI Component Library',
      category: 'UI/UX',
      description:
        'Reusable UI components built with Tailwind and shadcn/ui for scalable projects.',
      image:
        'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80',
    },
  ];

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="gallery-title text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Project Gallery
            </span>
          </h2>
          <p className="gallery-intro text-lg text-muted-foreground max-w-2xl mx-auto">
            Projects and personal branding visuals.
          </p>
        </div>

        {/* GRID — PRESERVED */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Card
                  className="gallery-card group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-500"
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="gallery-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <ZoomIn className="w-10 h-10 text-white" />
                    </div>

                    <Badge className="absolute top-3 right-3 bg-primary/90">
                      {item.category}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>

              {/* POPUP HEIGHT FIXED */}
              <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                {item.personal ? (
                  <div className="grid md:grid-cols-2 gap-6 items-start">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 md:h-72 object-cover rounded-lg"
                    />

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">
                        {item.personal.name}
                      </h3>

                      <p className="gallery-tech text-muted-foreground">
                        <strong>{item.personal.role}</strong>
                        <br />
                        {item.personal.bio}
                      </p>

                      <div className="text-sm space-y-1">
                        <p>📧 {item.personal.email}</p>
                        <p>🌐 {item.personal.website}</p>
                        <p>💻 {item.personal.github}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-72 object-cover rounded-lg"
                    />
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
