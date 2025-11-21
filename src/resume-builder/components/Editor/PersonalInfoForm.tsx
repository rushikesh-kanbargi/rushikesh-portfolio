import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Upload, Globe, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';

export const PersonalInfoForm: React.FC = () => {
  const { resumeData, updateSection } = useResume();
  const { personalInfo } = resumeData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateSection('personalInfo', {
      ...personalInfo,
      [name]: value,
    });
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-slate-900">Personal Details</h2>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Basic Info</span>
      </div>
      
      <div className="grid grid-cols-1 gap-5">
        {/* Photo Upload */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
          <div className="relative group cursor-pointer">
            {personalInfo.photo ? (
              <img 
                src={personalInfo.photo} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ring-2 ring-white shadow-md">
                <Upload size={24} />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    updateSection('personalInfo', {
                      ...personalInfo,
                      photo: reader.result as string,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-slate-900">Profile Photo</h3>
            <p className="text-xs text-slate-500 mt-0.5">Upload a professional headshot. Recommended size: 400x400px.</p>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={personalInfo.fullName}
            onChange={handleChange}
            placeholder="e.g. Alex Morgan"
            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
          />
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Mail size={14} className="text-slate-400" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={personalInfo.email}
              onChange={handleChange}
              placeholder="alex@example.com"
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Phone size={14} className="text-slate-400" /> Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={personalInfo.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-400" /> Address
          </label>
          <input
            type="text"
            name="address"
            value={personalInfo.address}
            onChange={handleChange}
            placeholder="City, Country"
            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Professional Summary</label>
          <textarea
            name="summary"
            value={personalInfo.summary}
            onChange={handleChange}
            rows={4}
            placeholder="Briefly describe your professional background and key achievements..."
            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-y"
          />
        </div>

        {/* Social Links */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-medium text-slate-900 border-b border-slate-200 pb-2">Social Links</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Globe size={14} className="text-slate-400" /> Website
              </label>
              <input
                type="url"
                name="website"
                value={personalInfo.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Linkedin size={14} className="text-slate-400" /> LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={personalInfo.linkedin}
                  onChange={handleChange}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Github size={14} className="text-slate-400" /> GitHub
                </label>
                <input
                  type="url"
                  name="github"
                  value={personalInfo.github}
                  onChange={handleChange}
                  placeholder="github.com/username"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
