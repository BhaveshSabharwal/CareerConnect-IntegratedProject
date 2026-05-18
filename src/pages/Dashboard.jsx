import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, CheckCircle, Clock, Briefcase as BriefcaseIcon } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { Tabs } from '../components/ui/Tabs';

import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (token && user?.role === 'STUDENT') {
      fetch('http://localhost:5000/api/applications/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(console.error);
    }
  }, [token, user]);

  const tabs = [
    { id: 'overview', label: 'Overview', content: <OverviewTab applications={applications} /> },
    { id: 'activity', label: 'Activity', content: <ActivityTab applications={applications} /> },
    { id: 'ai-suggestions', label: 'AI Suggestions', content: <AISuggestionsTab /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
        <p className="text-slate-400">Here's what's happening with your career journey today.</p>
      </div>

      <Tabs tabs={tabs} defaultTab="overview" />
    </div>
  );
};

const OverviewTab = ({ applications }) => {
  const safeApps = Array.isArray(applications) ? applications : [];
  const totalApps = safeApps.length || 0;
  const interviews = safeApps.filter(a => a.status === 'interview_scheduled').length || 0;
  
  return (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Total Applications" value={totalApps} trend="+2 this week" icon={BriefcaseIcon} color="#0ea5e9" />
      <StatCard title="Interviews Scheduled" value={interviews} trend="-" icon={Clock} color="#8b5cf6" />
      <StatCard title="Profile Views" value="12" trend="+4 this week" icon={TrendingUp} color="#10b981" />
      <StatCard title="Skills Matched" value="85%" trend="+5%" icon={CheckCircle} color="#0ea5e9" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <GlassCard className="h-96 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Application Success Rate</h3>
          {/* Placeholder for flat graph with borders, no shadow */}
          <div className="flex-1 border border-white/10 rounded-lg bg-black/20 flex items-center justify-center p-4 gap-2">
             <span className="text-slate-500 text-sm">No data available yet.</span>
          </div>
        </GlassCard>
      </div>
      <div>
        <GlassCard className="h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {Array.isArray(applications) && applications.length > 0 ? applications.map(app => (
              <div key={app.id} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="font-semibold text-white">{app.Job?.title}</div>
                <div className="text-sm text-slate-400">{app.Job?.company}</div>
                <div className="text-xs mt-2 px-2 py-1 inline-block rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {app.status.toUpperCase()}
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No applications yet.</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
  );
};

const ActivityTab = () => (
  <div className="space-y-4">
    <GlassCard>
      <h3 className="text-lg font-semibold text-white mb-4">This Week</h3>
      <div className="space-y-4">
        <p className="text-sm text-slate-500">No activity this week.</p>
      </div>
    </GlassCard>
  </div>
);

const AISuggestionsTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <GlassCard>
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
        <span className="text-[#0ea5e9]">✦</span> Recommended Roles
      </h3>
      <p className="text-sm text-slate-400 mb-4">Based on your recent React and UI/UX activities.</p>
      <div className="space-y-3">
        <p className="text-sm text-slate-500">No AI recommendations available yet.</p>
      </div>
    </GlassCard>
    <GlassCard>
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
        <span className="text-[#8b5cf6]">✦</span> Skill Gap Analysis
      </h3>
      <p className="text-sm text-slate-400 mb-4">Skills to improve for your target roles.</p>
      <div className="space-y-4">
        <p className="text-sm text-slate-500">Not enough data for skill gap analysis.</p>
      </div>
    </GlassCard>
  </div>
);

const StatCard = ({ title, value, trend, icon: Icon, color }) => (
  <GlassCard className="flex flex-col gap-2 relative overflow-hidden">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
      <Icon size={18} color={color} />
    </div>
    <div className="text-3xl font-bold text-white">{value}</div>
    <div className="text-xs text-slate-500 mt-1">{trend}</div>
    <div 
      className="absolute bottom-0 right-0 w-16 h-16 blur-2xl rounded-full opacity-20"
      style={{ backgroundColor: color }}
    ></div>
  </GlassCard>
);

export default Dashboard;
