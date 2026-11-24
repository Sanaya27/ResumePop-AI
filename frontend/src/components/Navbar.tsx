import React, { useState } from 'react';
import { Sparkles, Users, FolderKanban, BarChart3, Upload, Download, Menu, X } from 'lucide-react';
import { api } from '../services/api';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'resumes', label: 'Manage Resumes', icon: FolderKanban },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-pop-surface border-b-[2.5px] border-pop-border shadow-[0_4px_0px_#0f0b15]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-pop-pink border-[2.5px] border-pop-border shadow-pop flex items-center justify-center transform group-hover:-rotate-6 transition-transform">
              <span className="font-grotesk font-black text-2xl text-pop-yellow">P</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-grotesk font-black text-2xl tracking-tight text-pop-dark">
                  ResumePop<span className="text-pop-pink">.ai</span>
                </span>
                <span className="hidden sm:inline-block bg-pop-yellow text-pop-dark font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-pop-border shadow-[1px_1px_0px_#0f0b15]">
                  AI PARSER
                </span>
              </div>
              <p className="hidden md:block text-xs font-mono text-pop-dark/70 tracking-tight">
                Turn resumes into structured talent data
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-full font-grotesk font-bold text-sm flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-pop-yellow text-pop-dark border-[2px] border-pop-border shadow-pop'
                      : 'text-pop-dark hover:bg-pop-blush border-[2px] border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <a
              href={api.getExportCsvUrl()}
              download
              className="btn-secondary px-4 py-2 text-sm gap-2"
              title="Download all candidate records as CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </a>
            <button
              onClick={() => handleNavClick('upload')}
              className="btn-primary px-5 py-2 text-sm gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload PDF</span>
            </button>
          </div>

          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border-2 border-pop-border bg-pop-yellow text-pop-dark shadow-pop"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t-[2.5px] border-pop-border bg-pop-surface p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-4 py-3 rounded-2xl font-grotesk font-bold text-base flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-pop-yellow text-pop-dark border-2 border-pop-border shadow-pop'
                    : 'text-pop-dark hover:bg-pop-blush'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
