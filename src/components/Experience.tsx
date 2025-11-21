import { motion } from 'framer-motion';

const experiences = [
  {
    role: 'Senior Software Engineer',
    company: 'Vayavya Labs Pvt. Ltd.',
    period: 'October 2024 - Present',
    description: 'Designed and developed a web-based Threat Analysis & Risk Assessment (TARA) tool. Built interactive React Flow dashboards and integrated AI-powered backend APIs. Implemented programmatic PDF exports and Stripe payment integration.',
  },
  {
    role: 'Senior Software Engineer',
    company: 'Space Matrix',
    period: 'May 2024 - October 2024',
    description: 'Spearheaded digital transformation at the organizational level, automating key financial and procurement processes (80% improvement). Took ownership of technology development and delivery processes across multiple stacks and PaaS platforms.',
  },
  {
    role: 'Software Engineer',
    company: 'Space Matrix',
    period: 'November 2023 - April 2024',
    description: 'Led the redesign & refactoring of the company\'s official website, ensuring accessibility in multiple languages. Integrated GSAP and Framer Motion for enhanced user engagement.',
  },
  {
    role: 'Software Developer',
    company: 'Widas Concepts India Private Limited',
    period: 'October 2021 - November 2023',
    description: 'Enhanced Cidaas (CIAM) solution with OAuth 2.0/OIDC. Focused on SSO, MFA, and consent management. Created user-friendly Stoplight documentation for APIs and educational video content.',
  },
  {
    role: 'IoT Intern',
    company: 'Widas Concepts India Private Limited',
    period: 'July 2021 - September 2021',
    description: 'Worked on REST, Kafka, Docker, and contributed to CIAM with OAuth 2.0, OpenID Connect, ISO27001 certified.',
  },
  {
    role: 'Internship Trainee',
    company: 'Tech Fortune Technologies',
    period: 'July 2020 - September 2020',
    description: 'Learned Python and Machine Learning basics, applied knowledge in ML using Python, successfully completed a small-scale project.',
  },
  {
    role: 'Web Development Intern',
    company: 'Computronics Belgaum',
    period: 'November 2017 - April 2018',
    description: 'Made significant contributions to developing PHP-based web applications for clients.',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-32 relative overflow-hidden z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            Professional <span className="text-electric-blue-400">Journey</span>
          </h2>
        </motion.div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-electric-blue-500/50 before:to-transparent">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-electric-blue-500/30 bg-navy-900 group-[.is-active]:border-electric-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className="w-3 h-3 bg-electric-blue-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-8 rounded-2xl relative overflow-hidden group-hover:bg-slate-800/60 transition-all">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-electric-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h3 className="text-xl font-bold text-white font-display">{exp.role}</h3>
                  <span className="text-sm text-electric-blue-300 font-mono bg-electric-blue-500/10 px-3 py-1 rounded-full border border-electric-blue-500/20">{exp.period}</span>
                </div>
                <div className="text-gold-400 font-medium mb-4 text-lg">{exp.company}</div>
                <p className="text-gray-400 leading-relaxed font-light">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
