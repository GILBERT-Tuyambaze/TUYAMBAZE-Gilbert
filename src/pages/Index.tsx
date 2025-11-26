import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Head from 'next/head';


export default function Index() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Gilbert Tuyambaze",
    jobTitle: "Full-Stack Developer, Designer & Music Producer",
    url: "https://tuyambaze-gilbert.vercel.app",
    sameAs: [
      "https://github.com/GILBERT-Tuyambaze",
      "https://www.linkedin.com/in/gilbert-tuyambaze-6927ba336/",
      "mailto:tuyambazegilbert05@gmail.com"
    ],
    worksFor: {
      "@type": "Organization",
      name: "Freelance / Independent",
    },
  };
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
