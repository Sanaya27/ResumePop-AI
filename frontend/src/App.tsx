import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Marquee } from './components/Marquee';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { ResumesPage } from './pages/ResumesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'candidates' | 'resumes' | 'analytics'>('dashboard');
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);

  const handleSelectCandidate = (candidateId: number) => {
    setSelectedCandidateId(candidateId);
    setActiveTab('candidates');
  };

  return (
    <div className="min-h-screen flex flex-col bg-pop-blush text-pop-dark font-grotesk">
      <Marquee />

      <Navbar
        activeTab={activeTab}
        setActiveTab={(t) => {
          setSelectedCandidateId(null);
          setActiveTab(t as any);
        }}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigate={(t) => setActiveTab(t as any)}
            onSelectCandidate={handleSelectCandidate}
          />
        )}
        {activeTab === 'upload' && (
          <UploadPage
            onNavigate={(t) => setActiveTab(t as any)}
            onSelectCandidate={handleSelectCandidate}
          />
        )}
        {activeTab === 'candidates' && (
          <CandidatesPage
            onNavigate={(t) => setActiveTab(t as any)}
            selectedCandidateId={selectedCandidateId}
            onClearSelectedCandidate={() => setSelectedCandidateId(null)}
          />
        )}
        {activeTab === 'resumes' && (
          <ResumesPage
            onSelectCandidate={handleSelectCandidate}
            onNavigate={(t) => setActiveTab(t as any)}
          />
        )}
        {activeTab === 'analytics' && <AnalyticsPage />}
      </main>

      <footer className="border-t-[2.5px] border-pop-border bg-pop-surface py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pop-pink border-2 border-pop-border shadow-pop-sm flex items-center justify-center font-black text-pop-yellow text-xl">
              P
            </div>
            <div>
              <span className="font-grotesk font-black text-xl text-pop-dark">
                ResumePop AI
              </span>
              <p className="font-mono text-xs text-pop-dark/60">
                Turn resumes into structured talent data
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono font-bold text-pop-dark/80">
            <span className="px-3 py-1 rounded-full border border-pop-border bg-pop-yellow">
              spaCy 2.1.3 NLP
            </span>
            <span className="px-3 py-1 rounded-full border border-pop-border bg-pop-mint">
              SQLite Storage
            </span>
            <span className="px-3 py-1 rounded-full border border-pop-border bg-pop-softYellow">
              One Stop Notes Design
            </span>
          </div>

          <p className="font-mono text-xs text-pop-dark/50 text-center md:text-right">
            Designed for live demonstration & production talent intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
