import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import PWAInstallBanner from '@/components/PWAInstallBanner';
import CyberConsole from '@/components/CyberConsole';
import CustomCursor from '@/components/CustomCursor';



export default function Index() {
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <CyberConsole />
      <CustomCursor />

      {/* Main content with proper spacing for fixed nav */}
      <main className="relative">
        <Hero />
        <About />
        <Services />
        <Projects />
        <Gallery />
        <Contact />
        <PWAInstallBanner />
      </main>
      
      <Footer />
    </div>
  );
}
