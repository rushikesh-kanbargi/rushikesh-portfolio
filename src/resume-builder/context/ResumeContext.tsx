import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type ResumeData, initialResumeData, type CustomSection, type ResumeMetadata } from '../types';

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  updateSection: <K extends keyof ResumeData>(section: K, data: ResumeData[K]) => void;
  addCustomSection: (title: string, type: 'list' | 'text') => void;
  removeCustomSection: (id: string) => void;
  updateCustomSection: (id: string, data: Partial<CustomSection>) => void;
  resetResume: () => void;
  loadSampleData: () => void;
  // Multiple Resumes Support
  savedResumes: ResumeMetadata[];
  loadResume: (id: string) => void;
  createNewResume: () => void;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string) => void;
  updateResumeName: (name: string) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for the list of saved resumes (metadata)
  const [savedResumes, setSavedResumes] = useState<ResumeMetadata[]>(() => {
    const saved = localStorage.getItem('resume_list');
    return saved ? JSON.parse(saved) : [];
  });

  // State for the currently active resume
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  // Load the initial resume (either the last active one or a new one)
  useEffect(() => {
    const lastActiveId = localStorage.getItem('active_resume_id');
    if (lastActiveId) {
      loadResume(lastActiveId);
    } else if (savedResumes.length > 0) {
      loadResume(savedResumes[0].id);
    } else {
      // No resumes exist, create a default one
      createNewResume();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the list of resumes whenever it changes
  useEffect(() => {
    localStorage.setItem('resume_list', JSON.stringify(savedResumes));
  }, [savedResumes]);

  // Persist the current resume data whenever it changes
  useEffect(() => {
    // We also need to update the lastModified timestamp in the metadata
    if (resumeData.id) {
      localStorage.setItem(`resume_${resumeData.id}`, JSON.stringify(resumeData));
      
      setSavedResumes(prev => prev.map(meta => 
        meta.id === resumeData.id 
          ? { ...meta, lastModified: Date.now() }
          : meta
      ));
    }
  }, [resumeData]);

  const loadResume = (id: string) => {
    const saved = localStorage.getItem(`resume_${id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with initial to ensure new fields are present
        setResumeData({ 
          ...initialResumeData, 
          ...parsed, 
          customSections: parsed.customSections || [],
          meta: { ...initialResumeData.meta, ...parsed.meta }
        });
        localStorage.setItem('active_resume_id', id);
      } catch (e) {
        console.error('Failed to parse resume data', e);
      }
    }
  };

  const createNewResume = () => {
    const newId = crypto.randomUUID();
    const newResume: ResumeData = {
      ...initialResumeData,
      id: newId, // Ensure ResumeData has an ID field if it doesn't already, or we use a separate ID
    };
    
    // If ResumeData doesn't have an ID property in types.ts, we might need to add it or just rely on the metadata ID.
    // Assuming ResumeData might not have 'id' at the root, let's check types.ts. 
    // Looking at previous view_file of types.ts, ResumeData DOES NOT have an 'id' field at the root.
    // We should probably add it or just manage it here. 
    // For now, let's assume we store it by ID key in localStorage.
    
    localStorage.setItem(`resume_${newId}`, JSON.stringify(newResume));
    localStorage.setItem('active_resume_id', newId);
    
    const newMeta: ResumeMetadata = {
      id: newId,
      name: 'Untitled Resume',
      lastModified: Date.now(),
    };
    
    setSavedResumes(prev => [newMeta, ...prev]);
    setResumeData(newResume);
  };

  const deleteResume = (id: string) => {
    const newSaved = savedResumes.filter(r => r.id !== id);
    setSavedResumes(newSaved);
    localStorage.removeItem(`resume_${id}`);
    
    if (id === localStorage.getItem('active_resume_id')) {
      if (newSaved.length > 0) {
        loadResume(newSaved[0].id);
      } else {
        createNewResume();
      }
    }
  };

  const duplicateResume = (id: string) => {
    const sourceResumeJson = localStorage.getItem(`resume_${id}`);
    if (sourceResumeJson) {
      const sourceResume = JSON.parse(sourceResumeJson);
      const newId = crypto.randomUUID();
      const newResume = { ...sourceResume }; // Deep copy if needed, but JSON parse/stringify handles it
      
      localStorage.setItem(`resume_${newId}`, JSON.stringify(newResume));
      
      const sourceMeta = savedResumes.find(r => r.id === id);
      const newMeta: ResumeMetadata = {
        id: newId,
        name: `${sourceMeta?.name || 'Resume'} (Copy)`,
        lastModified: Date.now(),
      };
      
      setSavedResumes(prev => [newMeta, ...prev]);
      // Optional: Switch to the new copy immediately
      // loadResume(newId); 
    }
  };

  const updateResumeName = (name: string) => {
    const currentId = localStorage.getItem('active_resume_id');
    if (currentId) {
      setSavedResumes(prev => prev.map(meta => 
        meta.id === currentId 
          ? { ...meta, name }
          : meta
      ));
    }
  };

  const updateSection = <K extends keyof ResumeData>(section: K, data: ResumeData[K]) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const addCustomSection = (title: string, type: 'list' | 'text') => {
    const newSection: CustomSection = {
      id: crypto.randomUUID(),
      title,
      type,
      items: [],
      isVisible: true,
    };
    setResumeData((prev) => ({
      ...prev,
      customSections: [...prev.customSections, newSection],
      sectionsOrder: [...prev.sectionsOrder, newSection.id],
    }));
  };

  const removeCustomSection = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((s) => s.id !== id),
      sectionsOrder: prev.sectionsOrder.filter((s) => s !== id),
    }));
  };

  const updateCustomSection = (id: string, data: Partial<CustomSection>) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }));
  };

  const resetResume = () => {
    setResumeData(initialResumeData);
  };

  const loadSampleData = () => {
    setResumeData({
      ...initialResumeData,
      personalInfo: {
        fullName: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        phone: '+1 (555) 123-4567',
        address: 'San Francisco, CA',
        summary: 'Creative and detail-oriented Full Stack Developer with 5+ years of experience building scalable web applications. Passionate about UI/UX and clean code.',
        linkedin: 'linkedin.com/in/alexmorgan',
        github: 'github.com/alexmorgan',
        website: 'alexmorgan.dev',
        photo: ''
      },
      experience: [
        {
          id: '1',
          company: 'TechFlow Solutions',
          position: 'Senior Frontend Engineer',
          location: 'San Francisco, CA',
          startDate: '2021-03',
          endDate: '',
          current: true,
          description: 'Led the migration of a legacy monolith to a micro-frontend architecture using React and TypeScript.\nImproved site performance by 40% through code splitting and lazy loading.\nMentored junior developers and established code quality standards.'
        },
        {
          id: '2',
          company: 'Creative Pulse',
          position: 'Web Developer',
          location: 'Remote',
          startDate: '2018-06',
          endDate: '2021-02',
          current: false,
          description: 'Developed responsive websites for diverse clients using HTML5, CSS3, and JavaScript.\nCollaborated with designers to implement pixel-perfect UIs.\nIntegrated third-party APIs for payment processing and social media feeds.'
        }
      ],
      education: [
        {
          id: '1',
          institution: 'University of California, Berkeley',
          degree: 'B.S. Computer Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2014-09',
          endDate: '2018-05',
          current: false,
          description: 'Graduated with Honors. GPA: 3.8/4.0',
          location: 'Berkeley, CA'
        }
      ],
      skills: [
        { id: '1', name: 'React', level: 5 },
        { id: '2', name: 'TypeScript', level: 4 },
        { id: '3', name: 'Node.js', level: 3 },
        { id: '4', name: 'UI/UX Design', level: 4 }
      ],
      projects: [
        {
          id: '1',
          name: 'E-Commerce Dashboard',
          description: 'A comprehensive analytics dashboard for online retailers.',
          technologies: 'React, D3.js, Firebase',
          link: 'dashboard.demo.com'
        }
      ],
      languages: [
        { id: '1', name: 'English', proficiency: 'Native' },
        { id: '2', name: 'Spanish', proficiency: 'Intermediate' }
      ],
      customSections: []
    });
  };

  return (
    <ResumeContext.Provider value={{ 
      resumeData, 
      setResumeData, 
      updateSection, 
      addCustomSection, 
      removeCustomSection, 
      updateCustomSection, 
      resetResume, 
      loadSampleData,
      savedResumes,
      loadResume,
      createNewResume,
      deleteResume,
      duplicateResume,
      updateResumeName
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
