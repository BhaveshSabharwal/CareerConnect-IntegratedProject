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
      <StatCard title="Total Applications" value="24" trend="+3 this week" icon={BriefcaseIcon} color="#0ea5e9" />
      <StatCard title="Interviews Scheduled" value="2" trend="Upcoming in 2 days" icon={Clock} color="#8b5cf6" />
      <StatCard title="Profile Views" value="156" trend="+12% vs last week" icon={TrendingUp} color="#10b981" />
      <StatCard title="Skills Matched" value="85%" trend="Top 10% of applicants" icon={CheckCircle} color="#0ea5e9" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <GlassCard className="h-96 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Application Success Rate</h3>
          {/* Placeholder for flat graph with borders, no shadow */}
          <div className="flex-1 border border-white/10 rounded-lg bg-black/20 flex items-end justify-between p-4 gap-2">
             {[40, 60, 45, 80, 50, 90, 75].map((h, i) => (
                <div key={i} className="w-full bg-[#0ea5e9]/80 rounded-t-sm" style={{ height: `${h}%` }}></div>
             ))}
          </div>
        </GlassCard>
      </div>
      <div>
        <GlassCard className="h-96">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-start gap-3 border-b border-white/5 pb-4 last:border-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#8b5cf6]"></div>
                <div>
                  <p className="text-sm text-slate-200">Applied for Frontend Developer at TechCorp</p>
                  <p className="text-xs text-slate-500">2 days ago</p>
                </div>
              </div>
            ))}
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
        {[
          { text: "Completed Mock Interview for Frontend role", time: "2 hours ago", color: "bg-[#10b981]" },
          { text: "Updated resume with React experience", time: "Yesterday", color: "bg-[#0ea5e9]" },
          { text: "Saved 3 new job postings", time: "2 days ago", color: "bg-[#8b5cf6]" }
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 border-b border-white/5 pb-4 last:border-0 last:pb-0">
            <div className={`w-2 h-2 mt-2 rounded-full ${item.color}`}></div>
            <div>
              <p className="text-sm text-slate-200">{item.text}</p>
              <p className="text-xs text-slate-500">{item.time}</p>
            </div>
          </div>
        ))}
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
        {['Senior Frontend Engineer', 'UI Developer', 'Product Designer'].map((role, i) => (
          <div key={i} className="p-3 rounded-lg border border-white/10 bg-white/5 flex justify-between items-center hover:border-white/20 transition-colors">
            <span className="text-sm text-slate-200">{role}</span>
            <button className="text-xs text-[#0ea5e9] hover:underline">View</button>
          </div>
        ))}
      </div>
    </GlassCard>
    <GlassCard>
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
        <span className="text-[#8b5cf6]">✦</span> Skill Gap Analysis
      </h3>
      <p className="text-sm text-slate-400 mb-4">Skills to improve for your target roles.</p>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-200">TypeScript</span>
            <span className="text-[#8b5cf6]">60%</span>
          </div>
          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
            <div className="h-full bg-[#8b5cf6] rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-200">GraphQL</span>
            <span className="text-[#0ea5e9]">40%</span>
          </div>
          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
            <div className="h-full bg-[#0ea5e9] rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>
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
