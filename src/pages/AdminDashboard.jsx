import React, { useState, useEffect } from 'react';
import { Users, Settings, Activity, CheckCircle, XCircle, ShieldAlert, Briefcase } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import FlatButton from '../components/ui/FlatButton';
import { useAuth } from '../context/AuthContext';
import { Tabs } from '../components/ui/Tabs';
const AdminDashboard = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  
  const fetchData = async () => {
    try {
      const jobsRes = await fetch('http://localhost:5000/api/jobs/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (jobsRes.ok) setJobs(await jobsRes.json());
      
      const usersRes = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const tabs = [
    { id: 'jobs', label: 'Job Approvals', content: <JobApprovalsTab jobs={jobs} token={token} onRefresh={fetchData} /> },
    { id: 'users', label: 'User Moderation', content: <UserModerationTab users={users} token={token} onRefresh={fetchData} /> },
  ];

  const pendingJobsCount = jobs.filter(j => j.status === 'pending_approval').length;
  const blockedUsersCount = users.filter(u => u.status === 'blocked').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><ShieldAlert className="text-red-500" /> Admin Dashboard</h1>
        <p className="text-slate-400">Manage users, approve content, and oversee platform health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard className="flex items-center gap-4 border-l-4 border-blue-500">
          <div className="p-4 bg-blue-500/10 rounded-xl text-blue-500"><Users size={32} /></div>
          <div><h3 className="text-2xl font-bold text-white">{users.length}</h3><p className="text-sm text-slate-400">Total Users</p></div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4 border-l-4 border-yellow-500">
          <div className="p-4 bg-yellow-500/10 rounded-xl text-yellow-500"><Briefcase size={32} /></div>
          <div><h3 className="text-2xl font-bold text-white">{pendingJobsCount}</h3><p className="text-sm text-slate-400">Pending Job Approvals</p></div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4 border-l-4 border-red-500">
          <div className="p-4 bg-red-500/10 rounded-xl text-red-500"><ShieldAlert size={32} /></div>
          <div><h3 className="text-2xl font-bold text-white">{blockedUsersCount}</h3><p className="text-sm text-slate-400">Blocked Users</p></div>
        </GlassCard>
      </div>

      <Tabs tabs={tabs} defaultTab="jobs" />
    </div>
  );
};

const JobApprovalsTab = ({ jobs, token, onRefresh }) => {
  const pendingJobs = jobs.filter(j => j.status === 'pending_approval');
  
  const handleUpdateStatus = async (jobId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        alert(`Job marked as ${status}`);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (pendingJobs.length === 0) {
    return <GlassCard className="text-center py-12"><p className="text-slate-400">No pending jobs to approve. Great job!</p></GlassCard>;
  }

  return (
    <div className="space-y-4">
      {pendingJobs.map(job => (
        <GlassCard key={job.id} className="flex flex-col md:flex-row justify-between gap-4 border border-yellow-500/30 bg-yellow-500/5">
          <div>
            <h4 className="text-lg font-bold text-white">{job.title}</h4>
            <div className="text-sm text-slate-400 space-y-1 mt-1">
              <p><span className="text-slate-500">Company:</span> {job.company}</p>
              <p><span className="text-slate-500">Location:</span> {job.location}</p>
              <p><span className="text-slate-500">Type:</span> {job.type}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.tags && job.tags.map(t => (
                <span key={t} className="px-2 py-0.5 rounded bg-black/30 text-xs text-slate-300 border border-white/5">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FlatButton onClick={() => handleUpdateStatus(job.id, 'rejected')} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
              <XCircle size={16} className="mr-2 inline" /> Reject
            </FlatButton>
            <FlatButton onClick={() => handleUpdateStatus(job.id, 'active')} variant="primary" className="bg-[#10b981] hover:bg-[#059669] text-white">
              <CheckCircle size={16} className="mr-2 inline" /> Approve Job
            </FlatButton>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

const UserModerationTab = ({ users, token, onRefresh }) => {
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'blocked' ? 'block' : 'unblock'} this user?`)) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-black/30 text-xs uppercase font-semibold text-slate-300">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-xs">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                    user.role === 'INTERVIEWER' ? 'bg-[#0ea5e9]/20 text-[#0ea5e9]' :
                    'bg-[#8b5cf6]/20 text-[#8b5cf6]'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.status === 'blocked' ? (
                    <span className="flex items-center gap-1 text-red-500"><ShieldAlert size={14} /> Blocked</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#10b981]"><CheckCircle size={14} /> Active</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {user.role !== 'ADMIN' && (
                    <button 
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      className={`text-xs font-medium hover:underline ${user.status === 'active' ? 'text-red-400' : 'text-[#10b981]'}`}
                    >
                      {user.status === 'active' ? 'Block User' : 'Unblock User'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default AdminDashboard;
