import React, { useState } from 'react';
import { X, Mail, Phone, GraduationCap, Briefcase, Code, Database, Cpu, Globe, RefreshCw, FileText } from 'lucide-react';
import { Candidate } from '../types';
import { api } from '../services/api';

interface CandidateModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  onReprocessSuccess?: (updated: Candidate) => void;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({ candidate, onClose, onReprocessSuccess }) => {
  if (!candidate) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'rawText'>('profile');
  const [reprocessing, setReprocessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleReprocess = async () => {
    if (!candidate.resume_id) return;
    setReprocessing(true);
    setStatusMessage('Reprocessing resume with extraction pipeline...');
    try {
      const res = await api.reprocessResume(candidate.resume_id);
      setStatusMessage('Resume reprocessed successfully!');
      if (onReprocessSuccess && res.candidate) {
        onReprocessSuccess(res.candidate);
      }
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setReprocessing(false);
    }
  };

  const renderBadgeList = (items?: string[], colorClass = 'bg-pop-yellow text-pop-dark') => {
    if (!items || items.length === 0) {
      return <span className="text-xs font-mono text-pop-dark/40 italic">Not detected</span>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span
            key={idx}
            className={`font-mono text-xs font-bold px-3 py-1 rounded-full border-[1.5px] border-pop-border shadow-[1.5px_1.5px_0px_#0f0b15] ${colorClass}`}
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pop-dark/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-pop-surface border-[3px] border-pop-border rounded-card shadow-[8px_8px_0px_#0f0b15] overflow-hidden my-8 animate-in fade-in duration-150">
        <div className="p-6 bg-pop-blush border-b-[2.5px] border-pop-border flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-pop-pink text-pop-surface border-2 border-pop-border shadow-pop flex items-center justify-center font-grotesk font-black text-2xl">
              {candidate.candidate_name ? candidate.candidate_name.charAt(0) : '?'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-grotesk font-black text-2xl md:text-3xl text-pop-dark">
                  {candidate.candidate_name || 'Not detected'}
                </h2>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border border-pop-border bg-pop-mint text-pop-dark">
                  VERIFIED
                </span>
              </div>
              <p className="font-mono text-xs text-pop-dark/60 mt-1">
                Source: {candidate.filename || 'Uploaded Resume'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border-2 border-pop-border bg-pop-surface hover:bg-pop-pink hover:text-white shadow-pop-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className="p-3 bg-pop-yellow border-b-2 border-pop-border font-mono text-xs font-bold text-center">
            {statusMessage}
          </div>
        )}

        <div className="flex border-b-2 border-pop-border bg-pop-surface px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-grotesk font-bold text-sm border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-pop-pink text-pop-pink font-extrabold'
                : 'border-transparent text-pop-dark/60 hover:text-pop-dark'
            }`}
          >
            Candidate Profile
          </button>
          <button
            onClick={() => setActiveTab('rawText')}
            className={`px-4 py-2 font-grotesk font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'rawText'
                ? 'border-pop-pink text-pop-pink font-extrabold'
                : 'border-transparent text-pop-dark/60 hover:text-pop-dark'
            }`}
          >
            <FileText className="w-4 h-4" />
            Resume Raw Text
          </button>
        </div>

        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
          {activeTab === 'profile' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-pop-blush border-2 border-pop-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pop-surface border border-pop-border flex items-center justify-center text-pop-pink">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-pop-dark/50 uppercase block">Email Address</span>
                    <span className="font-mono text-sm font-bold text-pop-dark select-all">
                      {candidate.email || 'Not detected'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pop-surface border border-pop-border flex items-center justify-center text-pop-mint">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-pop-dark/50 uppercase block">Phone Number</span>
                    <span className="font-mono text-sm font-bold text-pop-dark select-all">
                      {candidate.phone || 'Not detected'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-pop-yellow" />
                  <h4 className="font-grotesk font-bold text-base text-pop-dark">Education & Universities</h4>
                </div>
                {renderBadgeList(candidate.universities, 'bg-pop-yellow text-pop-dark')}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-pop-pink" />
                  <h4 className="font-grotesk font-bold text-base text-pop-dark">Experience & Roles</h4>
                </div>
                {renderBadgeList(candidate.experience, 'bg-pop-softYellow text-pop-dark')}
              </div>

              <div className="space-y-4">
                <h4 className="font-grotesk font-bold text-lg text-pop-dark border-b border-pop-border/20 pb-1">
                  Technical Expertise
                </h4>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-pop-dark" />
                    <span className="font-mono text-xs uppercase font-bold text-pop-dark/70">Programming Languages</span>
                  </div>
                  {renderBadgeList(candidate.programming_skills, 'bg-pop-yellow text-pop-dark')}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-pop-dark" />
                    <span className="font-mono text-xs uppercase font-bold text-pop-dark/70">Databases & Data Storage</span>
                  </div>
                  {renderBadgeList(candidate.database_skills, 'bg-pop-mint text-pop-dark')}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-pop-pink" />
                    <span className="font-mono text-xs uppercase font-bold text-pop-dark/70">Machine Learning & AI</span>
                  </div>
                  {renderBadgeList(candidate.machine_learning, 'bg-pop-pink text-white')}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-pop-dark" />
                    <span className="font-mono text-xs uppercase font-bold text-pop-dark/70">Platforms & Cloud</span>
                  </div>
                  {renderBadgeList(candidate.platforms, 'bg-pop-surface text-pop-dark')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-pop-border/20">
                <div>
                  <span className="font-mono text-[10px] font-bold text-pop-dark/60 uppercase block mb-1.5">Languages</span>
                  {renderBadgeList(candidate.languages, 'bg-pop-surface text-pop-dark')}
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-pop-dark/60 uppercase block mb-1.5">Hobbies & Interests</span>
                  {renderBadgeList(candidate.hobbies, 'bg-pop-surface text-pop-dark')}
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-pop-dark/60 uppercase block mb-1.5">Open Source</span>
                  {renderBadgeList(candidate.open_source, 'bg-pop-mint text-pop-dark')}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-pop-dark text-pop-mint font-mono text-xs p-4 rounded-2xl border-2 border-pop-border overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[50vh]">
              {candidate.raw_text || 'No raw text available for this resume.'}
            </div>
          )}
        </div>

        <div className="p-4 bg-pop-blush border-t-[2.5px] border-pop-border flex items-center justify-between">
          <button
            onClick={handleReprocess}
            disabled={reprocessing}
            className="btn-secondary px-4 py-2 text-xs gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reprocessing ? 'animate-spin' : ''}`} />
            <span>{reprocessing ? 'Reprocessing...' : 'Reprocess Resume'}</span>
          </button>

          <button
            onClick={onClose}
            className="btn-primary px-6 py-2 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
