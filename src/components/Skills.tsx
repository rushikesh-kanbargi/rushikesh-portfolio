import { motion } from 'framer-motion';
import { Layout, Server, Smartphone, Terminal } from 'lucide-react';

const skills = [
  { name: 'Top Skills', icon: Layout, items: ['Artificial Neural Networks', 'Neural Networks', 'Image Processing', 'Full Stack Development', 'CI/CD'] },
  { name: 'Frontend & Frameworks', icon: Smartphone, items: ['Angular', 'ReactJS', 'NextJS', 'VueJS', 'Tailwind', 'Material UI', 'Bootstrap', 'RxJS/NgRx'] },
  { name: 'Backend & Database', icon: Server, items: ['Node.js', 'Express.js', 'Python3', 'Java', 'MongoDB', 'PostgreSQL', 'Firebase', 'SQL/NoSQL'] },
  { name: 'Tools & Platforms', icon: Terminal, items: ['Git', 'Docker', 'AWS', 'VS Code', 'Postman', 'Zoho Suite', 'Browser Stack'] },
];

export default function Skills() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="skills" className="py-32 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            Technical <span className="text-gradient-gold">Expertise</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            A comprehensive toolset for building scalable, high-performance digital solutions.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              variants={item}
              className="glass-card p-8 rounded-2xl group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-electric-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-electric-blue-500/20 transition-colors duration-500"></div>
              
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-inner">
                <skill.icon className="w-7 h-7 text-gold-400" />
              </div>
              
              <h3 className="text-xl font-bold mb-6 font-display">{skill.name}</h3>
              <ul className="space-y-3">
                {skill.items.map((item) => (
                  <li key={item} className="text-gray-400 text-sm flex items-center gap-3 group/item">
                    <span className="w-1.5 h-1.5 bg-electric-blue-500/50 rounded-full group-hover/item:bg-electric-blue-400 group-hover/item:shadow-[0_0_8px_rgba(56,189,248,0.8)] transition-all"></span>
                    <span className="group-hover/item:text-gray-200 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-10 rounded-3xl"
          >
            <h3 className="text-2xl font-display font-bold mb-8 text-white flex items-center gap-3">
              <span className="text-gradient-gold">Education</span>
            </h3>
            <div className="relative pl-6 border-l-2 border-white/10">
              <div className="absolute top-0 left-[-5px] w-2.5 h-2.5 bg-gold-500 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
              <h4 className="text-xl font-bold text-white mb-1">Gogte Institute of Technology, Belgaum</h4>
              <p className="text-electric-blue-400 font-medium mb-2">Bachelor of Engineering - BE, CSE</p>
              <p className="text-gray-500 text-sm font-mono">2018 - 2021</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-10 rounded-3xl"
          >
            <h3 className="text-2xl font-display font-bold mb-8 text-white flex items-center gap-3">
              <span className="text-gradient-gold">Certifications</span>
            </h3>
            <ul className="space-y-5">
              {[
                'Linguaskill - Cambridge English',
                'Data Mining',
                'THE NUTS AND BOLTS OF OAUTH 2.0'
              ].map((cert, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-300 group">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-gold-500/50 transition-colors">
                    <span className="text-gold-500 text-xs font-bold">{i + 1}</span>
                  </div>
                  <span className="group-hover:text-white transition-colors">{cert}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
