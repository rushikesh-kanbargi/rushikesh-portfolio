import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Wand2, Layout, Download, ArrowRight, Star, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8 animate-fade-in-up">
            <Star size={14} fill="currentColor" />
            <span>The #1 AI-Powered Resume Builder</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
            Craft Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">Dream Career</span><br />
            in Minutes, Not Hours.
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Build professional, ATS-friendly resumes with our AI-powered platform. 
            Stand out from the crowd with premium templates and smart content suggestions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/resume-builder/dashboard" 
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Build My Resume <ArrowRight size={20} />
            </Link>
            <Link 
              to="/resume-builder/dashboard" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2"
            >
              View Templates
            </Link>
          </div>

          {/* Hero Image / Preview */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden aspect-[16/9] flex items-center justify-center bg-slate-100">
              <img 
                src="/resume-preview.png" 
                alt="Resume Builder Interface Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Everything you need to get hired</h2>
            <p className="text-lg text-slate-600">Powerful features designed to help you create the perfect resume.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
              icon={<Wand2 className="text-indigo-600" size={32} />}
              title="AI Content Generator"
              description="Stuck on what to write? Let our AI generate professional bullet points and summaries tailored to your role."
            />
            <FeatureCard 
              icon={<Layout className="text-teal-600" size={32} />}
              title="Premium Templates"
              description="Choose from a collection of sleek, professional templates designed to pass ATS scanners."
            />
            <FeatureCard 
              icon={<Download className="text-purple-600" size={32} />}
              title="Instant PDF Export"
              description="Download your resume in high-quality PDF format, ready for application submission."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">How it works</h2>
          </div>

          <div className="space-y-8">
            <Step 
              number="01"
              title="Choose a Template"
              description="Select a professional design that matches your industry and personality."
            />
            <Step 
              number="02"
              title="Enter Your Details"
              description="Fill in your experience, education, and skills. Use our AI to polish your content."
            />
            <Step 
              number="03"
              title="Download & Apply"
              description="Export your polished resume as a PDF and start applying to your dream jobs."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <FileText size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">ResumeX</span>
            </div>
            <div className="flex gap-8 text-sm font-medium">
              <Link to="/resume-builder/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/resume-builder/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} ResumeX. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
    <div className="mb-6 p-4 bg-white rounded-xl shadow-sm inline-block group-hover:shadow-md transition-all">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const Step: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <div className="flex items-start gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
    <span className="text-4xl font-bold text-slate-200">{number}</span>
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  </div>
);
