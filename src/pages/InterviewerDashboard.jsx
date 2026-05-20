import React, { useState, useEffect } from 'react';
import { Calendar, Video, Clock, Briefcase, Users, Plus, CheckCircle, XCircle, FileText, Download, User, Star, Trash2 } from 'lucide-react';
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
        <h1 className="text-3xl font-bold text-white mb-2">Interviewer Hub</h1>
        <p className="text-slate-400">Post roles, evaluate resume matches, and schedule Google Meet interviews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Briefcase size={28} /></div>
          <div><h3 className="text-xl font-bold text-white">{jobs.length}</h3><p className="text-xs text-slate-400">Total Postings</p></div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500"><Clock size={28} /></div>
          <div><h3 className="text-xl font-bold text-white">{jobs.filter(j => j.status === 'pending_approval').length}</h3><p className="text-xs text-slate-400">Pending Approval</p></div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 bg-[#10b981]/10 rounded-xl text-[#10b981]"><CheckCircle size={28} /></div>
          <div><h3 className="text-xl font-bold text-white">{jobs.filter(j => j.status === 'active').length}</h3><p className="text-xs text-slate-400">Active Listings</p></div>
        </GlassCard>
      </div>

      <Tabs tabs={tabs} defaultTab="jobs" />
    </div>
  );
};

