import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import FreelanceCTA from './components/FreelanceCTA';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Footer from './components/Footer';
import GlobalBackground3D from './components/GlobalBackground3D';

function App() {
  return (
    <GlobalBackground3D>
      <div className="min-h-screen text-white selection:bg-electric-blue-500 selection:text-navy-900">
        <Navbar />
        <Hero3D />
        <FreelanceCTA />
        <Skills />
        <Experience />
        <Projects />
        <Footer />
      </div>
    </GlobalBackground3D>
  );
}

export default App;
