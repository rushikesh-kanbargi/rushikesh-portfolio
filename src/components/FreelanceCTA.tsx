import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FreelanceCTA() {
  return (
    <section className="relative py-20 overflow-hidden z-10">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel rounded-3xl p-10 md:p-16 relative overflow-hidden"
        >
          {/* Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-electric-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left max-w-2xl">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="bg-gold-500/20 p-2 rounded-full">
                  <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
                </div>
                <span className="font-bold uppercase tracking-wider text-sm text-gold-400">Open for Business</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-white leading-tight">
                Available for High-Impact <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Freelance Projects</span>
              </h2>
              <p className="text-gray-300 font-light text-lg leading-relaxed">
                Proven track record successfully delivering freelance projects for various clients globally.
                Let's build something extraordinary together.
              </p>
            </div>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 bg-white text-navy-900 px-10 py-5 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all whitespace-nowrap"
            >
              Hire Me Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
