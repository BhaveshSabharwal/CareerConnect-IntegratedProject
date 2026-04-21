import React from 'react';
import { Compass, BookOpen, Users, Star, Award } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';

const Explorer = () => {
  const learningPaths = [
    { title: 'Frontend Mastery', courses: 12, users: '1.2k', rating: 4.8, color: '#0ea5e9' },
    { title: 'Backend Fundamentals', courses: 8, users: '850', rating: 4.6, color: '#10b981' },
    { title: 'UI/UX Design', courses: 5, users: '640', rating: 4.9, color: '#8b5cf6' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><Compass className="text-[#8b5cf6]" /> Explore</h1>
        <p className="text-slate-400">Discover new career paths, companies, and learning resources.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <BookOpen className="text-[#0ea5e9]" size={20} /> Top Learning Paths
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningPaths.map((path, index) => (
              <GlassCard key={index} className="relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Award size={64} color={path.color} />
                </div>
                <h3 className="text-lg font-bold text-white mb-4">{path.title}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><BookOpen size={14} /> {path.courses} Courses</span>
                  <span className="flex items-center gap-1"><Users size={14} /> {path.users}</span>
                  <span className="flex items-center gap-1 text-yellow-500"><Star size={14} className="fill-current" /> {path.rating}</span>
                </div>
              </GlassCard>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mt-8">
            <Star className="text-yellow-500" size={20} /> Featured Companies
          </h2>
          <GlassCard>
            <div className="text-center py-8">
              <p className="text-slate-400">Company discovery feed coming soon.</p>
            </div>
          </GlassCard>
        </div>

        <div>
          <GlassCard className="sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">Trending Skills</h3>
            <div className="space-y-4">
              {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Figma'].map((skill, i) => (
                <div key={skill} className="flex items-center justify-between">
                  <span className="text-slate-300">{skill}</span>
                  <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6]" 
                      style={{ width: `${85 - i * 5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
