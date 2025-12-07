import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Upload, Globe, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';

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
        <Input
          label="Full Name"
          name="fullName"
          value={personalInfo.fullName}
          onChange={handleChange}
          placeholder="e.g. Alex Morgan"
        />

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Email"
            icon={Mail}
            type="email"
            name="email"
            value={personalInfo.email}
            onChange={handleChange}
            placeholder="alex@example.com"
          />
          <Input
            label="Phone"
            icon={Phone}
            type="tel"
            name="phone"
            value={personalInfo.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Address */}
        <Input
          label="Address"
          icon={MapPin}
          name="address"
          value={personalInfo.address}
          onChange={handleChange}
          placeholder="City, Country"
        />

        {/* Summary */}
        <div>
          <Textarea
            label="Professional Summary"
            name="summary"
            value={personalInfo.summary}
            onChange={handleChange}
            rows={4}
            placeholder="Briefly describe your professional background and key achievements..."
            className="resize-y"
          />
        </div>

        {/* Social Links */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-medium text-slate-900 border-b border-slate-200 pb-2">Social Links</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Website"
              icon={Globe}
              type="url"
              name="website"
              value={personalInfo.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="LinkedIn"
                icon={Linkedin}
                type="url"
                name="linkedin"
                value={personalInfo.linkedin}
                onChange={handleChange}
                placeholder="linkedin.com/in/username"
              />
              <Input
                label="GitHub"
                icon={Github}
                type="url"
                name="github"
                value={personalInfo.github}
                onChange={handleChange}
                placeholder="github.com/username"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
