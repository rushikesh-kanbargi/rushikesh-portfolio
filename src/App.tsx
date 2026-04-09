import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import Hero3D from './components/Hero3D';
import About from './components/About';
import FreelanceCTA from './components/FreelanceCTA';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Footer from './components/Footer';
import SectionDivider from './components/SectionDivider';
import TerminalBlock from './components/TerminalBlock';
import Confetti from './components/Confetti';
import ShortcutsModal from './components/ShortcutsModal';
import GlobalBackground3D from './components/GlobalBackground3D';
import LoadingScreen from './components/LoadingScreen';
import CursorGlow from './components/CursorGlow';
import { useKonamiCode } from './hooks/useKonamiCode';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import ResumeBuilder from './resume-builder/ResumeBuilder';
import { ToolsPage } from './pages/ToolsPage';
import SeoHead from './components/SeoHead';
import { AppLayout } from './layouts/AppLayout';

const portfolioSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': 'https://rushikesh-portfolio-delta.vercel.app/#profilepage',
    url: 'https://rushikesh-portfolio-delta.vercel.app/',
    name: 'Rushikesh Kanbargi — Senior Software Development Engineer',
    mainEntity: {
      '@type': 'Person',
      '@id': 'https://rushikesh-portfolio-delta.vercel.app/#person',
      name: 'Rushikesh Kanbargi',
      jobTitle: 'Senior Software Development Engineer',
      description: 'Senior Software Development Engineer with 5+ years building React, TypeScript, and Node.js applications. Specializing in OAuth 2.0/OIDC, automotive cybersecurity tooling, and scalable full-stack systems.',
      url: 'https://rushikesh-portfolio-delta.vercel.app/',
      sameAs: [
        'https://github.com/rushikesh-kanbargi',
        'https://www.linkedin.com/in/rushikesh-kanbargi',
      ],
      worksFor: { '@type': 'Organization', name: 'Vayavya Labs Pvt. Ltd.' },
      knowsAbout: ['React', 'TypeScript', 'Node.js', 'OAuth 2.0', 'OpenID Connect', 'Cybersecurity', 'Full Stack Development'],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://rushikesh-portfolio-delta.vercel.app/#website',
    url: 'https://rushikesh-portfolio-delta.vercel.app/',
    name: 'Rushikesh Kanbargi Portfolio',
    description: 'Senior Software Development Engineer portfolio — React, TypeScript, OAuth 2.0, and full-stack development.',
    author: { '@id': 'https://rushikesh-portfolio-delta.vercel.app/#person' },
  },
];

function Portfolio() {
  const [confetti, setConfetti] = useState(false);
  useKonamiCode(useCallback(() => setConfetti(true), []));
  const { showHelp, setShowHelp } = useKeyboardShortcuts();

  return (
    <GlobalBackground3D>
      <SeoHead
        title="Rushikesh Kanbargi — Senior Software Development Engineer"
        description="Senior SDE with 5+ years building React, TypeScript & Node.js applications. Specializing in OAuth 2.0/OIDC, automotive cybersecurity tooling, and scalable full-stack systems. Open to senior roles globally."
        path="/"
        schema={portfolioSchema}
      />
      <Confetti active={confetti} onComplete={() => setConfetti(false)} />
      <ShortcutsModal open={showHelp} onClose={() => setShowHelp(false)} />
      <div className="scanlines-overlay min-h-screen text-white selection:bg-electric-blue-500 selection:text-navy-900 lg:pl-[min(180px,18vw)]">
        <a
          href="#about"
          className="skip-link focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-electric-blue-500 focus:text-navy-900 focus:rounded focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to Content
        </a>
        <Navbar />
        <ScrollProgress />
        <Hero3D />
        <main id="main-content">
          <About />
          <TerminalBlock />
          <SectionDivider />
          <FreelanceCTA />
          <SectionDivider />
          <Skills />
          <SectionDivider />
          <Experience />
          <SectionDivider />
          <Projects />
          <SectionDivider />
          <Footer onShowShortcuts={() => setShowHelp(true)} />
        </main>
      </div>
    </GlobalBackground3D>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <CursorGlow />
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route element={<AppLayout />}>
          <Route path="/tools/*" element={<ToolsPage />} />
          <Route path="/resume-builder/*" element={<ResumeBuilder />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
