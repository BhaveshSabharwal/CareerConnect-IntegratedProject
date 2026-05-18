import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building, Clock, Briefcase, X } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import FlatButton from '../components/ui/FlatButton';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Application Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching jobs:', err);
        setLoading(false);
      });

    if (token && user?.role === 'STUDENT') {
      fetch('http://localhost:5000/api/resumes', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setResumes(data);
        if (data.length > 0) setSelectedResumeId(data[0].id);
      })
      .catch(console.error);
    }
  }, [token, user]);

  const handleApplyClick = (job) => {
    if (!user) return alert('Please login to apply');
    if (user.role !== 'STUDENT') return alert('Only students can apply for jobs');
    setSelectedJob(job);
    setShowModal(true);
  };

  const submitApplication = async () => {
    if (!selectedResumeId) return alert('Please select a resume. Go to the Resume Builder to create one.');
    try {
      const res = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ job_id: selectedJob.id, resume_id: selectedResumeId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert('Application submitted successfully!');
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

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
        {loading ? (
          <p className="text-white text-center">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-white text-center">No jobs found.</p>
        ) : jobs.map(job => (
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
                <FlatButton onClick={() => handleApplyClick(job)} variant="primary" className="bg-white/10 hover:bg-white/20 text-white w-full md:w-auto">
                  Apply Now
                </FlatButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {showModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard className="w-full max-w-lg p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-2">Apply for {selectedJob.title}</h2>
            <p className="text-slate-400 mb-6">{selectedJob.company}</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Resume to Apply With</label>
              {resumes.length > 0 ? (
                <select 
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#0ea5e9] transition-colors appearance-none"
                >
                  {resumes.map(r => (
                    <option key={r.id} value={r.id} className="bg-[#0f172a]">{r.title}</option>
                  ))}
                </select>
              ) : (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  You don't have any resumes uploaded. Please go to the Resume Builder to upload one.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <FlatButton onClick={() => setShowModal(false)} variant="outline" className="border-white/10 text-slate-300 hover:text-white">
                Cancel
              </FlatButton>
              <FlatButton 
                onClick={submitApplication} 
                variant="primary" 
                disabled={resumes.length === 0}
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white disabled:opacity-50"
              >
                Submit Application
              </FlatButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Jobs;
