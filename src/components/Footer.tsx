import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="relative z-10 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-display font-bold text-white mb-3 tracking-tight">
              RUSHIKESH<span className="text-electric-blue-500">.DEV</span>
            </h2>
            <p className="text-gray-400 text-sm font-light max-w-md">
              Building the future of the web, one pixel at a time. <br/>
              Open for opportunities and collaborations.
            </p>
          </div>

          <div className="flex gap-8">
            {[
              { icon: Github, href: "https://github.com" },
              { icon: Linkedin, href: "https://linkedin.com" },
              { icon: Mail, href: "mailto:rushikesh.kanbargi@protonmail.com" }
            ].map((social, index) => (
              <a 
                key={index}
                href={social.href} 
                className="p-4 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-electric-blue-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-1"
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center gap-6 font-light">
          <span>© {new Date().getFullYear()} Rushikesh Kanbargi. All rights reserved.</span>
          <div className="flex flex-col md:flex-row gap-6 text-xs uppercase tracking-widest">
            <span>Belgaum, Karnataka</span>
            <span>+91 9945773107</span>
            <span>rushikesh.kanbargi@protonmail.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
