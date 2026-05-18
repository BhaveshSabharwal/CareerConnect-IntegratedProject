import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, LayoutDashboard, Compass, FileText, MessageSquare, User, Menu, Users, Bell } from 'lucide-react';
import FlatButton from '../ui/FlatButton';
import { useAuth } from '../../context/AuthContext';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications for now
  const notifications = [
    { id: 1, title: 'Application Shortlisted', message: 'You have been shortlisted for the SWE role at Google!', is_read: false },
    { id: 2, title: 'Interview Scheduled', message: 'Your interview for Backend Engineer is on Monday.', is_read: true },
  ];

  const getNavItems = () => {
    if (!user) return [];
    if (user.role === 'ADMIN') {
      return [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }];
    }
    if (user.role === 'INTERVIEWER') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Candidates', path: '/explorer', icon: Users } // reusing explorer as candidates
      ];
    }
    // Default student view
    return [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Explore', path: '/explorer', icon: Compass },
      { name: 'Jobs', path: '/jobs', icon: Briefcase },
      { name: 'Resume', path: '/resume', icon: FileText },
    ];
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center">
            <Briefcase size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Career<span className="text-[#0ea5e9]">Connect</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#0ea5e9] ${
                  isActive ? 'text-[#0ea5e9]' : 'text-slate-400'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <button className="text-xs text-[#0ea5e9] hover:underline">Mark all as read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-3 rounded-lg mb-1 ${notif.is_read ? 'opacity-70' : 'bg-white/5'}`}>
                          <h4 className="text-sm font-medium text-white">{notif.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-slate-400">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                <User size={16} className="text-slate-400" />
              </div>
              <FlatButton variant="outline" onClick={() => { logout(); navigate('/'); }} className="text-sm py-1.5 px-5 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 rounded-lg">Logout</FlatButton>
            </div>
          ) : (
            <>
              <button onClick={() => navigate('/auth')} className="text-sm font-medium text-white/80 hover:text-white px-4 py-2 transition-colors">Log in</button>
              <FlatButton variant="primary" onClick={() => navigate('/auth')} className="text-sm py-1.5 px-5 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg shadow-lg shadow-blue-500/20">Sign Up</FlatButton>
            </>
          )}
        </div>

        <button className="md:hidden text-slate-300 hover:text-white">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
