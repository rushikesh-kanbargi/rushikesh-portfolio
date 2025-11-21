import { motion } from 'framer-motion';

export default function Hero3D() {
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Canvas removed to use global background */}

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="text-center px-4"
        >
          <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
            RUSHIKESH KANBARGI <br />
            <span className="text-gradient-gold">
              Senior SDE
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            Crafting <span className="text-electric-blue-400 font-medium">high-performance</span> web applications with precision and passion. 
            Full-stack expertise meets premium design.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center pointer-events-auto">
            <a href="#projects" className="px-10 py-4 bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 font-bold rounded-full hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all transform hover:scale-105 text-lg">
              View Projects
            </a>
            <a href="#contact" className="px-10 py-4 glass-panel text-white font-bold rounded-full hover:bg-white/10 hover:border-electric-blue-500/50 transition-all transform hover:scale-105 text-lg backdrop-blur-md">
              Contact Me
            </a>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-500">
        <span className="text-xs uppercase tracking-[0.3em] text-electric-blue-500/70">Scroll to Explore</span>
      </div>
    </div>
  );
}
