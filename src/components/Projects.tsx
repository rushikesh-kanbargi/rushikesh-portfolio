import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'AI-Powered PPT Builder',
    description: 'Developed an AI-driven tool that scans internal drives and auto-generates consolidated presentations by extracting relevant content from multiple PPTs. Secured 2nd place in Hackathon.',
    tags: ['AI', 'Python', 'Automation', 'React'],
    image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?auto=format&fit=crop&q=80&w=800',
    link: '#',
    github: '#'
  },
  {
    title: 'Sign Language Interpreter',
    description: 'Designed a model to facilitate communication between deaf and hearing individuals using gesture recognition for real-time sign language detection. Integrated audio API for speech conversion.',
    tags: ['Python', 'OpenCV', 'Machine Learning', 'Audio API'],
    image: 'https://images.unsplash.com/photo-1555861496-0666c8981751?auto=format&fit=crop&q=80&w=800',
    link: '#',
    github: '#'
  },
  {
    title: 'Threat Analysis Tool (TARA)',
    description: 'Web-based cybersecurity tool for vulnerability assessment, attack path modeling, and ISO 21434-compliant risk scoring.',
    tags: ['React', 'React Flow', 'Node.js', 'Cybersecurity'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    link: '#',
    github: '#'
  },
  {
    title: 'Cidaas IAM Solution',
    description: 'Contributed to Cloud Identity & Access Management solution with OAuth 2.0, OpenID Connect, SSO, and MFA features.',
    tags: ['Angular', 'OAuth 2.0', 'Security', 'SaaS'],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    link: '#',
    github: '#'
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            Featured <span className="text-gradient-gold">Projects</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            A selection of recent work demonstrating technical depth and design precision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group glass-card rounded-3xl overflow-hidden relative"
            >
              <div className="aspect-video overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-60"></div>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Floating Actions */}
                <div className="absolute top-4 right-4 z-20 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <a href={project.link} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-gold-500 hover:text-navy-900 transition-colors border border-white/20">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <a href={project.github} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-navy-900 transition-colors border border-white/20">
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              <div className="p-8 relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-gold-400 transition-colors font-display">{project.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed font-light">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-4 py-1.5 bg-white/5 text-electric-blue-300 text-xs font-medium rounded-full border border-white/5 hover:border-electric-blue-500/30 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