const JobsTab = ({ jobs, token, onRefresh }) => {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  
  // Slide-in drawer resume state
  const [viewingResume, setViewingResume] = useState(null);

  // Scheduling Modal State
  const [schedulingApp, setSchedulingApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [meetLink, setMeetLink] = useState('');

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

  const handleUpdateStatus = async (appId, status, extraBody = {}) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status, ...extraBody })
      });
      if (res.ok) {
        handleViewApplicants(selectedJobId);
        onRefresh();
        alert(`Applicant status successfully updated to ${status}. Outgoing email log flushed.`);
      } else {
        const errorData = await res.json();
        alert(errorData.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Scheduler Modal
  const openScheduler = (app) => {
    setSchedulingApp(app);
    setInterviewDate('');
    // Auto-populate an unique Google Meet Link for convenience
    setMeetLink(`https://meet.google.com/cc-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`);
  };

  const submitScheduler = async () => {
    if (!interviewDate) return alert('Please select a Date and Time for the interview.');
    await handleUpdateStatus(schedulingApp.id, 'interview_scheduled', {
      interview_date: interviewDate,
      meeting_link: meetLink
    });
    setSchedulingApp(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      {/* Left Column Job Selection */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-1.5"><Briefcase size={18} className="text-[#0ea5e9]" /> Jobs Posted</h3>
        {jobs.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No job openings created yet.</p>
        ) : jobs.map(job => (
          <GlassCard 
            key={job.id} 
            className={`cursor-pointer transition-all border ${selectedJobId === job.id ? 'border-[#0ea5e9] bg-[#0ea5e9]/10' : 'border-white/5 hover:border-white/10 bg-black/20'}`}
            onClick={() => handleViewApplicants(job.id)}
          >
            <h4 className="font-bold text-white text-sm">{job.title}</h4>
            <div className="flex justify-between items-center mt-3 text-xs">
              <span className="text-slate-400">{job.location}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                job.status === 'active' ? 'bg-[#10b981]/20 text-[#10b981]' : 
                job.status === 'pending_approval' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
              }`}>
                {job.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
      
      {/* Right Column Applicants Details */}
      <div className="lg:col-span-2">
        <GlassCard className="min-h-[500px]">
          {selectedJobId ? (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users size={18} className="text-[#8b5cf6]" /> Candidates Matched ({applicants.length})
              </h3>
              <div className="space-y-4">
                {applicants.length > 0 ? applicants.map(app => (
                  <div key={app.id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">{app.student?.name}</h4>
                        <p className="text-xs text-slate-400">{app.student?.email}</p>
                      </div>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-mono ${
                        app.status === 'selected' ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20' :
                        app.status === 'interview_scheduled' ? 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20' :
                        app.status === 'shortlisted' ? 'bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/20' :
                        'bg-slate-800 text-slate-400 border-white/5'
                      }`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="mb-4 p-3 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between gap-4">
                      <div className="truncate">
                        <div className="text-xs text-white font-medium truncate flex items-center gap-1.5">
                          <FileText size={12} className="text-[#8b5cf6]" /> {app.Resume?.title || "Default Profile Resume"}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-[#10b981] font-bold">Match Score: {app.Resume?.ai_score}%</span>
                        <button 
                          onClick={() => setViewingResume(app.Resume)}
                          className="text-xs text-[#0ea5e9] hover:underline font-bold"
                        >
                          Open Reviewer
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      {app.status === 'applied' && (
                        <>
                          <FlatButton onClick={() => handleUpdateStatus(app.id, 'rejected')} variant="outline" className="text-[10px] py-1 px-3 border-red-500/20 text-red-400 hover:bg-red-500/10">
                            <XCircle size={12} className="mr-1 inline" /> Reject
                          </FlatButton>
                          <FlatButton onClick={() => handleUpdateStatus(app.id, 'shortlisted')} variant="primary" className="text-[10px] py-1 px-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white">
                            <CheckCircle size={12} className="mr-1 inline" /> Shortlist
                          </FlatButton>
                        </>
                      )}
                      {app.status === 'shortlisted' && (
                        <FlatButton onClick={() => openScheduler(app)} variant="primary" className="text-[10px] py-1 px-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white">
                          <Calendar size={12} className="mr-1 inline" /> Schedule Interview
                        </FlatButton>
                      )}
                      {app.status === 'interview_scheduled' && (
                        <FlatButton onClick={() => handleUpdateStatus(app.id, 'selected')} variant="primary" className="text-[10px] py-1 px-3 bg-[#10b981] hover:bg-[#059669] text-white">
                          <CheckCircle size={12} className="mr-1 inline" /> Make Offer
                        </FlatButton>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-500 text-xs italic text-center py-16">No applicants have registered for this posting yet.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-24">
              <Users size={48} className="mb-4 opacity-30 text-[#8b5cf6]" />
              <p className="text-xs">Select a job posting from the list to manage and schedule candidates.</p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* In-Built sliding resume parser panel drawer */}
      {viewingResume && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#0f172a] border-l border-white/10 h-full p-6 shadow-2xl overflow-y-auto flex flex-col relative animate-in slide-in-from-right duration-300">
            <button 
              onClick={() => setViewingResume(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle size={22} />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-1.5">
              <User size={18} className="text-[#8b5cf6]" /> Candidate In-App Viewer
            </h3>
            <p className="text-xs text-slate-400 mb-4 border-b border-white/5 pb-3">Scan resume details, scores, and tech keyword indicators on the fly.</p>

            <div className="space-y-6">
              {/* Circular Score representation */}
              <GlassCard className="text-center relative py-4 bg-[#8b5cf6]/5 border border-[#8b5cf6]/20">
                <div className="text-2xl font-black text-white">{viewingResume.ai_score}%</div>
                <div className="text-[10px] text-[#10b981] font-bold mt-1">Verified Audit Score</div>
              </GlassCard>

              {/* Parsed Body Area */}
              <div>
                <h4 className="text-xs font-bold text-[#0ea5e9] uppercase tracking-wider mb-2">Extracted Body Text</h4>
                <div className="p-3 bg-black/30 border border-white/5 rounded-lg text-xs text-slate-300 leading-relaxed font-mono max-h-48 overflow-y-auto">
                  {viewingResume.parsed_content || "No textual resume parsed information uploaded. File is clean PDF attachment format."}
                </div>
              </div>

              {/* Extracted Details summary */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1"><Star size={12} className="text-yellow-500" /> Extracted Skill Indicators</h4>
                <div className="flex flex-wrap gap-1.5">
                  {viewingResume.parsed_content ? 
                    ['react', 'javascript', 'typescript', 'node', 'express', 'sql', 'postgres', 'mongodb', 'docker', 'aws', 'git', 'figma']
                      .filter(skill => viewingResume.parsed_content.toLowerCase().includes(skill))
                      .map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/20 text-[10px] text-[#10b981] capitalize font-bold">
                          {skill}
                        </span>
                      ))
                    : <span className="text-xs text-slate-500 italic">No skill tags extracted.</span>
                  }
                </div>
              </div>
            </div>

            <FlatButton 
              onClick={() => setViewingResume(null)}
              variant="outline"
              className="mt-auto border-white/10 text-xs w-full text-white"
            >
              Close Viewer
            </FlatButton>
          </div>
        </div>
      )}

      {/* Scheduling Interview Popup Modal */}
      {schedulingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md p-6 relative border-[#8b5cf6]/30">
            <button 
              onClick={() => setSchedulingApp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle size={18} />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-1.5">
              <Calendar size={18} className="text-[#8b5cf6]" /> Schedule Discussion
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-medium">Candidate: {schedulingApp.student?.name}</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Select Date & Time</label>
                <input 
                  required
                  type="datetime-local" 
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Auto-Generated Google Meet URL</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-slate-300 font-mono focus:outline-none"
                  />
                  <span className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg flex-shrink-0">
                    <Video size={16} />
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <FlatButton 
                onClick={() => setSchedulingApp(null)}
                variant="outline"
                className="border-white/10 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </FlatButton>
              <FlatButton 
                onClick={submitScheduler}
                variant="primary"
                className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-bold px-4"
              >
                Confirm Schedule
              </FlatButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

const PostJobTab = ({ token, onJobPosted }) => {
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', type: 'Full-time', salary: '', tags: '', description: '', jd_url: ''
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
        alert('Job posted successfully! Pending Admin Approval.');
        setFormData({ title: '', company: '', location: '', type: 'Full-time', salary: '', tags: '', description: '', jd_url: '' });
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
    <GlassCard className="max-w-2xl mx-auto border-t-2 border-[#10b981]">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Plus size={20} className="text-[#10b981]" /> Post a New Opening
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Job Title</label>
            <input required type="text" placeholder="e.g. Lead Frontend Developer" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-xs text-white" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Company Name</label>
            <input required type="text" placeholder="e.g. Stripe Inc" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-xs text-white" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Location</label>
            <input required type="text" placeholder="e.g. San Francisco, CA or Remote" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-xs text-white" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Job Type</label>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-xs text-white appearance-none">
              <option className="bg-[#0f172a]">Full-time</option>
              <option className="bg-[#0f172a]">Part-time</option>
              <option className="bg-[#0f172a]">Internship</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Salary Range</label>
            <input required type="text" placeholder="e.g. $120,000 - $140,000" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-xs text-white" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Tags (comma separated)</label>
            <input type="text" placeholder="React, Python, Node" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-xs text-white" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Detailed Job Description</label>
          <textarea required rows={4} placeholder="Summarize skills, day-to-day requirements, and technology specifications..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 resize-none" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Mock JD URL / PDF Attachment Link</label>
          <input type="text" placeholder="https://example.com/attachments/jd_file.pdf" value={formData.jd_url} onChange={e => setFormData({...formData, jd_url: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-xs text-slate-200" />
        </div>
        
        <FlatButton type="submit" variant="primary" className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-3 text-xs font-bold mt-4">
          Post & Submit for Admin Approval
        </FlatButton>
      </form>
    </GlassCard>
  )}

export default InterviewerDashboard;
