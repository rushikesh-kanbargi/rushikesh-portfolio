import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, GraduationCap, Star, Calendar, MapPin } from 'lucide-react';

interface TimelineItem {
  id: string;
  type: 'work' | 'education' | 'milestone';
  title: string;
  organization: string;
  date: string;
  location: string;
  description: string;
  skills?: string[];
}

const timelineData: TimelineItem[] = [
  {
    id: '1',
    type: 'work',
    title: 'Senior Frontend Engineer',
    organization: 'TechFlow Solutions',
    date: '2021 - Present',
    location: 'San Francisco, CA',
    description: 'Leading the frontend team in migrating legacy systems to React. Improved performance by 40% and established a new design system.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS']
  },
  {
    id: '2',
    type: 'work',
    title: 'Web Developer',
    organization: 'Creative Pulse',
    date: '2018 - 2021',
    location: 'Remote',
    description: 'Developed responsive websites for diverse clients. Collaborated with designers to implement pixel-perfect UIs and integrated payment gateways.',
    skills: ['HTML5', 'SCSS', 'JavaScript', 'Shopify']
  },
  {
    id: '3',
    type: 'education',
    title: 'B.S. Computer Science',
    organization: 'University of California, Berkeley',
    date: '2014 - 2018',
    location: 'Berkeley, CA',
    description: 'Graduated with Honors. Specialized in Human-Computer Interaction and Software Engineering.',
    skills: ['Algorithms', 'Data Structures', 'UI/UX Design']
  },
  {
    id: '4',
    type: 'milestone',
    title: 'First Open Source Contribution',
    organization: 'GitHub',
    date: '2017',
    location: 'Online',
    description: 'Contributed a bug fix to a popular React library, marking the start of my open source journey.',
  }
];

export const Timeline: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md">
              <Calendar size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Career Timeline</h1>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />

          <div className="space-y-12">
            {timelineData.map((item) => (
              <div key={item.id} className="relative flex gap-8 group">
                {/* Icon */}
                <div className={`relative z-10 w-16 h-16 rounded-full border-4 border-slate-50 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${
                  item.type === 'work' ? 'bg-blue-500 text-white' :
                  item.type === 'education' ? 'bg-emerald-500 text-white' :
                  'bg-amber-500 text-white'
                }`}>
                  {item.type === 'work' ? <Briefcase size={24} /> :
                   item.type === 'education' ? <GraduationCap size={24} /> :
                   <Star size={24} />}
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 relative">
                  {/* Arrow */}
                  <div className="absolute left-0 top-8 -translate-x-1/2 w-4 h-4 bg-white border-l border-b border-slate-100 rotate-45" />
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="text-lg font-medium text-slate-700">
                        {item.organization}
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end text-sm text-slate-500 gap-1">
                      <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                        <Calendar size={14} />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {item.skills && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                      {item.skills.map(skill => (
                        <span 
                          key={skill} 
                          className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-md border border-slate-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
