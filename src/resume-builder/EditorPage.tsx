import { useState } from 'react';

import { PreviewLayout } from './components/Preview/PreviewLayout';
import { PersonalInfoForm } from './components/Editor/PersonalInfoForm';
import { ExperienceForm } from './components/Editor/ExperienceForm';
import { EducationForm } from './components/Editor/EducationForm';
import { SkillsForm } from './components/Editor/SkillsForm';
import { ProjectsForm } from './components/Editor/ProjectsForm';
import { LanguagesForm } from './components/Editor/LanguagesForm';
import { CustomSectionForm } from './components/Editor/CustomSectionForm';
import { LayoutEditor } from './components/Editor/LayoutEditor';
import { Header } from './components/UI/Header';
import { DesignEditor } from './components/Editor/DesignEditor';
import { ResumePreview } from './components/Preview/ResumePreview';
import { Accordion, AccordionItem } from './components/UI/Accordion';
import { useResume } from './context/ResumeContext';
import './styles/editor.css';

export const EditorPage = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'customize'>('content');
  const { resumeData, addCustomSection } = useResume();
  const [openSection, setOpenSection] = useState<string | null>('personal');
  const [showPreview, setShowPreview] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-slate-50">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        showPreview={showPreview}
        setShowPreview={setShowPreview}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Editor Section - Hidden on mobile when preview is active */}
        <div className={`w-full lg:w-[50%] xl:w-[50%] h-full bg-white border-r border-slate-200 shadow-sm z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent ${showPreview ? 'hidden lg:block' : 'block'}`}>
          <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto pb-20 lg:pb-8">
            <Accordion>
              {activeTab === 'customize' && (
                <>
                  <AccordionItem title="Design Studio" isOpen={openSection === 'design'} onToggle={() => toggleSection('design')}>
                    <DesignEditor />
                  </AccordionItem>
                  <AccordionItem title="Layout & Ordering" isOpen={openSection === 'layout'} onToggle={() => toggleSection('layout')}>
                    <LayoutEditor />
                  </AccordionItem>
                </>
              )}
              
              {activeTab === 'content' && (
                <>
                  <AccordionItem title="Personal Info" isOpen={openSection === 'personal'} onToggle={() => toggleSection('personal')}>
                    <PersonalInfoForm />
                  </AccordionItem>
                  <AccordionItem title="Experience" isOpen={openSection === 'experience'} onToggle={() => toggleSection('experience')}>
                    <ExperienceForm />
                  </AccordionItem>
                  <AccordionItem title="Education" isOpen={openSection === 'education'} onToggle={() => toggleSection('education')}>
                    <EducationForm />
                  </AccordionItem>
                  <AccordionItem title="Projects" isOpen={openSection === 'projects'} onToggle={() => toggleSection('projects')}>
                    <ProjectsForm />
                  </AccordionItem>
                  {/* Custom Sections */}
                  {resumeData.customSections.map((section) => (
                    <AccordionItem 
                      key={section.id} 
                      title={section.title} 
                      isOpen={openSection === section.id} 
                      onToggle={() => toggleSection(section.id)}
                    >
                      <CustomSectionForm sectionId={section.id} />
                    </AccordionItem>
                  ))}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Add Custom Section</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => addCustomSection('Custom List', 'list')}
                        className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all"
                      >
                        <span className="font-medium">Add List Section</span>
                      </button>
                      <button
                        onClick={() => addCustomSection('Custom Text', 'text')}
                        className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all"
                      >
                        <span className="font-medium">Add Text Section</span>
                      </button>
                    </div>
                  </div>
                  {/* End Custom Sections */}
                  <AccordionItem title="Skills" isOpen={openSection === 'skills'} onToggle={() => toggleSection('skills')}>
                    <SkillsForm />
                  </AccordionItem>
                  <AccordionItem title="Languages" isOpen={openSection === 'languages'} onToggle={() => toggleSection('languages')}>
                    <LanguagesForm />
                  </AccordionItem>
                </>
              )}
            </Accordion>
          </div>
        </div>

        {/* Preview Section - Hidden on mobile when editor is active */}
        <div className={`flex-1 h-full bg-slate-600 overflow-hidden ${showPreview ? 'block' : 'hidden lg:block'}`}>
          <PreviewLayout>
            <ResumePreview key={resumeData.id || 'preview'} />
          </PreviewLayout>
        </div>
      </div>
    </div>
  );
};
