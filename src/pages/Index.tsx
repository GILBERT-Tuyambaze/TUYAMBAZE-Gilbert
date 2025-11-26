import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';



export default function Index() {
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
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
