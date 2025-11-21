import { Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import { Dashboard } from './components/Dashboard/Dashboard';
import { EditorPage } from './EditorPage';
import { Settings } from './components/Settings/Settings';
import { PrivacyPolicy } from './components/Legal/PrivacyPolicy';
import { TermsOfService } from './components/Legal/TermsOfService';
import { LandingPage } from './components/Landing/LandingPage';
import './styles/index.css';

export default function ResumeBuilder() {
  return (
    <ResumeProvider>
      <div className="resume-builder-app min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </div>
    </ResumeProvider>
  );
}
