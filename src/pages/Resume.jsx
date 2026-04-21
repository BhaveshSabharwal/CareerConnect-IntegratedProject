import React from 'react';
import { FileText, Download, Edit3, Plus, Layers } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import FlatButton from '../components/ui/FlatButton';

const Resume = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><FileText className="text-[#10b981]" /> Resume Builder</h1>
          <p className="text-slate-400">Manage your professional profile and generate stunning resumes.</p>
        </div>
        <div className="flex gap-3">
          <FlatButton variant="outline" className="border-white/10 hover:bg-white/5 text-white flex items-center gap-2">
            <Edit3 size={16} /> Edit Profile
          </FlatButton>
          <FlatButton variant="primary" className="bg-[#10b981] hover:bg-[#059669] text-white flex items-center gap-2">
            <Download size={16} /> Export PDF
          </FlatButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center mb-4 border-4 border-black/50">
              <span className="text-3xl font-bold text-white">AJ</span>
            </div>
            <h2 className="text-xl font-bold text-white">Alex Johnson</h2>
            <p className="text-[#0ea5e9] mb-4">Frontend Developer</p>
            <div className="text-sm text-slate-400 space-y-2">
              <p>alex.johnson@example.com</p>
              <p>San Francisco, CA</p>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Layers size={18} className="text-[#8b5cf6]" /> Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'JavaScript', 'HTML/CSS', 'Tailwind', 'Git', 'Figma'].map(skill => (
                <span key={skill} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300">
                  {skill}
                </span>
              ))}
              <button className="px-3 py-1 rounded-md bg-white/5 border border-dashed border-white/20 text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                <Plus size={12} /> Add
              </button>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Experience</h3>
              <button className="text-[#0ea5e9] hover:text-blue-400 text-sm font-medium flex items-center gap-1">
                <Plus size={16} /> Add Experience
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="relative pl-6 border-l border-white/10">
                <div className="absolute w-3 h-3 bg-[#0ea5e9] rounded-full -left-[6.5px] top-1"></div>
                <h4 className="text-lg font-bold text-white">Frontend Developer</h4>
                <p className="text-slate-400 font-medium">TechCorp Inc.</p>
                <p className="text-sm text-slate-500 mb-2">Jan 2022 - Present</p>
                <p className="text-sm text-slate-300">Developed and maintained user-facing features using React.js. Collaborated with back-end developers and web designers to improve usability.</p>
              </div>
              
              <div className="relative pl-6 border-l border-white/10">
                <div className="absolute w-3 h-3 bg-slate-600 rounded-full -left-[6.5px] top-1"></div>
                <h4 className="text-lg font-bold text-white">Junior Web Developer</h4>
                <p className="text-slate-400 font-medium">Digital Agency</p>
                <p className="text-sm text-slate-500 mb-2">Jun 2020 - Dec 2021</p>
                <p className="text-sm text-slate-300">Assisted in the development of client websites using HTML, CSS, and vanilla JavaScript. Participated in daily stand-ups and code reviews.</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Education</h3>
              <button className="text-[#10b981] hover:text-emerald-400 text-sm font-medium flex items-center gap-1">
                <Plus size={16} /> Add Education
              </button>
            </div>
            
            <div className="relative pl-6 border-l border-white/10">
              <div className="absolute w-3 h-3 bg-[#10b981] rounded-full -left-[6.5px] top-1"></div>
              <h4 className="text-lg font-bold text-white">B.S. Computer Science</h4>
              <p className="text-slate-400 font-medium">University of Technology</p>
              <p className="text-sm text-slate-500">2016 - 2020</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Resume;
