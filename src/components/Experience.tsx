import { motion } from 'framer-motion';
import { viewportOnce } from '../lib/motion';

const experiences = [
  {
    role: 'Senior Software Engineer',
    company: 'Vayavya Labs Pvt. Ltd.',
    period: 'Oct 2024 – Present',
    description: 'Designed and developed a web-based Threat Analysis & Risk Assessment (TARA) tool. Built interactive React Flow dashboards and integrated AI-powered backend APIs. Implemented programmatic PDF exports and Stripe payment integration.',
  },
  {
    role: 'Senior Software Engineer',
    company: 'Space Matrix',
    period: 'May 2024 – Oct 2024',
    description: 'Spearheaded digital transformation, automating key financial and procurement processes (80% improvement). Owned technology development and delivery across multiple stacks and PaaS platforms.',
  },
  {
    role: 'Software Engineer',
    company: 'Space Matrix',
    period: 'Nov 2023 – Apr 2024',
    description: "Led redesign and refactoring of the company's official website with multi-language accessibility. Integrated GSAP and Framer Motion for engagement.",
  },
  {
    role: 'Software Developer',
    company: 'Widas Concepts India Private Limited',
    period: 'Oct 2021 – Nov 2023',
    description: 'Enhanced Cidaas (CIAM) with OAuth 2.0/OIDC, SSO, MFA, and consent management. Created Stoplight API docs and educational video content.',
  },
  {
    role: 'IoT Intern',
    company: 'Widas Concepts India Private Limited',
    period: 'Jul 2021 – Sep 2021',
    description: 'REST, Kafka, Docker; contributed to CIAM with OAuth 2.0, OpenID Connect (ISO27001 certified).',
  },
  {
    role: 'Internship Trainee',
    company: 'Tech Fortune Technologies',
    period: 'Jul 2020 – Sep 2020',
    description: 'Python and ML basics; delivered a small-scale ML project.',
  },
  {
    role: 'Web Development Intern',
    company: 'Computronics Belgaum',
    period: 'Nov 2017 – Apr 2018',
    description: 'Developed PHP-based web applications for clients.',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32 relative z-10">
      <div className="content-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-[auto_1fr] gap-12 md:gap-20 mb-16"
        >
          <h2 className="section-heading font-mono text-lg md:text-xl">
            <span className="text-white/40 font-sans font-normal mr-2">03.</span>
            Professional <span className="text-gradient-gold">Journey</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl">
            Where I've worked and what I shipped.
          </p>
        </motion.div>

        <div className="relative pl-0 md:pl-2">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-500/40 via-electric-blue-500/50 to-transparent rounded-full" />
          <ul className="space-y-6">
            {experiences.map((exp, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ delay: index * 0.04, duration: 0.35 }}
                className="relative pl-8 md:pl-10 group"
              >
                <span className="absolute left-0 top-6 w-3 h-3 rounded-full bg-electric-blue-500 border-2 border-slate-900 -translate-x-[7px] group-hover:bg-electric-blue-400 group-hover:shadow-[0_0_16px_rgba(0,215,230,0.9)] transition-all z-10" />
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 md:p-7 hover:border-gold-500/20 hover:bg-slate-800/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                    <h3 className="font-display font-bold text-white text-lg">{exp.role}</h3>
                    <span className="text-sm font-mono text-gold-400/90">{exp.period}</span>
                  </div>
                  <p className="text-gold-400/90 font-medium text-sm mb-3">{exp.company}</p>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">{exp.description}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
