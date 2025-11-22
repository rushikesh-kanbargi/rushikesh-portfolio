import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, ExternalLink, MoreVertical, Briefcase, Search, Globe, Linkedin, Building2 } from 'lucide-react';

type Status = 'applied' | 'interviewing' | 'offer' | 'rejected';
type Platform = 'linkedin' | 'naukri' | 'instahire' | 'hirist' | 'wellfound' | 'other';

interface Job {
  id: string;
  company: string;
  position: string;
  status: Status;
  platform: Platform;
  date: string;
  link?: string;
  notes?: string;
}

const COLUMNS: { id: Status; title: string; color: string }[] = [
  { id: 'applied', title: 'Applied', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'interviewing', title: 'Interviewing', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 'offer', title: 'Offer', color: 'bg-green-100 text-green-800 border-green-200' },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200' },
];

const PLATFORMS: { id: Platform; name: string; icon: React.ReactNode; color: string }[] = [
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={14} />, color: 'bg-[#0077b5] text-white' },
  { id: 'naukri', name: 'Naukri', icon: <span className="font-bold text-[10px]">N</span>, color: 'bg-[#2557a7] text-white' },
  { id: 'instahire', name: 'Instahire', icon: <span className="font-bold text-[10px]">I</span>, color: 'bg-[#00b050] text-white' },
  { id: 'hirist', name: 'Hirist', icon: <span className="font-bold text-[10px]">H</span>, color: 'bg-[#000000] text-white' },
  { id: 'wellfound', name: 'Wellfound', icon: <span className="font-bold text-[10px]">W</span>, color: 'bg-[#cc2127] text-white' },
  { id: 'other', name: 'Other', icon: <Globe size={14} />, color: 'bg-slate-500 text-white' },
];

export const JobTracker: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('job_tracker_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [quickAddUrl, setQuickAddUrl] = useState('');
  
  // Form State
  const [formData, setFormData] = useState<Partial<Job>>({
    status: 'applied',
    platform: 'other',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    localStorage.setItem('job_tracker_data', JSON.stringify(jobs));
  }, [jobs]);

  const parseUrl = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      if (hostname.includes('linkedin')) return 'linkedin';
      if (hostname.includes('naukri')) return 'naukri';
      if (hostname.includes('instahire')) return 'instahire';
      if (hostname.includes('hirist')) return 'hirist';
      if (hostname.includes('wellfound') || hostname.includes('angel.co')) return 'wellfound';
      return 'other';
    } catch {
      return 'other';
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddUrl.trim()) return;

    const platform = parseUrl(quickAddUrl);
    setEditingJob(null);
    setFormData({
      status: 'applied',
      platform,
      link: quickAddUrl,
      date: new Date().toISOString().split('T')[0]
    });
    setQuickAddUrl('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.position) return;

    if (editingJob) {
      setJobs(prev => prev.map(j => j.id === editingJob.id ? { ...j, ...formData } as Job : j));
    } else {
      const newJob: Job = {
        id: crypto.randomUUID(),
        company: formData.company!,
        position: formData.position!,
        status: formData.status as Status || 'applied',
        platform: formData.platform as Platform || 'other',
        date: formData.date || new Date().toISOString().split('T')[0],
        link: formData.link,
        notes: formData.notes
      };
      setJobs(prev => [...prev, newJob]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      setJobs(prev => prev.filter(j => j.id !== id));
    }
  };

  const openModal = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      setFormData(job);
    } else {
      setEditingJob(null);
      setFormData({
        status: 'applied',
        platform: 'other',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
    setFormData({});
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
  };

  const getPlatformBadge = (platform: Platform) => {
    const p = PLATFORMS.find(p => p.id === platform) || PLATFORMS[5];
    return (
      <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${p.color}`}>
        {p.icon}
        {p.name}
      </span>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md">
                <Briefcase size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Job Application Tracker</h1>
            </div>
          </div>

          <div className="flex gap-4 flex-1 md:flex-none justify-end">
            <form onSubmit={handleQuickAdd} className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="url"
                value={quickAddUrl}
                onChange={(e) => setQuickAddUrl(e.target.value)}
                placeholder="Paste job link to quick add..."
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </form>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Job</span>
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-6 h-full min-w-[1000px] pb-4">
            {COLUMNS.map(column => (
              <div 
                key={column.id}
                className="flex-1 flex flex-col bg-slate-100 rounded-xl border border-slate-200 min-w-[280px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className={`p-3 border-b border-slate-200 rounded-t-xl font-semibold flex justify-between items-center ${column.color} bg-opacity-20`}>
                  <span>{column.title}</span>
                  <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs">
                    {jobs.filter(j => j.status === column.id).length}
                  </span>
                </div>
                
                <div className="flex-1 p-3 overflow-y-auto space-y-3">
                  {jobs.filter(j => j.status === column.id).map(job => (
                    <div
                      key={job.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, job.id)}
                      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col gap-1">
                          <h3 className="font-semibold text-slate-900 leading-tight">{job.position}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600 text-sm flex items-center gap-1">
                              <Building2 size={12} />
                              {job.company}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openModal(job); }}
                          className="text-slate-400 hover:text-blue-600 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3">
                        {getPlatformBadge(job.platform)}
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{job.date}</span>
                          {job.link && (
                            <a 
                              href={job.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-900">{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <input
                  required
                  type="text"
                  value={formData.company || ''}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Google"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                <input
                  required
                  type="text"
                  value={formData.position || ''}
                  onChange={e => setFormData({...formData, position: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Senior Developer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as Status})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {COLUMNS.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={e => setFormData({...formData, platform: e.target.value as Platform})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {PLATFORMS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Link (Optional)</label>
                <input
                  type="url"
                  value={formData.link || ''}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                  placeholder="Interview details, salary range, etc..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                {editingJob && (
                  <button
                    type="button"
                    onClick={() => { handleDelete(editingJob.id); closeModal(); }}
                    className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {editingJob ? 'Save Changes' : 'Add Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
