import React from 'react';
import { useResume } from '../context/ResumeContext';
import { formatDate } from '../utils/formatters';

export const ProfessionalTemplate: React.FC = () => {
  const { resumeData } = useResume();
  const { personalInfo, meta, sectionsOrder } = resumeData;
  const { theme, typography, spacing, layout, formatting } = meta;

  const styles = {
    container: {
      fontFamily: typography.fontFamily,
      fontSize: `${typography.fontSize}px`,
      lineHeight: typography.lineHeight,
      color: theme.textColor,
      height: '100%',
      display: 'flex',
      flexDirection: (layout.sidebarPosition === 'right' ? 'row-reverse' : 'row') as React.CSSProperties['flexDirection'],
    },
    sidebar: {
      width: '30%',
      backgroundColor: theme.primaryColor,
      color: 'white',
      paddingTop: `${spacing.marginTop}mm`,
      paddingBottom: `${spacing.marginBottom}mm`,
      paddingLeft: `${spacing.marginLeft}mm`,
      paddingRight: `${spacing.marginRight}mm`,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '2rem',
    },
    main: {
      width: '70%',
      paddingTop: `${spacing.marginTop}mm`,
      paddingBottom: `${spacing.marginBottom}mm`,
      paddingLeft: `${spacing.marginLeft}mm`,
      paddingRight: `${spacing.marginRight}mm`,
      backgroundColor: theme.backgroundColor,
    },
    sidebarTitle: {
      fontSize: `${typography.headingSize}em`,
      textTransform: 'uppercase' as const,
      borderBottom: '1px solid rgba(255,255,255,0.3)',
      paddingBottom: '0.5rem',
      marginBottom: '1rem',
      letterSpacing: '0.05em',
      fontWeight: typography.headingWeight,
    },
    mainTitle: {
      fontSize: `${typography.headingSize * 1.1}em`,
      textTransform: 'uppercase' as const,
      borderBottom: `2px solid ${theme.primaryColor}`,
      paddingBottom: '0.5rem',
      marginBottom: '1.5rem',
      color: theme.primaryColor,
      letterSpacing: '0.05em',
      fontWeight: typography.headingWeight,
    },
    name: {
      fontSize: `${typography.nameSize}em`,
      lineHeight: 1.1,
      marginBottom: '1rem',
      color: theme.primaryColor,
      fontWeight: typography.headingWeight,
    },
    contactItem: {
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.9em',
      color: 'rgba(255,255,255,0.9)',
      textDecoration: 'none',
    },
    skillTag: {
      display: 'inline-block',
      backgroundColor: 'rgba(255,255,255,0.2)',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      marginRight: '0.5rem',
      marginBottom: '0.5rem',
      fontSize: '0.9em',
    },
    skillBubble: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: 'white',
      display: 'inline-block',
      marginRight: '0.5rem',
    },
    section: {
      marginBottom: `${spacing.sectionPadding}rem`,
    },
    sectionTitle: {
      fontSize: `${typography.headingSize * 1.1}em`,
      textTransform: 'uppercase' as const,
      borderBottom: `2px solid ${theme.primaryColor}`,
      paddingBottom: '0.5rem',
      marginBottom: '1.5rem',
      color: theme.primaryColor,
      letterSpacing: '0.05em',
      fontWeight: typography.headingWeight,
    },
    itemTitle: {
      margin: 0,
      fontSize: '1.2em',
      color: '#1f2937',
      fontWeight: typography.bodyWeight === 'normal' ? 'bold' : '800',
    },
    itemSubtitle: {
      color: theme.primaryColor,
      fontWeight: 500,
      marginBottom: '0.75rem',
    },
    date: {
      color: '#6b7280',
      fontSize: '0.9em',
    },
  };

  const renderSkills = () => {
    if (formatting.skillsStyle === 'list') {
      return (
        <div style={{ lineHeight: 1.6 }}>
          {resumeData.skills.map(s => s.name).join(', ')}
        </div>
      );
    }
    
    if (formatting.skillsStyle === 'bubbles') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
          {resumeData.skills.map(skill => (
            <div key={skill.id} style={{ display: 'flex', alignItems: 'center' }}>
              <span style={styles.skillBubble}></span>
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      );
    }

    // Default: Tags
    return (
      <div>
        {resumeData.skills.map(skill => (
          <span key={skill.id} style={styles.skillTag}>{skill.name}</span>
        ))}
      </div>
    );
  };

  const renderHeader = () => (
    <header style={{ marginBottom: `${spacing.sectionPadding}rem` }}>
      <h1 style={styles.name}>{personalInfo.fullName}</h1>
      {personalInfo.summary && <p style={{ fontSize: '1.1em', lineHeight: 1.6, color: '#4b5563' }}>{personalInfo.summary}</p>}
    </header>
  );

  const renderSection = (section: string) => {
    // Handle custom sections
    const customSection = resumeData.customSections.find(s => s.id === section);
    if (customSection && customSection.isVisible && customSection.items.length > 0) {
      return (
        <section key={customSection.id} style={styles.section}>
          <h3 style={styles.sectionTitle}>{customSection.title}</h3>
          {customSection.items.map((item) => (
            <div key={item.id} style={{ marginBottom: `${spacing.itemSpacing}rem` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                <h4 style={styles.itemTitle}>{item.title}</h4>
                {item.subtitle && (
                  <span style={styles.date}>{item.subtitle}</span>
                )}
              </div>
              <div 
                className="text-sm"
                style={{ 
                  color: 'var(--text-secondary)',
                  lineHeight: meta.typography.lineHeight 
                }}
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>
          ))}
        </section>
      );
    }

    switch (section) {
      case 'summary':
        // Summary is in header for this template
        return null;

      case 'experience':
        return resumeData.experience.length > 0 && (
          <section key="experience" style={styles.section}>
            <h3 style={styles.sectionTitle}>Experience</h3>
            {resumeData.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: `${spacing.itemSpacing}rem` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                  <h4 style={styles.itemTitle}>{exp.position}</h4>
                  <span style={styles.date}>
                    {formatDate(exp.startDate, formatting.dateFormat)} - {exp.current ? 'Present' : formatDate(exp.endDate, formatting.dateFormat)}
                  </span>
                </div>
                <div style={styles.itemSubtitle}>{exp.company}</div>
                <div 
                  className="text-sm"
                  style={{ 
                    color: 'var(--text-secondary)',
                    lineHeight: meta.typography.lineHeight 
                  }}
                  dangerouslySetInnerHTML={{ __html: exp.description }}
                />
              </div>
            ))}
          </section>
        );

      case 'education':
        // Education is in sidebar for this template, but if it's in main order, we might want to render it here too?
        // For now, let's keep it in sidebar only to match original design, or maybe render if explicitly ordered?
        // The original design had education in sidebar. Let's keep it there for now.
        return null;

      case 'skills':
        // Skills in sidebar
        return null;

      case 'projects':
        return resumeData.projects.length > 0 && (
          <section key="projects" style={styles.section}>
            <h3 style={styles.sectionTitle}>Projects</h3>
            {resumeData.projects.map(project => (
              <div key={project.id} style={{ marginBottom: `${spacing.itemSpacing}rem` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h4 style={styles.itemTitle}>
                    {project.name}
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" style={{ marginLeft: '0.5rem', fontSize: '0.8em', color: theme.primaryColor, textDecoration: 'none' }}>
                        ↗
                      </a>
                    )}
                  </h4>
                </div>
                {project.technologies && (
                  <div style={{ fontSize: '0.9em', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {project.technologies}
                  </div>
                )}
                <div 
                  className="text-sm"
                  style={{ 
                    color: 'var(--text-secondary)',
                    lineHeight: meta.typography.lineHeight 
                  }}
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>
            ))}
          </section>
        );

      case 'languages':
        // Languages in sidebar
        return null;

      default:
        return null;
    }
  };

  return (
    <div style={{ ...styles.container, width: '100%' }}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        {personalInfo.photo && (
          <img 
            src={personalInfo.photo} 
            alt={personalInfo.fullName} 
            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto' }} 
          />
        )}
        
        <section>
          <h3 style={styles.sidebarTitle}>Contact</h3>
          <div style={{ fontSize: '0.9em' }}>
            {personalInfo.email && <span style={styles.contactItem}>{personalInfo.email}</span>}
            {personalInfo.phone && <span style={styles.contactItem}>{personalInfo.phone}</span>}
            {personalInfo.address && <span style={styles.contactItem}>{personalInfo.address}</span>}
            {personalInfo.website && <a href={personalInfo.website} style={styles.contactItem}>Website</a>}
            {personalInfo.linkedin && <a href={personalInfo.linkedin} style={styles.contactItem}>LinkedIn</a>}
            {personalInfo.github && <a href={personalInfo.github} style={styles.contactItem}>GitHub</a>}
          </div>
        </section>

        {resumeData.education.length > 0 && (
          <section>
            <h3 style={styles.sidebarTitle}>Education</h3>
            {resumeData.education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 'bold' }}>{edu.degree}</div>
                <div style={{ opacity: 0.9 }}>{edu.institution}</div>
                <div style={{ fontSize: '0.85em', opacity: 0.8 }}>
                  {formatDate(edu.startDate, formatting.dateFormat)} - {edu.current ? 'Present' : formatDate(edu.endDate, formatting.dateFormat)}
                </div>
              </div>
            ))}
          </section>
        )}

        {resumeData.skills.length > 0 && (
          <section>
            <h3 style={styles.sidebarTitle}>Skills</h3>
            {renderSkills()}
          </section>
        )}

        {resumeData.languages.length > 0 && (
          <section>
            <h3 style={styles.sidebarTitle}>Languages</h3>
            {resumeData.languages.map(lang => (
              <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>{lang.name}</span>
                <span style={{ opacity: 0.8 }}>{lang.proficiency}</span>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {renderHeader()}
        {sectionsOrder && sectionsOrder.length > 0 ? (
          sectionsOrder.map(section => renderSection(section))
        ) : (
          <div style={{ padding: '20px', color: '#666' }}>No sections to display</div>
        )}
      </div>
    </div>
  );
};
