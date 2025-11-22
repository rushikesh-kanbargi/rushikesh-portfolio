import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, User, Bot, Play, RefreshCw, AlertCircle, Award, BarChart3, Settings2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useResume } from '../resume-builder/context/ResumeContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type InterviewType = 'Behavioral' | 'Technical' | 'System Design';
type Difficulty = 'Junior' | 'Mid-Level' | 'Senior';

const FALLBACK_QUESTIONS = {
  Behavioral: [
    "Tell me about a time you faced a challenge at work and how you overcame it.",
    "Describe a situation where you had to manage conflicting priorities.",
    "Give an example of a goal you reached and tell me how you achieved it.",
    "Tell me about a mistake you made and what you learned from it."
  ],
  Technical: [
    "Explain the concept of RESTful APIs.",
    "What is the difference between TCP and UDP?",
    "How does garbage collection work in your primary programming language?",
    "Explain the difference between a process and a thread."
  ],
  'System Design': [
    "How would you design a URL shortening service like Bit.ly?",
    "Design a rate limiter.",
    "How would you design a chat application like WhatsApp?",
    "Design a notification system."
  ]
};

export const MockInterview: React.FC = () => {
  const { resumeData } = useResume();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  
  // Settings
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical');
  const [difficulty, setDifficulty] = useState<Difficulty>('Mid-Level');

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

  const startInterview = async () => {
    setStarted(true);
    setLoading(true);
    setError(null);
    setUsingFallback(false);
    setQuestionIndex(0);

    if (!apiKey) {
      startFallbackInterview();
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `
        You are an expert technical interviewer conducting a ${difficulty} level ${interviewType} interview.
        
        Candidate Context:
        Name: ${resumeData?.personalInfo?.fullName || 'Candidate'}
        Role: ${resumeData?.experience?.[0]?.position || 'Software Engineer'}
        Skills: ${resumeData?.skills?.map(s => s.name).join(', ') || 'General'}

        Start the interview by introducing yourself and asking the first question relevant to a ${difficulty} ${interviewType} role.
        Keep your responses concise (under 100 words) and professional.
        Ask one question at a time.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages([
        { id: '1', role: 'assistant', content: text }
      ]);
      setLoading(false);
    } catch (err) {
      console.error("AI Start Failed, switching to fallback", err);
      startFallbackInterview();
    }
  };

  const startFallbackInterview = () => {
    setUsingFallback(true);
    setLoading(false);
    const firstQuestion = FALLBACK_QUESTIONS[interviewType][0];
    setMessages([
      { 
        id: '1', 
        role: 'assistant', 
        content: `(Offline Mode) Hello! I'll be conducting your ${interviewType} interview today. Let's start.\n\n${firstQuestion}` 
      }
    ]);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    if (usingFallback) {
      setTimeout(() => {
        const nextIndex = questionIndex + 1;
        setQuestionIndex(nextIndex);
        
        let responseText = "";
        if (nextIndex < FALLBACK_QUESTIONS[interviewType].length) {
          responseText = `Thank you. Here is your next question:\n\n${FALLBACK_QUESTIONS[interviewType][nextIndex]}`;
        } else {
          responseText = "Thank you for your answers. That concludes the interview questions. You can now end the interview to see a summary (Note: AI feedback is unavailable in offline mode).";
        }

        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: responseText
        }]);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const history = messages.map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n');
      
      const prompt = `
        ${history}
        Candidate: ${userMessage.content}
        
        Interviewer (You):
        Respond to the candidate's answer. If it's good, acknowledge it and ask the next relevant question for a ${difficulty} ${interviewType} interview.
        If it's vague, ask for clarification.
        Keep your response concise (under 100 words).
        Maintain a professional but encouraging tone.
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
      setError('Failed to get response. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    setLoading(true);
    setFeedbackMode(true);
    
    if (usingFallback) {
      setFeedback("Feedback generation is not available in Offline Mode. Please configure your API key for AI-powered feedback.");
      setLoading(false);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const history = messages.map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n');
      
      const prompt = `
        Analyze the following interview transcript and provide feedback for the candidate.
        
        Transcript:
        ${history}
        
        Provide feedback in the following format:
        1. Strengths (What they did well)
        2. Areas for Improvement (What they missed or could explain better)
        3. Overall Rating (1-10)
        4. Final Verdict (Hire/No Hire/Strong Hire)
        
        Keep it constructive and actionable.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setFeedback(text);
    } catch (err) {
      setError('Failed to generate feedback.');
      setFeedback("Could not generate feedback due to an error.");
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    setMessages([]);
    setStarted(false);
    setFeedbackMode(false);
    setFeedback('');
    setError(null);
    setUsingFallback(false);
    setQuestionIndex(0);
  };

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
              <div className="p-2 bg-pink-500 rounded-lg text-white shadow-md">
                <MessageSquare size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Mock Interview AI</h1>
            </div>
          </div>
          
          {started && !feedbackMode && (
            <div className="flex gap-2">
              <button
                onClick={endInterview}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Award size={18} />
                End & Get Feedback
              </button>
              <button
                onClick={resetInterview}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <RefreshCw size={18} />
                Restart
              </button>
            </div>
          )}
          {feedbackMode && (
             <button
             onClick={resetInterview}
             className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
           >
             <RefreshCw size={18} />
             Start New Interview
           </button>
          )}
        </div>

        {!apiKey && !started && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 text-yellow-800 shrink-0">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">API Key Missing - Offline Mode</p>
              <p className="text-sm mt-1">
                You can still practice with predefined questions, but AI feedback will be disabled.
                <Link to="/resume-builder/settings" className="underline ml-1 font-medium">Add Key for AI</Link>
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {!started ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-6">
                <Bot size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to practice?</h2>
              <p className="text-slate-600 max-w-md mb-8">
                I'll simulate a real technical interview based on your resume. 
                Customize your session below.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 w-full max-w-lg text-left">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Settings2 size={16} /> Interview Type
                  </label>
                  <div className="space-y-2">
                    {(['Behavioral', 'Technical', 'System Design'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setInterviewType(type)}
                        className={`w-full p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                          interviewType === type
                            ? 'bg-pink-50 border-pink-200 text-pink-700 ring-1 ring-pink-500'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <BarChart3 size={16} /> Difficulty
                  </label>
                  <div className="space-y-2">
                    {(['Junior', 'Mid-Level', 'Senior'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`w-full p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                          difficulty === level
                            ? 'bg-pink-50 border-pink-200 text-pink-700 ring-1 ring-pink-500'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={startInterview}
                className="px-8 py-3 bg-pink-600 text-white rounded-full font-bold text-lg hover:bg-pink-700 transition-transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-pink-200"
              >
                <Play size={20} fill="currentColor" />
                Start Interview
              </button>
              {error && <p className="mt-4 text-red-600">{error}</p>}
            </div>
          ) : feedbackMode ? (
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
              <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                  <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
                    <Award size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Interview Feedback</h2>
                </div>
                
                {loading ? (
                   <div className="flex flex-col items-center justify-center py-12">
                     <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4" />
                     <p className="text-slate-500">Generating feedback...</p>
                   </div>
                ) : (
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                      {feedback}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-pink-100 text-pink-600'
                    }`}>
                      {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                      <Bot size={20} />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-center text-sm">
                    {error}
                  </div>
                )}
              </div>

              <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your answer..."
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
