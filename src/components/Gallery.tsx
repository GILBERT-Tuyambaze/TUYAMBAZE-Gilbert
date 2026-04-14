'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ZoomIn } from 'lucide-react';
import { revealElements } from '@/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

export default function Gallery() {
  const { t } = useTranslation();
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
      titleKey: 'gallery.items.gilbertPortrait.title',
      descriptionKey: 'gallery.items.gilbertPortrait.description',
      category: 'personal',
      image: '/images/gilbert-tuyambaze-dark.jpeg',
      personal: {
        nameKey: 'gallery.items.gilbertPortrait.personal.name',
        nameDefault: 'Tuyambaze Gilbert',
        roleKey: 'gallery.items.gilbertPortrait.personal.role',
        roleDefault: 'Frontend Web Developer',
        bioKey: 'gallery.items.gilbertPortrait.personal.bio',
        bioDefault: 'I build modern, responsive web applications with React and Tailwind.',
        email: 'tuyambazegilbert05@gmail.com',
        website: 'https://tuyambaze-gilbert.vercel.app/',
        github: 'https://github.com/GILBERT-Tuyambaze',
      },
      titleDefault: 'Portrait - Gilbert',
      descriptionDefault: 'Profile portrait of Tuyambaze Gilbert.',
    },
    {
      titleKey: 'gallery.items.casualPortrait.title',
      descriptionKey: 'gallery.items.casualPortrait.description',
      category: 'personal',
      image: '/images/gilbert-tuyambaze-light.jpeg',
      personal: {
        nameKey: 'gallery.items.casualPortrait.personal.name',
        nameDefault: 'Tuyambaze Gilbert',
        roleKey: 'gallery.items.casualPortrait.personal.role',
        roleDefault: 'Frontend Web Developer',
        bioKey: 'gallery.items.casualPortrait.personal.bio',
        bioDefault: 'Passionate about clean UI and smooth interactions.',
        email: 'tuyambazegilbert05@gmail.com',
        website: 'https://tuyambaze-gilbert.vercel.app/',
        github: 'https://github.com/GILBERT-Tuyambaze',
      },
      titleDefault: 'Casual Portrait',
      descriptionDefault: 'Another portrait shot for personal branding.',
    },
    {
      titleKey: 'gallery.items.businessCard.title',
      descriptionKey: 'gallery.items.businessCard.description',
      category: 'personal',
      image: '/images/Bussiness-card-TUYAMBAZE-Gilbert.png',
      personal: {
        nameKey: 'gallery.items.businessCard.personal.name',
        nameDefault: 'Tuyambaze Gilbert',
        roleKey: 'gallery.items.businessCard.personal.role',
        roleDefault: 'Frontend Web Developer',
        bioKey: 'gallery.items.businessCard.personal.bio',
        bioDefault: 'Clean, modern personal brand.',
        email: 'tuyambazegilbert05@gmail.com',
        website: 'https://tuyambaze-gilbert.vercel.app/',
        github: 'https://github.com/GILBERT-Tuyambaze',
      },
      titleDefault: 'Business Card',
      descriptionDefault: 'Business card for personal branding.',
    },
    {
      titleKey: 'gallery.items.businessLanding.title',
      descriptionKey: 'gallery.items.businessLanding.description',
      category: 'uiux',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      titleDefault: 'Business Landing Page',
      descriptionDefault: 'Clean and conversion-focused landing page designed for small businesses and startups.',
    },
    {
      titleKey: 'gallery.items.ecommerceApp.title',
      descriptionKey: 'gallery.items.ecommerceApp.description',
      category: 'fullStack',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
      titleDefault: 'E-Commerce Web App',
      descriptionDefault: 'Full-featured e-commerce platform with product management, cart, and secure checkout.',
    },
    {
      titleKey: 'gallery.items.adminDashboard.title',
      descriptionKey: 'gallery.items.adminDashboard.description',
      category: 'webApp',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      titleDefault: 'Admin Dashboard',
      descriptionDefault: 'Interactive dashboard with charts, analytics, and role-based access control.',
    },
    {
      titleKey: 'gallery.items.blogPlatform.title',
      descriptionKey: 'gallery.items.blogPlatform.description',
      category: 'frontend',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
      titleDefault: 'Blog Platform',
      descriptionDefault: 'Responsive blog platform with markdown support and an SEO-friendly structure.',
    },
    {
      titleKey: 'gallery.items.apiIntegration.title',
      descriptionKey: 'gallery.items.apiIntegration.description',
      category: 'technical',
      image: '/assets/API-Integration-Diagram.png',
      titleDefault: 'API Integration Project',
      descriptionDefault: 'REST API integration with authentication, error handling, and optimized data fetching.',
    },
    {
      titleKey: 'gallery.items.uiLibrary.title',
      descriptionKey: 'gallery.items.uiLibrary.description',
      category: 'uiux',
      image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80',
      titleDefault: 'UI Component Library',
      descriptionDefault: 'Reusable UI components built with Tailwind and shadcn/ui for scalable projects.',
    },
  ];

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="gallery-title text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('gallery.title')}
            </span>
          </h2>
          <p className="gallery-intro text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('gallery.intro')}
          </p>
        </div>

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
                      alt={t(item.titleKey, { defaultValue: item.titleDefault })}
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="gallery-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <ZoomIn className="w-10 h-10 text-white" />
                    </div>

                    <Badge className="absolute top-3 right-3 bg-primary/90">
                      {t(`gallery.categories.${item.category}`)}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{t(item.titleKey, { defaultValue: item.titleDefault })}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {t(item.descriptionKey, { defaultValue: item.descriptionDefault })}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                {item.personal ? (
                  <div className="grid gap-6 md:grid-cols-2 md:items-start">
                    <img
                      src={item.image}
                      alt={t(item.titleKey, { defaultValue: item.titleDefault })}
                      loading="lazy"
                      decoding="async"
                      className="max-h-[60vh] w-full rounded-lg object-cover"
                    />

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">
                        {t(item.personal.nameKey, { defaultValue: item.personal.nameDefault })}
                      </h3>

                      <p className="gallery-tech text-muted-foreground">
                        <strong>{t(item.personal.roleKey, { defaultValue: item.personal.roleDefault })}</strong>
                        <br />
                        {t(item.personal.bioKey, { defaultValue: item.personal.bioDefault })}
                      </p>

                      <div className="text-sm space-y-2">
                        <p>Email: {item.personal.email}</p>
                        <p>
                          Website:{' '}
                          <a href={item.personal.website} target="_blank" rel="noopener noreferrer" className="underline">
                            {item.personal.website}
                          </a>
                        </p>
                        <p>
                          GitHub:{' '}
                          <a href={item.personal.github} target="_blank" rel="noopener noreferrer" className="underline">
                            {item.personal.github}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={item.image}
                      alt={t(item.titleKey, { defaultValue: item.titleDefault })}
                      loading="lazy"
                      decoding="async"
                      className="max-h-[60vh] w-full rounded-lg object-cover"
                    />
                    <h3 className="text-2xl font-bold">{t(item.titleKey, { defaultValue: item.titleDefault })}</h3>
                    <p className="text-muted-foreground">
                      {t(item.descriptionKey, { defaultValue: item.descriptionDefault })}
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
