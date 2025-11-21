import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-slate-700 mb-8">
          <ArrowLeft size={20} className="mr-2" /> Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600">
              By accessing and using ResumeX, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">2. Use License</h2>
            <p className="text-slate-600">
              ResumeX is an open-source project. You are free to use it to create and export resumes for personal or commercial use.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">3. Disclaimer</h2>
            <p className="text-slate-600">
              The materials on ResumeX are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">4. Limitations</h2>
            <p className="text-slate-600">
              In no event shall ResumeX or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ResumeX.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. Governing Law</h2>
            <p className="text-slate-600">
              Any claim relating to ResumeX shall be governed by the laws of the jurisdiction in which the project maintainers reside without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
