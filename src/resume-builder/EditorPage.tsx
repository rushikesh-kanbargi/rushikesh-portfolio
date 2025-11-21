import { useState } from 'react';
import { EditorLayout } from './components/Editor/EditorLayout';
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

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <EditorLayout>
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
        </EditorLayout>
        <PreviewLayout>
          <ResumePreview />
        </PreviewLayout>
      </div>
    </div>
  );
};
