import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";

export default function Index(Component, pageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
      {/* Main content with proper spacing for fixed nav */}
      <main className="relative">
        <Hero />
        <About />
        <Services />
        <Projects />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}
