import React, { useState, useEffect } from 'react';
import { Calendar, Video, Clock, Briefcase, Users, Plus, CheckCircle, XCircle } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import FlatButton from '../components/ui/FlatButton';
import { useAuth } from '../context/AuthContext';
import { Tabs } from '../components/ui/Tabs';
const InterviewerDashboard = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setJobs(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchJobs();
  }, [token]);

  const tabs = [
    { id: 'jobs', label: 'My Jobs & Applicants', content: <JobsTab jobs={jobs} token={token} onRefresh={fetchJobs} /> },
    { id: 'post', label: 'Post a Job', content: <PostJobTab token={token} onJobPosted={fetchJobs} /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Interviewer Dashboard</h1>
        <p className="text-slate-400">Manage your job listings and evaluate candidates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard className="flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 rounded-xl text-blue-500"><Briefcase size={32} /></div>
          <div><h3 className="text-2xl font-bold text-white">{jobs.length}</h3><p className="text-sm text-slate-400">Total Postings</p></div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-xl text-purple-500"><Clock size={32} /></div>
          <div><h3 className="text-2xl font-bold text-white">{jobs.filter(j => j.status === 'pending_approval').length}</h3><p className="text-sm text-slate-400">Pending Approval</p></div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="p-4 bg-[#10b981]/10 rounded-xl text-[#10b981]"><CheckCircle size={32} /></div>
          <div><h3 className="text-2xl font-bold text-white">{jobs.filter(j => j.status === 'active').length}</h3><p className="text-sm text-slate-400">Active Jobs</p></div>
        </GlassCard>
      </div>

      <Tabs tabs={tabs} defaultTab="jobs" />
    </div>
  );
};

const JobsTab = ({ jobs, token, onRefresh }) => {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  
  const handleViewApplicants = async (jobId) => {
    setSelectedJobId(jobId);
    try {
      const res = await fetch(`http://localhost:5000/api/applications/job/${jobId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setApplicants(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (appId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        handleViewApplicants(selectedJobId);
        alert(`Applicant status updated to ${status}. Notification sent.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-xl font-bold text-white">Your Job Postings</h3>
        {jobs.map(job => (
          <GlassCard 
            key={job.id} 
            className={`cursor-pointer transition-colors ${selectedJobId === job.id ? 'border-[#0ea5e9] bg-[#0ea5e9]/10' : 'hover:border-white/20'}`}
            onClick={() => handleViewApplicants(job.id)}
          >
            <h4 className="font-bold text-white">{job.title}</h4>
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="text-slate-400">{job.location}</span>
              <span className={`px-2 py-0.5 rounded text-xs ${
                job.status === 'active' ? 'bg-[#10b981]/20 text-[#10b981]' : 
                job.status === 'pending_approval' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
              }`}>
                {job.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
      
      <div className="lg:col-span-2">
        <GlassCard className="min-h-[500px]">
          {selectedJobId ? (
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users size={20} className="text-[#8b5cf6]" /> Applicants ({applicants.length})
              </h3>
              <div className="space-y-4">
                {applicants.length > 0 ? applicants.map(app => (
                  <div key={app.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-white">{app.student?.name}</h4>
                        <p className="text-sm text-slate-400">{app.student?.email}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded border border-white/10 uppercase">
                        {app.status}
                      </span>
                    </div>
                    
                    <div className="mb-4 p-3 bg-black/30 rounded border border-white/5">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Resume: {app.Resume?.title}</span>
                        <span className="text-[#10b981] font-bold">AI Score: {app.Resume?.ai_score}</span>
                      </div>
                    </div>
                    
                    {app.status === 'applied' && (
                      <div className="flex gap-2 justify-end">
                        <FlatButton onClick={() => handleUpdateStatus(app.id, 'rejected')} variant="outline" className="text-xs py-1 border-red-500/30 text-red-400 hover:bg-red-500/10">
                          <XCircle size={14} className="mr-1 inline" /> Reject
                        </FlatButton>
                        <FlatButton onClick={() => handleUpdateStatus(app.id, 'shortlisted')} variant="primary" className="text-xs py-1 bg-[#0ea5e9] hover:bg-[#0284c7] text-white">
                          <CheckCircle size={14} className="mr-1 inline" /> Shortlist
                        </FlatButton>
                      </div>
                    )}
                    {app.status === 'shortlisted' && (
                      <div className="flex gap-2 justify-end">
                        <FlatButton onClick={() => handleUpdateStatus(app.id, 'interview_scheduled')} variant="primary" className="text-xs py-1 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white">
                          <Video size={14} className="mr-1 inline" /> Schedule Interview
                        </FlatButton>
                      </div>
                    )}
                  </div>
                )) : (
                  <p className="text-slate-400 text-center py-8">No applicants for this job yet.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
              <Users size={48} className="mb-4 opacity-50" />
              <p>Select a job from the left to view its applicants.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

const PostJobTab = ({ token, onJobPosted }) => {
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', type: 'Full-time', salary: '', tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, tags: tagsArray })
      });
      if (res.ok) {
        alert('Job posted successfully! Pending admin approval.');
        setFormData({ title: '', company: '', location: '', type: 'Full-time', salary: '', tags: '' });
        onJobPosted();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <GlassCard className="max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Plus size={20} className="text-[#10b981]" /> Post a New Job
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Job Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Company Name</label>
            <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Location</label>
            <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Job Type</label>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white appearance-none">
              <option className="bg-[#0f172a]">Full-time</option>
              <option className="bg-[#0f172a]">Part-time</option>
              <option className="bg-[#0f172a]">Internship</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Salary Range</label>
          <input required type="text" placeholder="e.g., $80,000 - $100,000" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Tags (comma separated)</label>
          <input type="text" placeholder="React, Node.js, Remote" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white" />
        </div>
        <FlatButton type="submit" variant="primary" className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-3 mt-4">
          Submit for Approval
        </FlatButton>
      </form>
    </GlassCard>
  )}

export default InterviewerDashboard;
