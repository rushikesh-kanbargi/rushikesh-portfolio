import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { viewportOnce } from '../lib/motion';

const projects = [
  {
    title: 'AI-Powered PPT Builder',
    description: 'AI-driven tool that scans internal drives and auto-generates consolidated presentations from multiple PPTs. Placed 2nd in Hackathon.',
    tags: ['AI', 'Python', 'Automation', 'React'],
    image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&q=80&fit=crop',
    imageAlt: 'Presentation slides and AI automation',
    link: '#',
    github: '#',
  },
  {
    title: 'Sign Language Interpreter',
    description: 'Model for real-time sign language detection between deaf and hearing users, with audio API for speech conversion.',
    tags: ['Python', 'OpenCV', 'Machine Learning', 'Audio API'],
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&q=80&fit=crop',
    imageAlt: 'Hands communicating with sign language',
    link: '#',
    github: '#',
  },
  {
    title: 'Threat Analysis Tool (TARA)',
    description: 'Web-based cybersecurity tool for vulnerability assessment, attack path modeling, and ISO 21434-compliant risk scoring.',
    tags: ['React', 'React Flow', 'Node.js', 'Cybersecurity'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80&fit=crop',
    imageAlt: 'Cybersecurity and digital lock concept',
    link: '#',
    github: '#',
  },
  {
    title: 'Cidaas IAM Solution',
    description: 'Cloud Identity & Access Management with OAuth 2.0, OpenID Connect, SSO, and MFA.',
    tags: ['Angular', 'OAuth 2.0', 'Security', 'SaaS'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&fit=crop',
    imageAlt: 'Global network and cloud connectivity',
    link: '#',
    github: '#',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32 relative z-10">
      <div className="content-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-[auto_1fr] gap-12 md:gap-20 mb-16"
        >
          <h2 className="section-heading font-mono text-lg md:text-xl">
            <span className="text-white/40 font-sans font-normal mr-2">04.</span>
            Featured <span className="text-gradient-gold">Projects</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl">
            A selection of recent work—full-stack, AI, and security.
          </p>
        </motion.div>

        <ul className="grid md:grid-cols-2 gap-6 list-none p-0 m-0">
          {projects.map((project, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              className="group rounded-xl overflow-hidden border border-white/5 bg-slate-900/30 hover:border-electric-blue-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[0_0_32px_rgba(0,215,230,0.08)]"
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.imageAlt ?? project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={project.link}
                    className="p-2 rounded-lg bg-white/10 backdrop-blur text-white hover:bg-electric-blue-500 hover:text-navy-900 transition-colors"
                    aria-label="View project"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={project.github}
                    className="p-2 rounded-lg bg-white/10 backdrop-blur text-white hover:bg-white hover:text-navy-900 transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-electric-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-mono text-electric-blue-400/90 bg-electric-blue-500/10 rounded border border-electric-blue-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
