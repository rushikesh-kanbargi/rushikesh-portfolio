import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { viewportOnce } from '../lib/motion';

export default function FreelanceCTA() {
  return (
    <section className="py-20 md:py-28 relative z-10">
      <div className="content-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="text-center md:text-left">
            <p className="text-gold-400 font-medium text-sm mb-2">Open for work</p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
              Available for <span className="text-gradient-gold">High-Impact Freelance</span> Projects
            </h2>
            <p className="text-slate-400 max-w-xl">
              I've delivered projects for clients globally. Let's build something great together.
            </p>
          </div>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 font-semibold hover:from-gold-300 hover:to-gold-500 transition-colors shrink-0"
          >
            Read More
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
