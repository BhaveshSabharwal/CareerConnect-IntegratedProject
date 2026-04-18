import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-8 mt-auto bg-[#020617]">
      <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Career Connect. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
