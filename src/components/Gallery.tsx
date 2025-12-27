import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ZoomIn } from 'lucide-react';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryItems = [
    // PERSONAL IMAGES (add your own files into public/assets/)
    {
      title: 'Portrait — Gilbert',
      category: 'Personal',
      description: 'Profile portrait of Tuyambaze Gilbert (web developer).',
      image: '/public/images/gilbert-tuyambaze-dark.jpeg',
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
      image: '/public/images/gilbert-tuyambaze-light.jpeg',
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
      title: 'Business card',
      category: 'Personal',
      description: 'Business cardfor personal branding.',
      image: '/public/images/Bussiness-card-TUYAMBAZE-Gilbert.png',
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
      title: 'Personal Portfolio Website',
      category: 'Frontend',
      description:
        'Modern and responsive portfolio built with React, Tailwind CSS, and animations for smooth user experience.',
      image: '/assets/portfolio.png',
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
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Project Gallery
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A visual showcase of my work as a web developer, from concept to
            production — including personal shots for branding.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Card
                  className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white text-center p-4">
                        <ZoomIn className="w-12 h-12 mx-auto mb-2" />
                        <p className="font-semibold">View Details</p>
                      </div>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm">
                      {item.category}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-4xl">
                {/* If the item is a personal image, show contact + bio layout */}
                {item.personal ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full rounded-lg object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold">
                            {item.personal.name}
                          </h3>
                          <Badge>{item.category}</Badge>
                        </div>

                        <p className="text-muted-foreground mb-4">
                          <span className="font-semibold">{item.personal.role}</span>
                          <br />
                          {item.personal.bio}
                        </p>

                        <div className="space-y-2">
                          <div>
                            <strong>Email:</strong>{' '}
                            <a
                              href={`mailto:${item.personal.email}`}
                              className="underline"
                            >
                              {item.personal.email}
                            </a>
                          </div>
                          <div>
                            <strong>Website:</strong>{' '}
                            <a
                              href={item.personal.website}
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              {item.personal.website}
                            </a>
                          </div>
                          <div>
                            <strong>GitHub:</strong>{' '}
                            <a
                              href={item.personal.github}
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              {item.personal.github}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Default project dialog
                  <div className="space-y-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full rounded-lg"
                    />
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{item.title}</h3>
                        <Badge>{item.category}</Badge>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground italic">
            * Images represent web development projects and personal branding
            portraits.
          </p>
        </div>
      </div>
    </section>
  );
}

