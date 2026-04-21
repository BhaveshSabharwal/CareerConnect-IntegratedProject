import React from 'react';
import { Search, MapPin, Building, Clock, Briefcase } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import FlatButton from '../components/ui/FlatButton';

const Jobs = () => {
  const jobs = [
    { id: 1, title: 'Senior Frontend Engineer', company: 'TechNova', location: 'Remote', type: 'Full-time', salary: '₹120k - ₹150k', tags: ['React', 'TypeScript', 'Tailwind'] },
    { id: 2, title: 'UX Designer', company: 'CreativePulse', location: 'New York, NY', type: 'Hybrid', salary: '₹90k - ₹110k', tags: ['Figma', 'UI/UX', 'Prototyping'] },
    { id: 3, title: 'Backend Developer', company: 'DataStream', location: 'San Francisco, CA', type: 'On-site', salary: '₹130k - ₹160k', tags: ['Node.js', 'PostgreSQL', 'AWS'] },
    { id: 4, title: 'Product Manager', company: 'Visionary', location: 'Remote', type: 'Full-time', salary: '₹110k - ₹140k', tags: ['Agile', 'Strategy', 'Jira'] }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><Briefcase className="text-[#0ea5e9]" /> Job Opportunities</h1>
        <p className="text-slate-400">Find your next role matched to your skills and preferences.</p>
      </div>

      <GlassCard className="mb-8 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by job title, skill, or company..." 
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#0ea5e9] transition-colors"
            />
          </div>
          <div className="relative md:w-64">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Location..." 
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#0ea5e9] transition-colors"
            />
          </div>
          <FlatButton variant="primary" className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white py-2.5 px-6 rounded-lg">
            Search
          </FlatButton>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-6">
        {jobs.map(job => (
          <GlassCard key={job.id} className="hover:border-white/20 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1"><Building size={16} /> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={16} /> {job.type}</span>
                  <span className="text-[#10b981] font-medium">{job.salary}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center items-end gap-3">
                <span className="text-xs text-slate-500">Posted 2 days ago</span>
                <FlatButton variant="primary" className="bg-white/10 hover:bg-white/20 text-white w-full md:w-auto">
                  Apply Now
                </FlatButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
