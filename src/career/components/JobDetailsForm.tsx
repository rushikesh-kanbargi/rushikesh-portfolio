import React from 'react';
import { Briefcase, Sparkles, AlertCircle } from 'lucide-react';
import type { JobDetails } from '../../types/ai';

interface JobDetailsFormProps {
  jobDetails: JobDetails;
  setJobDetails: (details: JobDetails) => void;
  tone: 'Professional' | 'Enthusiastic' | 'Concise';
  setTone: (tone: 'Professional' | 'Enthusiastic' | 'Concise') => void;
  onGenerate: () => void;
  loading: boolean;
  error: string | null;
  apiKey: string;
}

export const JobDetailsForm: React.FC<JobDetailsFormProps> = ({
  jobDetails,
  setJobDetails,
  tone,
  setTone,
  onGenerate,
  loading,
  error,
  apiKey
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Briefcase size={20} className="text-slate-500" />
        Job Details
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
          <input
            type="text"
            value={jobDetails.title}
            onChange={(e) => setJobDetails({ ...jobDetails, title: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g. Senior React Developer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
          <input
            type="text"
            value={jobDetails.company}
            onChange={(e) => setJobDetails({ ...jobDetails, company: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g. Google"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Tone</label>
        <div className="grid grid-cols-3 gap-2">
          {(['Professional', 'Enthusiastic', 'Concise'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                tone === t
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
        <textarea
          value={jobDetails.description}
          onChange={(e) => setJobDetails({ ...jobDetails, description: e.target.value })}
          className="w-full h-48 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          placeholder="Paste the full job description here..."
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={loading || !apiKey}
        className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        aria-label="Generate Cover Letter"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles size={20} className="group-hover:scale-110 transition-transform" />
            Generate Cover Letter
          </>
        )}
      </button>
      
      {error && (
        <p className="mt-4 text-sm text-red-600 flex items-center gap-2" role="alert">
          <AlertCircle size={16} />
          {error}
        </p>
      )}
    </div>
  );
};
