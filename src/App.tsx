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
import { useKonamiCode } from './hooks/useKonamiCode';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import ResumeBuilder from './resume-builder/ResumeBuilder';
import { ToolsPage } from './pages/ToolsPage';

function Portfolio() {
  const [confetti, setConfetti] = useState(false);
  useKonamiCode(useCallback(() => setConfetti(true), []));
  const { showHelp, setShowHelp } = useKeyboardShortcuts();

  return (
    <GlobalBackground3D>
      <Confetti active={confetti} onComplete={() => setConfetti(false)} />
      <ShortcutsModal open={showHelp} onClose={() => setShowHelp(false)} />
      <div className="min-h-screen text-white selection:bg-electric-blue-500 selection:text-navy-900 lg:pl-[min(180px,18vw)]">
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

import { AppLayout } from './layouts/AppLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      
      {/* App Platform Routes */}
      <Route element={<AppLayout />}>
        <Route path="/tools/*" element={<ToolsPage />} />
        <Route path="/resume-builder/*" element={<ResumeBuilder />} />
      </Route>
    </Routes>
  );
}

export default App;
