import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, User, Bot, Sparkles, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useResume } from '../resume-builder/context/ResumeContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const AskMyAI: React.FC = () => {
  const { resumeData } = useResume();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('ai_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    if (!apiKey) {
      setError('Please configure your Gemini API Key in Settings first.');
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // Construct context from resume
      const context = `
        You are an AI assistant representing ${resumeData.personalInfo.fullName}.
        Your goal is to answer questions about ${resumeData.personalInfo.fullName}'s professional background, skills, and experience based ONLY on the following resume data.
        
        Resume Data:
        - Name: ${resumeData.personalInfo.fullName}
        - Summary: ${resumeData.personalInfo.summary}
        - Skills: ${resumeData.skills.map(s => s.name).join(', ')}
        - Experience: ${resumeData.experience.map(e => `${e.position} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'}): ${e.description}`).join('\n')}
        - Education: ${resumeData.education.map(e => `${e.degree} from ${e.institution}`).join('\n')}
        - Projects: ${resumeData.projects.map(p => `${p.name}: ${p.description}`).join('\n')}
        
        Tone: Professional, friendly, and helpful.
        If the answer is not in the resume data, politely say you don't have that information.
        Keep answers concise.
      `;

      const chatHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
      
      const prompt = `
        ${context}
        
        Chat History:
        ${chatHistory}
        User: ${userMessage.content}
        Assistant:
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: text
      }]);
    } catch (err) {
      setError('Failed to get response. Please check your API key and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "What are your main skills?",
    "Tell me about your experience at TechFlow.",
    "Do you have experience with React?",
    "What is your educational background?"
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-600 rounded-lg text-white shadow-md">
                <Sparkles size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Ask My AI</h1>
            </div>
          </div>
        </div>

        {!apiKey && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 text-yellow-800 shrink-0">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">API Key Missing</p>
              <p className="text-sm mt-1">
                You need to set your Google Gemini API Key to use this feature. 
                <Link to="/resume-builder/settings" className="underline ml-1 font-medium">Go to Settings</Link>
              </p>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
              <div className="w-20 h-20 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Bot size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Hi, I'm {resumeData.personalInfo.fullName}'s AI Assistant
              </h2>
              <p className="text-slate-600 max-w-md mb-8">
                Ask me anything about my professional background, skills, experience, or projects.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(q); }}
                    className="p-4 bg-white border border-slate-200 rounded-xl text-left hover:border-violet-500 hover:shadow-md transition-all text-slate-700 text-sm font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-violet-100 text-violet-600'
                  }`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-violet-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                    <Bot size={20} />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-2">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-center text-sm border border-red-100">
                  {error}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
