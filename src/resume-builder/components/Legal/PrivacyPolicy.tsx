import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-slate-700 mb-8">
          <ArrowLeft size={20} className="mr-2" /> Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-600">
              Welcome to ResumeX. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we handle your information when you use our resume builder application.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">2. Data Storage</h2>
            <p className="text-slate-600">
              <strong>ResumeX is a client-side application.</strong> This means that:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600">
              <li>All resume data you enter is stored locally on your device using your browser's Local Storage.</li>
              <li>We do not have a backend server that stores your personal information.</li>
              <li>We do not have access to your resume content, contact details, or employment history.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">3. AI Features</h2>
            <p className="text-slate-600">
              If you choose to use our AI features (powered by Google Gemini):
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600">
              <li>Your API key is stored locally on your device.</li>
              <li>When you generate content, the text you provide (e.g., job title, company) is sent directly from your browser to Google's servers to generate the response.</li>
              <li>We do not intercept or store this data.</li>
              <li>Please refer to Google's Privacy Policy for information on how they handle API data.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">4. Cookies</h2>
            <p className="text-slate-600">
              We use local storage to save your preferences and resume data. We do not use tracking cookies or third-party analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. Contact Us</h2>
            <p className="text-slate-600">
              If you have any questions about this Privacy Policy, please contact us via our GitHub repository.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
