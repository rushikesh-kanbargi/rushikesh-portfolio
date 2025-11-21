import React from 'react';
import { useResume } from '../context/ResumeContext';
import { formatDate } from '../utils/formatters';

export const ModernTemplate: React.FC = () => {
  const { resumeData } = useResume();
  const { personalInfo, meta, sectionsOrder } = resumeData;
  const { theme, typography, spacing, layout, formatting } = meta;

  const styles = {
    container: {
      fontFamily: typography.fontFamily,
      fontSize: `${typography.fontSize}px`,
      lineHeight: typography.lineHeight,
      color: theme.textColor,
      padding: `${spacing.margin}mm`,
    },
    header: {
      borderBottom: `2px solid ${theme.primaryColor}`,
      paddingBottom: '1rem',
      marginBottom: `${spacing.sectionPadding}rem`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: ((layout.headerLayout === 'center' || layout.headerLayout === 'left' || layout.headerLayout === 'right') ? 'column' : 'row') as React.CSSProperties['flexDirection'],
      textAlign: (layout.headerLayout === 'center' ? 'center' : layout.headerLayout === 'right' ? 'right' : 'left') as React.CSSProperties['textAlign'],
    },
    name: {
      margin: 0,
      fontSize: `${typography.nameSize}em`,
      color: theme.textColor,
      lineHeight: 1.2,
      fontWeight: typography.headingWeight,
    },
    contactInfo: {
      display: 'flex',
      gap: '1rem',
      marginTop: '0.5rem',
      fontSize: '0.9em',
      color: '#6b7280',
      flexWrap: 'wrap' as const,
      justifyContent: layout.headerLayout === 'center' ? 'center' : layout.headerLayout === 'right' ? 'flex-end' : 'flex-start',
    },
    links: {
      display: 'flex',
      gap: '1rem',
      marginTop: '0.5rem',
      fontSize: '0.9em',
      color: theme.primaryColor,
      flexWrap: 'wrap' as const,
      justifyContent: layout.headerLayout === 'center' ? 'center' : layout.headerLayout === 'right' ? 'flex-end' : 'flex-start',
    },
    section: {
      marginBottom: `${spacing.sectionPadding}rem`,
    },
    sectionTitle: {
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '0.5rem',
      marginBottom: '1rem',
      color: theme.primaryColor,
      textTransform: 'uppercase' as const,
      fontSize: `${typography.headingSize}em`,
      letterSpacing: '0.05em',
      fontWeight: typography.headingWeight,
    },
    itemTitle: {
      margin: 0,
      fontSize: '1.1em',
      color: theme.textColor,
      fontWeight: typography.bodyWeight === 'normal' ? 'bold' : '800',
    },
    itemSubtitle: {
      color: '#4b5563',
      fontWeight: 500,
      marginBottom: '0.25rem',
    },
    date: {
      fontSize: '0.9em',
      color: '#6b7280',
    },
    description: {
      margin: 0,
      fontSize: '0.95em',
      lineHeight: 1.5,
      color: '#4b5563',
      whiteSpace: 'pre-wrap' as const,
    },
    skillTag: {
      backgroundColor: `${theme.primaryColor}15`,
      color: theme.primaryColor,
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.85em',
      fontWeight: 500,
    },
    skillBubble: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: theme.primaryColor,
      display: 'inline-block',
      marginRight: '0.5rem',
    },
  };

  const renderHeader = () => {
    const content = (
      <div style={{ flex: 1, width: '100%' }}>
        <h1 style={styles.name}>{personalInfo.fullName}</h1>
        <div style={styles.contactInfo}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
        </div>
        <div style={styles.links}>
          {personalInfo.website && <a href={personalInfo.website} style={{ color: 'inherit' }}>Website</a>}
          {personalInfo.linkedin && <a href={personalInfo.linkedin} style={{ color: 'inherit' }}>LinkedIn</a>}
          {personalInfo.github && <a href={personalInfo.github} style={{ color: 'inherit' }}>GitHub</a>}
        </div>
      </div>
    );

    const photo = personalInfo.photo && (
      <div style={{ 
        marginLeft: layout.headerLayout === 'photo-right' ? '2rem' : 0,
        marginRight: layout.headerLayout === 'photo-left' ? '2rem' : 0,
        marginBottom: (layout.headerLayout === 'center' || layout.headerLayout === 'left' || layout.headerLayout === 'right') ? '1rem' : 0
      }}>
        <img 
          src={personalInfo.photo} 
          alt={personalInfo.fullName} 
          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${theme.primaryColor}` }} 
        />
      </div>
    );

    if (layout.headerLayout === 'photo-left') {
      return <header style={styles.header}>{photo}{content}</header>;
    }
    if (layout.headerLayout === 'photo-right') {
      return <header style={styles.header}>{content}{photo}</header>;
    }
    // Center, Left, Right (Column layout)
    return <header style={styles.header}>{photo}{content}</header>;
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {resumeData.skills.map(skill => (
          <span key={skill.id} style={styles.skillTag}>
            {skill.name}
          </span>
        ))}
      </div>
    );
  };

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
        return personalInfo.summary && (
          <section key="summary" style={styles.section}>
            <h3 style={styles.sectionTitle}>Summary</h3>
            <p style={{ lineHeight: 1.6 }}>{personalInfo.summary}</p>
          </section>
        );

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
        return resumeData.education.length > 0 && (
          <section key="education" style={styles.section}>
            <h3 style={styles.sectionTitle}>Education</h3>
            {resumeData.education.map(edu => (
              <div key={edu.id} style={{ marginBottom: `${spacing.itemSpacing}rem` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                  <h4 style={styles.itemTitle}>{edu.institution}</h4>
                  <span style={styles.date}>
                    {formatDate(edu.startDate, formatting.dateFormat)} - {edu.current ? 'Present' : formatDate(edu.endDate, formatting.dateFormat)}
                  </span>
                </div>
                <div style={styles.itemSubtitle}>{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</div>
                {edu.description && (
                  <div 
                    className="text-sm mt-1"
                    style={{ 
                      color: 'var(--text-secondary)',
                      lineHeight: meta.typography.lineHeight 
                    }}
                    dangerouslySetInnerHTML={{ __html: edu.description }}
                  />
                )}
              </div>
            ))}
          </section>
        );

      case 'skills':
        return resumeData.skills.length > 0 && (
          <section key="skills" style={styles.section}>
            <h3 style={styles.sectionTitle}>Skills</h3>
            {renderSkills()}
          </section>
        );

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
        return resumeData.languages.length > 0 && (
          <section key="languages" style={styles.section}>
            <h3 style={styles.sectionTitle}>Languages</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem' }}>
              {resumeData.languages.map(lang => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95em' }}>
                  <span style={{ fontWeight: 500 }}>{lang.name}</span>
                  <span style={{ color: '#6b7280' }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {renderHeader()}
      {sectionsOrder.map(section => renderSection(section))}
    </div>
  );
};
