import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, AlertCircle, PenTool } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useResume } from '../resume-builder/context/ResumeContext';
import type { JobDetails } from '../types/ai';
import { JobDetailsForm } from './components/JobDetailsForm';
import { GeneratedOutput } from './components/GeneratedOutput';
import { ManualCoverLetterBuilder } from './components/ManualCoverLetterBuilder';

export const CoverLetterGenerator: React.FC = () => {
  const { resumeData } = useResume();
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    title: '',
    company: '',
    description: ''
  });
  const [tone, setTone] = useState<'Professional' | 'Enthusiastic' | 'Concise'>('Professional');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('ai_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Please configure your Gemini API Key in the Resume Builder Settings first.');
      return;
    }
    if (!jobDetails.description.trim()) {
      setError('Please enter the job description.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `
        Write a ${tone.toLowerCase()} and persuasive cover letter for the position of ${jobDetails.title} at ${jobDetails.company}.
        
        Here is the Job Description:
        "${jobDetails.description}"

        Here is my Resume Context:
        Name: ${resumeData.personalInfo.fullName}
        Summary: ${resumeData.personalInfo.summary}
        Skills: ${resumeData.skills.map(s => s.name).join(', ')}
        Experience: ${resumeData.experience.map(e => `${e.position} at ${e.company}: ${e.description}`).join('\n')}

        The cover letter should:
        1. Be ${tone.toLowerCase()} and tailored to the company.
        2. Highlight relevant skills and experience that match the job description.
        3. Be concise (under 400 words).
        4. Use standard business letter formatting.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setGeneratedLetter(text);
    } catch (err) {
      setError('Failed to generate cover letter. Please check your API key and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/tools" 
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
              aria-label="Back to Tools"
            >
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg text-white shadow-md">
                <Sparkles size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Cover Letter Creator</h1>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="bg-slate-200 p-1 rounded-lg flex gap-1">
            <button
              onClick={() => setMode('ai')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                mode === 'ai' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles size={16} /> AI Generator
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                mode === 'manual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool size={16} /> Manual Builder
            </button>
          </div>
        </div>

        {!apiKey && mode === 'ai' && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 text-yellow-800" role="alert">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">API Key Missing</p>
              <p className="text-sm mt-1">
                You need to set your Google Gemini API Key to use the AI Generator. 
                <Link to="/resume-builder/settings" className="underline ml-1 font-medium">Go to Settings</Link>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Left Column: Input */}
          <div className="h-full overflow-y-auto">
            {mode === 'ai' ? (
              <JobDetailsForm 
                jobDetails={jobDetails}
                setJobDetails={setJobDetails}
                tone={tone}
                setTone={setTone}
                onGenerate={handleGenerate}
                loading={loading}
                error={error}
                apiKey={apiKey}
              />
            ) : (
              <ManualCoverLetterBuilder onUpdate={setGeneratedLetter} />
            )}
          </div>

          {/* Right Column: Output */}
          <div className="h-full">
            <GeneratedOutput 
              generatedLetter={generatedLetter} 
              onUpdate={setGeneratedLetter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
