export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
    website: string;
    linkedin: string;
    github: string;
    photo?: string; // Base64 string
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    location: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    location: string;
}

export interface Skill {
    id: string;
    name: string;
    level: number; // 1-5
}

export interface Project {
    id: string;
    name: string;
    description: string;
    technologies: string;
    link: string;
}

export interface Language {
    id: string;
    name: string;
    proficiency: string; // e.g., Native, Fluent, Intermediate
}

export interface ResumeMeta {
    template: string;
    theme: {
        primaryColor: string;
        backgroundColor: string;
        textColor: string;
    };
    typography: {
        fontFamily: string;
        fontSize: number; // Base font size in px
        lineHeight: number;
        headingWeight: 'normal' | 'bold' | '600';
        bodyWeight: 'normal' | '500';
        nameSize: number; // Scale factor or px
        headingSize: number; // Scale factor or px
    };
    spacing: {
        margin: number; // Page margin in mm
        sectionPadding: number; // Spacing between sections in rem
        itemSpacing: number; // Spacing between items in rem
    };
    layout: {
        columns: 1 | 2;
        sidebarPosition: 'left' | 'right'; // For 2-column layouts
        headerLayout: 'left' | 'center' | 'right' | 'photo-left' | 'photo-right';
    };
}

export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
    website: string;
    linkedin: string;
    github: string;
    photo?: string; // Base64 string
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    location: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    location: string;
}

export interface Skill {
    id: string;
    name: string;
    level: number; // 1-5
}

export interface Project {
    id: string;
    name: string;
    description: string;
    technologies: string;
    link: string;
}

export interface Language {
    id: string;
    name: string;
    proficiency: string; // e.g., Native, Fluent, Intermediate
}

export interface ResumeMeta {
    template: string;
    theme: {
        primaryColor: string;
        backgroundColor: string;
        textColor: string;
    };
    typography: {
        fontFamily: string;
        fontSize: number; // Base font size in px
        lineHeight: number;
        headingWeight: 'normal' | 'bold' | '600';
        bodyWeight: 'normal' | '500';
        nameSize: number; // Scale factor or px
        headingSize: number; // Scale factor or px
    };
    spacing: {
        margin: number; // Page margin in mm
        sectionPadding: number; // Spacing between sections in rem
        itemSpacing: number; // Spacing between items in rem
    };
    layout: {
        columns: 1 | 2;
        sidebarPosition: 'left' | 'right'; // For 2-column layouts
        headerLayout: 'left' | 'center' | 'right' | 'photo-left' | 'photo-right';
    };
    formatting: {
        dateFormat: 'MM/YYYY' | 'MMM YYYY' | 'YYYY';
        skillsStyle: 'tags' | 'bubbles' | 'list' | 'bar';
    };
}

export interface CustomSectionItem {
    id: string;
    title: string; // e.g., "Volunteer at Shelter"
    subtitle?: string; // e.g., "2020 - 2021"
    description: string; // Rich text
}

export interface CustomSection {
    id: string;
    title: string; // e.g., "Volunteering", "Publications"
    type: 'list' | 'text'; // 'list' = items like experience, 'text' = single rich text block
    items: CustomSectionItem[];
    isVisible: boolean;
}

export interface ResumeMetadata {
    id: string;
    name: string;
    lastModified: number;
    previewImage?: string;
}

export interface ResumeData {
    id?: string; // Optional for backward compatibility, but should be present
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    languages: Language[];
    customSections: CustomSection[];
    sectionsOrder: string[]; // Array of section keys e.g., ['experience', 'education', 'skills']
    meta: ResumeMeta;
}

export const initialResumeData: ResumeData = {
    personalInfo: {
        fullName: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        phone: '+1 (555) 123-4567',
        address: 'San Francisco, CA',
        summary: 'Creative and detail-oriented Full Stack Developer with 5+ years of experience building scalable web applications. Passionate about UI/UX and clean code.',
        linkedin: 'linkedin.com/in/alexmorgan',
        github: 'github.com/alexmorgan',
        website: 'alexmorgan.dev',
    },
    experience: [
        {
            id: '1',
            company: 'Creative Pulse',
            position: 'Web Developer',
            location: 'San Francisco, CA',
            startDate: '2018-06',
            endDate: '2021-02',
            current: false,
            description: '<p>Developed responsive websites for diverse clients using HTML5, CSS3, and JavaScript. Collaborated with designers to implement pixel-perfect UIs. Integrated third-party APIs for payment processing and social media feeds.</p>',
        },
    ],
    education: [
        {
            id: '1',
            institution: 'University of California, Berkeley',
            degree: 'B.S. Computer Science',
            fieldOfStudy: 'Computer Science',
            location: 'Berkeley, CA',
            startDate: '2014-09',
            endDate: '2018-05',
            current: false,
            description: 'Graduated with Honors. GPA: 3.8/4.0',
        },
    ],
    skills: [
        { id: '1', name: 'JavaScript', level: 5 },
        { id: '2', name: 'React', level: 5 },
        { id: '3', name: 'Node.js', level: 4 },
        { id: '4', name: 'TypeScript', level: 4 },
        { id: '5', name: 'HTML/CSS', level: 5 },
        { id: '6', name: 'Git', level: 4 },
    ],
    projects: [],
    languages: [],
    customSections: [],
    sectionsOrder: ['summary', 'experience', 'education', 'projects', 'skills', 'languages'],
    meta: {
        template: 'modern',
        theme: {
            primaryColor: '#3b82f6',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
        },
        typography: {
            fontFamily: 'Inter',
            fontSize: 14,
            lineHeight: 1.5,
            headingWeight: 'bold',
            bodyWeight: 'normal',
            nameSize: 2.5, // em
            headingSize: 1.1, // em
        },
        spacing: {
            margin: 20,
            sectionPadding: 1.5,
            itemSpacing: 1,
        },
        layout: {
            columns: 1,
            sidebarPosition: 'left',
            headerLayout: 'center',
        },
        formatting: {
            dateFormat: 'MMM YYYY',
            skillsStyle: 'tags',
        },
    },
};
