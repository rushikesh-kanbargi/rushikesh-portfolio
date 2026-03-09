import { motion } from 'framer-motion';
import { viewportOnce, staggerContainer, staggerItem } from '../lib/motion';

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 relative z-10">
      <div className="content-max">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid md:grid-cols-[auto_1fr] gap-12 md:gap-20 items-start"
        >
          <motion.h2 variants={staggerItem} className="section-heading font-mono text-lg md:text-xl">
            <span className="text-white/40 font-sans font-normal mr-2">01.</span>
            <span className="text-gradient-gold">About</span>
          </motion.h2>
          <motion.div variants={staggerContainer} className="space-y-6 text-slate-300 leading-relaxed">
            <motion.p variants={staggerItem} className="text-lg md:text-xl">
              I'm a <span className="text-white font-medium">Senior Software Engineer</span> with a focus on
              building high-performance web applications, from pixel-perfect UIs to scalable backends.
              I work at the intersection of design and engineering—where great UX meets clean, maintainable code.
            </motion.p>
            <motion.p variants={staggerItem}>
              Currently at <span className="text-electric-blue-400">Vayavya Labs</span>, I design and develop
              web-based cybersecurity tools, interactive React Flow dashboards, and AI-powered APIs.
              I've previously shipped products at Space Matrix, Widas Concepts, and contributed to
              identity & access management (OAuth 2.0, OIDC, SSO, MFA).
            </motion.p>
            <motion.p variants={staggerItem}>
              When I'm not coding, I enjoy exploring new tech, contributing to open source, and
              building side projects—like this portfolio with its 3D background.
            </motion.p>
            <motion.div variants={staggerItem} className="pt-4">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded border border-electric-blue-500/50 text-electric-blue-400 hover:bg-electric-blue-500/10 transition-colors font-medium text-sm"
              >
                View résumé
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
