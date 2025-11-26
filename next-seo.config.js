// next-seo.config.js
const defaultSEOConfig = {
  title: "Gilbert Tuyambaze | Web Developer, Designer & Music Producer",
  description:
    "Portfolio of Gilbert Tuyambaze – a passionate full-stack web developer, UI/UX designer, and music producer based in Kigali, Rwanda. Explore my work, projects, and creative journey.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tuyambaze-gilbert.vercel.app/",
    site_name: "Gilbert Tuyambaze Portfolio",
    title: "Gilbert Tuyambaze | Web Developer, Designer & Music Producer",
    description:
      "Explore my projects in web development, design, and music production.",
    images: [
      {
        url: "https://tuyambaze-gilbert.vercel.app/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gilbert Tuyambaze Portfolio",
      },
    ],
  },
  twitter: {
    handle: "@tuyambazegilbert",
    site: "@tuyambazegilbert",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "keywords",
      content:
        "Gilbert Tuyambaze, web developer Rwanda, full-stack developer, UI/UX designer, Next.js portfolio, TypeScript developer, Kigali developer",
    },
    {
      name: "author",
      content: "Gilbert Tuyambaze",
    },
  ],
};

export default defaultSEOConfig;
