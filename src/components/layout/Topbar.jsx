import React from 'react';
import { NavLink } from 'react-router-dom';
import { Briefcase, LayoutDashboard, Compass, FileText, MessageSquare, User, Menu } from 'lucide-react';
import FlatButton from '../ui/FlatButton';

const Topbar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore', path: '/explorer', icon: Compass },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Resume', path: '/resume', icon: FileText },
    { name: 'Prep', path: '/prep', icon: MessageSquare },
  ];

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
              <item.icon size={16} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <FlatButton variant="outline" className="text-sm py-1.5 px-3">Log in</FlatButton>
          <FlatButton variant="primary" className="text-sm py-1.5 px-3">Sign up</FlatButton>
        </div>

        <button className="md:hidden text-slate-300 hover:text-white">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
