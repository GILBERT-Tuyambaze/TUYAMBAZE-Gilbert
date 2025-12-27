import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import PWAInstallBanner from '@/components/PWAInstallBanner'



export default function Index() {
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Main content with proper spacing for fixed nav */}
      <main className="relative">
        <Hero />
        <About />
        <Services />
        <Projects />
        <Gallert />
        <Contact />
        <PWAInstallBanner />
      </main>
      
      <Footer />
    </div>
  );
}
