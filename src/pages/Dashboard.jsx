import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { Tabs } from '../components/ui/Tabs';

const Dashboard = () => {
  const tabs = [
    { id: 'overview', label: 'Overview', content: <OverviewTab /> },
    { id: 'activity', label: 'Activity', content: <ActivityTab /> },
    { id: 'ai-suggestions', label: 'AI Suggestions', content: <AISuggestionsTab /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Alex</h1>
        <p className="text-slate-400">Here's what's happening with your career journey today.</p>
      </div>

      <Tabs tabs={tabs} defaultTab="overview" />
    </div>
  );
};

const OverviewTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Total Applications" value="0" trend="-" icon={BriefcaseIcon} color="#0ea5e9" />
      <StatCard title="Interviews Scheduled" value="0" trend="-" icon={Clock} color="#8b5cf6" />
      <StatCard title="Profile Views" value="0" trend="-" icon={TrendingUp} color="#10b981" />
      <StatCard title="Skills Matched" value="0%" trend="-" icon={CheckCircle} color="#0ea5e9" />
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
        <GlassCard className="h-96">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <p className="text-sm text-slate-500">No recent activity.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
);

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

// Helper for icon since we missed importing Briefcase in Dashboard
import { Briefcase as BriefcaseIcon } from 'lucide-react';

export default Dashboard;
