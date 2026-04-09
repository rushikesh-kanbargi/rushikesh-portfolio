import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, ExternalLink, MoreVertical, Briefcase, Search, Globe, Linkedin, TrendingUp, Star, XCircle, Send } from 'lucide-react';

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

const COLUMNS: {
  id: Status;
  title: string;
  color: string;
  leftBorder: string;
  headerText: string;
  icon: React.ReactNode;
  emptyText: string;
}[] = [
  {
    id: 'applied',
    title: 'Applied',
    color: 'bg-blue-50/60 border-blue-100',
    leftBorder: 'border-l-blue-500',
    headerText: 'text-blue-700',
    icon: <Send size={14} />,
    emptyText: 'No applications yet',
  },
  {
    id: 'interviewing',
    title: 'Interviewing',
    color: 'bg-amber-50/60 border-amber-100',
    leftBorder: 'border-l-amber-500',
    headerText: 'text-amber-700',
    icon: <TrendingUp size={14} />,
    emptyText: 'No active interviews',
  },
  {
    id: 'offer',
    title: 'Offer',
    color: 'bg-emerald-50/60 border-emerald-100',
    leftBorder: 'border-l-emerald-500',
    headerText: 'text-emerald-700',
    icon: <Star size={14} />,
    emptyText: 'No offers yet — keep going!',
  },
  {
    id: 'rejected',
    title: 'Rejected',
    color: 'bg-red-50/40 border-red-100',
    leftBorder: 'border-l-red-400',
    headerText: 'text-red-600',
    icon: <XCircle size={14} />,
    emptyText: 'Clean slate here',
  },
];

const STATUS_BADGE: Record<Status, string> = {
  applied: 'bg-blue-100 text-blue-700',
  interviewing: 'bg-amber-100 text-amber-700',
  offer: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
};

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

  const [formData, setFormData] = useState<Partial<Job>>({
    status: 'applied',
    platform: 'other',
    date: new Date().toISOString().split('T')[0],
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
      date: new Date().toISOString().split('T')[0],
    });
    setQuickAddUrl('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.position) return;

    if (editingJob) {
      setJobs((prev) => prev.map((j) => (j.id === editingJob.id ? { ...j, ...formData } as Job : j)));
    } else {
      const newJob: Job = {
        id: crypto.randomUUID(),
        company: formData.company!,
        position: formData.position!,
        status: (formData.status as Status) || 'applied',
        platform: (formData.platform as Platform) || 'other',
        date: formData.date || new Date().toISOString().split('T')[0],
        link: formData.link,
        notes: formData.notes,
      };
      setJobs((prev) => [...prev, newJob]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
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
        date: new Date().toISOString().split('T')[0],
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
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  };

  const getPlatformBadge = (platform: Platform) => {
    const p = PLATFORMS.find((p) => p.id === platform) || PLATFORMS[5];
    return (
      <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${p.color}`}>
        {p.icon}
        {p.name}
      </span>
    );
  };

  // Stats
  const totalApps = jobs.length;
  const responseRate = totalApps > 0
    ? Math.round(((jobs.filter(j => j.status === 'interviewing').length + jobs.filter(j => j.status === 'offer').length) / totalApps) * 100)
    : 0;

  const STATS = [
    { label: 'Applied', count: jobs.filter(j => j.status === 'applied').length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Interviewing', count: jobs.filter(j => j.status === 'interviewing').length, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Offers', count: jobs.filter(j => j.status === 'offer').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Response Rate', count: `${responseRate}%`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <>
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md">
                <Briefcase size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Job Tracker</h1>
                <p className="text-xs text-slate-400">{totalApps} application{totalApps !== 1 ? 's' : ''} tracked</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-1 md:flex-none justify-end">
            <form onSubmit={handleQuickAdd} className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="url"
                value={quickAddUrl}
                onChange={(e) => setQuickAddUrl(e.target.value)}
                placeholder="Paste job URL to quick-add..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
              />
            </form>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Job</span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        {totalApps > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-5 shrink-0">
            {STATS.map(({ label, count, color, bg }) => (
              <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                <p className={`text-xl font-bold ${color}`}>{count}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-4 h-full min-w-[1000px] pb-4">
            {COLUMNS.map((column) => {
              const colJobs = jobs.filter((j) => j.status === column.id);
              return (
                <div
                  key={column.id}
                  className={`flex-1 flex flex-col rounded-xl border border-l-4 ${column.color} ${column.leftBorder} min-w-[240px]`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  {/* Column Header */}
                  <div className={`px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-xl ${column.headerText}`}>
                    <div className="flex items-center gap-2">
                      <span className="opacity-60">{column.icon}</span>
                      <span className="font-bold text-sm">{column.title}</span>
                    </div>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {colJobs.length}
                    </span>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto space-y-3">
                    {colJobs.length === 0 ? (
                      <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-300">
                        <span className="opacity-40">{column.icon}</span>
                        <span className="text-xs">{column.emptyText}</span>
                      </div>
                    ) : (
                      colJobs.map((job) => (
                        <div
                          key={job.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, job.id)}
                          className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                        >
                          {/* Company + Role */}
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0 pr-2">
                              <p className="font-bold text-slate-900 text-sm leading-tight truncate">{job.company}</p>
                              <p className="text-xs text-slate-500 mt-0.5 truncate">{job.position}</p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); openModal(job); }}
                              className="text-slate-300 hover:text-indigo-500 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            >
                              <MoreVertical size={15} />
                            </button>
                          </div>

                          {/* Status badge */}
                          <div className="mb-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${STATUS_BADGE[job.status]}`}>
                              {job.status}
                            </span>
                          </div>

                          {/* Platform + Date + Link */}
                          <div className="flex items-center justify-between">
                            {getPlatformBadge(job.platform)}
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span>{new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              {job.link && (
                                <a
                                  href={job.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-400 hover:text-indigo-600 flex items-center gap-0.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink size={11} />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Notes preview */}
                          {job.notes && (
                            <p className="mt-2 text-[10px] text-slate-400 line-clamp-2 leading-relaxed border-t border-slate-100 pt-2">
                              {job.notes}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">{editingJob ? 'Edit Application' : 'Add New Job'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <Plus size={20} className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Company</label>
                  <input
                    required
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="e.g. Google"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Position</label>
                  <input
                    required
                    type="text"
                    value={formData.position || ''}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="e.g. Senior Developer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                  >
                    {COLUMNS.map((col) => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value as Platform })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Applied Date</label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Job Link <span className="normal-case text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="url"
                  value={formData.link || ''}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Notes <span className="normal-case text-slate-400 font-normal">(optional)</span></label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none text-sm"
                  placeholder="Interview details, salary range, etc..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                {editingJob && (
                  <button
                    type="button"
                    onClick={() => { handleDelete(editingJob.id); closeModal(); }}
                    className="px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors text-sm"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm"
                >
                  {editingJob ? 'Save Changes' : 'Add Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
