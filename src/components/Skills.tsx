import { motion } from 'framer-motion';
import { Layout, Server, Smartphone, Terminal } from 'lucide-react';
import { viewportOnce } from '../lib/motion';

const skills = [
  { name: 'Top Skills', icon: Layout, items: ['Artificial Neural Networks', 'Neural Networks', 'Image Processing', 'Full Stack Development', 'CI/CD'] },
  { name: 'Frontend & Frameworks', icon: Smartphone, items: ['Angular', 'ReactJS', 'NextJS', 'VueJS', 'Tailwind', 'Material UI', 'Bootstrap', 'RxJS/NgRx'] },
  { name: 'Backend & Database', icon: Server, items: ['Node.js', 'Express.js', 'Python3', 'Java', 'MongoDB', 'PostgreSQL', 'Firebase', 'SQL/NoSQL'] },
  { name: 'Tools & Platforms', icon: Terminal, items: ['Git', 'Docker', 'AWS', 'VS Code', 'Postman', 'Zoho Suite', 'Browser Stack'] },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 relative z-10">
      <div className="content-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-[auto_1fr] gap-12 md:gap-20 mb-16"
        >
          <h2 className="section-heading font-mono text-lg md:text-xl">
            <span className="text-white/40 font-sans font-normal mr-2">02.</span>
            Technical <span className="text-gradient-gold">Expertise</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl">
            A focused set of technologies I use to ship scalable, high-quality products.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="p-6 rounded-xl border border-white/5 bg-slate-900/30 hover:border-gold-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                  <skill.icon className="w-5 h-5 text-gold-400" />
                </div>
                <h3 className="font-display font-bold text-white">{skill.name}</h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <li
                    key={item}
                    className="px-3 py-1 rounded-full text-sm text-slate-400 bg-white/5 border border-white/5"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl border border-white/5 bg-slate-900/30"
          >
            <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-gold-500 font-mono text-sm">Edu</span>
              Education
            </h3>
            <div className="pl-4 border-l-2 border-gold-500/30">
              <h4 className="font-semibold text-white">Gogte Institute of Technology, Belgaum</h4>
              <p className="text-gold-400/90 text-sm font-medium">BE, Computer Science & Engineering</p>
              <p className="text-slate-500 text-sm font-mono mt-1">2018 – 2021</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl border border-white/5 bg-slate-900/30"
          >
            <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-gold-500 font-mono text-sm">Cert</span>
              Certifications
            </h3>
            <ul className="space-y-2">
              {['Linguaskill (Cambridge English)', 'Data Mining', 'OAuth 2.0 – Nuts and Bolts'].map((cert) => (
                <li key={cert} className="text-slate-400 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  {cert}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
