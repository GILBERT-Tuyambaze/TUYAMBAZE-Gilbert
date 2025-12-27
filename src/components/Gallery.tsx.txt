import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ZoomIn } from 'lucide-react';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryItems = [
    {
      title: 'Electrical Panel Installation',
      category: 'Commercial',
      description: 'Modern electrical panel configuration for hotel infrastructure',
      image: '/assets/equipment.png',
    },
    {
      title: 'Conduit System Design',
      category: 'Residential',
      description: 'Professional conduit installation for residential complex',
      image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80',
    },
    {
      title: 'Circuit Wiring',
      category: 'Technical',
      description: 'Precise electrical wiring and cable management',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
    },
    {
      title: 'Safety Inspection',
      category: 'Maintenance',
      description: 'Routine safety inspection and compliance check',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
    },
    {
      title: 'Hotel Infrastructure',
      category: 'Commercial',
      description: 'Electrical maintenance at Hotel des Mille Collines',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    },
    {
      title: 'Distribution System',
      category: 'Technical',
      description: 'Power distribution system configuration',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
    },
    {
      title: 'Lighting Installation',
      category: 'Commercial',
      description: 'Modern lighting system installation and setup',
      image: '/assets/light.jpg',
    },
    {
      title: 'Equipment Testing',
      category: 'Maintenance',
      description: 'Professional equipment testing and diagnostics',
      image: '/assets/about-image.jpg',
    },
    {
      title: 'Blueprint Analysis',
      category: 'Planning',
      description: 'Reviewing electrical schematics and blueprints',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    },
  ];

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Project Gallery</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A visual showcase of professional electrical engineering work and installations
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
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
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
              </DialogContent>
            </Dialog>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground italic">
            * Images represent professional electrical engineering work and installations
          </p>
        </div>
      </div>
    </section>
  );
}
