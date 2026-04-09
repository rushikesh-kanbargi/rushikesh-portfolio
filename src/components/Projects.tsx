import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { viewportOnce } from '../lib/motion';

const projects = [
  {
    title: 'AI-Powered PPT Builder',
    code: 'PRJ_001',
    description: 'AI-driven tool that scans internal drives and auto-generates consolidated presentations from multiple PPTs. Placed 2nd in Hackathon.',
    tags: ['AI', 'Python', 'Automation', 'React'],
    image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&q=80&fit=crop',
    accent: '#a78bfa',
    link: '#',
    github: '#',
  },
  {
    title: 'Sign Language Interpreter',
    code: 'PRJ_002',
    description: 'Real-time sign language detection between deaf and hearing users, with audio API for speech conversion.',
    tags: ['Python', 'OpenCV', 'Machine Learning', 'Audio API'],
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&q=80&fit=crop',
    accent: '#34d399',
    link: '#',
    github: '#',
  },
  {
    title: 'Threat Analysis Tool (TARA)',
    code: 'PRJ_003',
    description: 'Web-based cybersecurity tool for vulnerability assessment, attack path modeling, and ISO 21434-compliant risk scoring.',
    tags: ['React', 'React Flow', 'Node.js', 'Cybersecurity'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80&fit=crop',
    accent: '#00f3ff',
    link: '#',
    github: '#',
  },
  {
    title: 'Cidaas IAM Solution',
    code: 'PRJ_004',
    description: 'Cloud Identity & Access Management with OAuth 2.0, OpenID Connect, SSO, and MFA.',
    tags: ['Angular', 'OAuth 2.0', 'Security', 'SaaS'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&fit=crop',
    accent: '#fbbf24',
    link: '#',
    github: '#',
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 30 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative list-none"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full"
      >
        {/* Glow halo behind card */}
        <div
          className="absolute -inset-px rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md pointer-events-none"
          style={{ background: `${project.accent}25` }}
        />

        {/* Animated border gradient */}
        <div
          className="absolute inset-0 rounded-sm p-px opacity-40 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${project.accent}60, transparent 50%, ${project.accent}30)`,
          }}
        />

        <div
          className="relative cyber-card overflow-hidden h-full flex flex-col bg-slate-950/90"
          style={{ borderRadius: '3px' }}
        >
          {/* Image */}
          <div className="aspect-video overflow-hidden relative flex-shrink-0">
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* Scan-line shimmer on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,243,255,0.015) 2px, rgba(0,243,255,0.015) 4px)`,
              }}
            />

            {/* Accent tint on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `radial-gradient(ellipse at center, ${project.accent}18 0%, transparent 70%)` }}
            />

            {/* Code badge top-left */}
            <div className="absolute top-3 left-3">
              <span
                className="font-mono text-[9px] px-2 py-1 tracking-widest"
                style={{
                  border: `1px solid ${project.accent}50`,
                  color: `${project.accent}90`,
                  background: 'rgba(2,6,23,0.85)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                {project.code}
              </span>
            </div>

            {/* Icon buttons top-right */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              {project.github !== '#' && (
                <a
                  href={project.github}
                  className="p-2 backdrop-blur-sm border border-white/20 bg-slate-950/80 text-slate-300 hover:text-white hover:border-white/50 transition-all"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))' }}
                  aria-label="GitHub"
                  target="_blank" rel="noopener noreferrer"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {project.link !== '#' && (
                <a
                  href={project.link}
                  className="p-2 backdrop-blur-sm border border-white/20 bg-slate-950/80 text-slate-300 hover:text-white hover:border-white/50 transition-all"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))' }}
                  aria-label="View project"
                  target="_blank" rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1" style={{ borderTop: `1px solid ${project.accent}18` }}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3
                className="font-mono font-bold text-white text-base leading-snug transition-colors duration-300 group-hover:text-[var(--accent)]"
                style={{ '--accent': project.accent } as React.CSSProperties}
              >
                {project.title}
              </h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[11px] font-mono"
                  style={{
                    border: `1px solid ${project.accent}25`,
                    color: `${project.accent}70`,
                    background: `${project.accent}08`,
                    clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Slide-up CTA bar */}
          <div className="max-h-0 overflow-hidden group-hover:max-h-[44px] transition-all duration-300 ease-out">
            <div
              className="flex items-center justify-between px-5 py-3 font-mono text-xs"
              style={{
                borderTop: `1px solid ${project.accent}20`,
                background: `${project.accent}06`,
                color: `${project.accent}80`,
              }}
            >
              <span className="tracking-widest">VIEW_PROJECT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.li>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-28 md:py-36 relative z-10">
      <div className="content-max">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-[260px_1fr] gap-8 md:gap-24 mb-16"
        >
          <div className="shrink-0">
            <p className="terminal-label mb-3">MODULE_04</p>
            <h2 className="font-display font-black leading-none tracking-tighter"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              <span className="text-white/20 font-mono font-normal text-base block mb-1">04.</span>
              Featured{' '}
              <span className="text-gradient-gold">Projects</span>
            </h2>
            <div className="mt-6 w-px h-24 bg-gradient-to-b from-gold-500/40 to-transparent" />
          </div>
          <div className="self-end">
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              A selection of recent work — full-stack, AI, and security.
            </p>
          </div>
        </motion.div>

        <ul className="grid md:grid-cols-2 gap-6 list-none p-0 m-0">
          {projects.map((project, i) => (
            <ProjectCard key={project.code} project={project} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
