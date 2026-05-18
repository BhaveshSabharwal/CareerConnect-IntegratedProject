import React, { useState, useEffect } from 'react';
import { FileText, Download, Edit3, Plus, Layers, UploadCloud } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import FlatButton from '../components/ui/FlatButton';
import { useAuth } from '../context/AuthContext';

const Resume = () => {
  const { user, token } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  const [skills, setSkills] = useState(['React', 'JavaScript', 'HTML/CSS', 'Tailwind', 'Git', 'Figma']);
  const [newSkill, setNewSkill] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role === 'STUDENT' ? 'Student / Graduate' : user?.role || '',
    location: 'Remote'
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        role: user.role === 'STUDENT' ? 'Student / Graduate' : user.role || '',
        location: 'Remote'
      });
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      fetchResumes();
    }
  }, [token]);

  const fetchResumes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/resumes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setResumes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const submitResumeUpload = async () => {
    if (!newResumeTitle) return;
    try {
      const res = await fetch('http://localhost:5000/api/resumes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: newResumeTitle,
          file_url: 'https://example.com/resume.pdf',
          parsed_content: 'Extracted text...',
          ai_score: Math.floor(Math.random() * 20) + 80 // Random score 80-100
        })
      });
      if (res.ok) {
        fetchResumes();
        setNewResumeTitle('');
        setResumeFile(null);
        setShowUploadForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAlert = (action) => alert(`${action} feature coming soon!`);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><FileText className="text-[#10b981]" /> Resume Builder</h1>
          <p className="text-slate-400">Manage your professional profile and generate stunning resumes.</p>
        </div>
        <div className="flex gap-3">
          <FlatButton onClick={() => setIsEditingProfile(true)} variant="outline" className="border-white/10 hover:bg-white/5 text-white flex items-center gap-2">
            <Edit3 size={16} /> Edit Profile
          </FlatButton>
          <FlatButton onClick={() => handleAlert('Export PDF')} variant="primary" className="bg-[#10b981] hover:bg-[#059669] text-white flex items-center gap-2">
            <Download size={16} /> Export PDF
          </FlatButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <GlassCard className="text-center relative">
            {isEditingProfile ? (
              <div className="space-y-4 text-left">
                <h3 className="text-lg font-bold text-white mb-2">Edit Profile</h3>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Name</label>
                  <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#0ea5e9]" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Headline / Role</label>
                  <input type="text" value={profileData.role} onChange={e => setProfileData({...profileData, role: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#0ea5e9]" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Email</label>
                  <input type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#0ea5e9]" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Location</label>
                  <input type="text" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#0ea5e9]" />
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button onClick={() => setIsEditingProfile(false)} className="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors">Cancel</button>
                  <button onClick={() => setIsEditingProfile(false)} className="text-xs bg-[#10b981] hover:bg-[#059669] text-white px-3 py-1 rounded transition-colors">Save</button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center mb-4 border-4 border-black/50">
                  <span className="text-3xl font-bold text-white">{profileData.name?.charAt(0) || 'U'}</span>
                </div>
                <h2 className="text-xl font-bold text-white">{profileData.name || 'User'}</h2>
                <p className="text-[#0ea5e9] mb-4">{profileData.role}</p>
                <div className="text-sm text-slate-400 space-y-2">
                  <p>{profileData.email}</p>
                  <p>{profileData.location}</p>
                </div>
              </>
            )}
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Layers size={18} className="text-[#8b5cf6]" /> Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-1 group">
                  {skill}
                  <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity">
                    &times;
                  </button>
                </span>
              ))}
              {showSkillInput ? (
                <div className="flex items-center">
                  <input 
                    autoFocus
                    type="text" 
                    value={newSkill} 
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newSkill.trim()) {
                        if (!skills.includes(newSkill.trim())) setSkills([...skills, newSkill.trim()]);
                        setNewSkill('');
                        setShowSkillInput(false);
                      } else if (e.key === 'Escape') {
                        setShowSkillInput(false);
                      }
                    }}
                    onBlur={() => {
                      if (newSkill.trim() && !skills.includes(newSkill.trim())) {
                        setSkills([...skills, newSkill.trim()]);
                      }
                      setNewSkill('');
                      setShowSkillInput(false);
                    }}
                    className="px-2 py-1 bg-black/20 border border-white/10 rounded-md text-xs text-white outline-none focus:border-[#8b5cf6] w-24"
                    placeholder="Skill..."
                  />
                </div>
              ) : (
                <button onClick={() => setShowSkillInput(true)} className="px-3 py-1 rounded-md bg-white/5 border border-dashed border-white/20 text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                  <Plus size={12} /> Add
                </button>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Experience</h3>
              <button className="text-[#0ea5e9] hover:text-blue-400 text-sm font-medium flex items-center gap-1">
                <Plus size={16} /> Add Experience
              </button>
            </div>
            
            <div className="space-y-4">
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
              <h3 className="text-xl font-semibold text-white">My Resumes</h3>
              <button onClick={() => setShowUploadForm(!showUploadForm)} className="text-[#8b5cf6] hover:text-purple-400 text-sm font-medium flex items-center gap-1">
                <UploadCloud size={16} /> Upload New
              </button>
            </div>
            
            {showUploadForm && (
              <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Resume Title (e.g. Frontend Dev)" 
                  value={newResumeTitle}
                  onChange={(e) => setNewResumeTitle(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#8b5cf6]"
                  autoFocus
                />
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8b5cf6]/20 file:text-[#8b5cf6] hover:file:bg-[#8b5cf6]/30 cursor-pointer"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setShowUploadForm(false)} className="text-slate-400 hover:text-white px-3 py-2 transition-colors">Cancel</button>
                  <FlatButton onClick={submitResumeUpload} variant="primary" className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-2">
                    Save Resume
                  </FlatButton>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumes.length > 0 ? resumes.map(r => (
                <div key={r.id} className="p-4 border border-white/10 bg-black/20 rounded-lg flex flex-col gap-2 relative group hover:border-[#8b5cf6]/50 transition-colors">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <FileText size={16} className="text-[#8b5cf6]" /> {r.title}
                  </h4>
                  <div className="text-sm text-slate-400 flex justify-between">
                    <span>AI Score:</span>
                    <span className="text-[#10b981] font-bold">{r.ai_score || 'Pending'}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">Uploaded {new Date(r.created_at).toLocaleDateString()}</div>
                </div>
              )) : (
                <div className="col-span-2 text-center py-6 text-slate-400 border border-dashed border-white/20 rounded-lg">
                  No resumes uploaded yet. Click 'Upload New' to add one.
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Resume;
