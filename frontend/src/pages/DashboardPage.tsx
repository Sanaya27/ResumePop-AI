import React, { useEffect, useState } from 'react';
import { Sparkles, FileText, CheckCircle2, Users, Cpu, ArrowRight, Upload, Clock, RefreshCw } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Dropzone } from '../components/Dropzone';
import { DashboardStats, UploadResponse } from '../types';
import { api } from '../services/api';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onSelectCandidate: (candidateId: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectCandidate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const fetchStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUploadSuccess = (res: UploadResponse) => {
    fetchStats();
  };

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-card border-[3px] border-pop-border bg-pop-surface p-8 md:p-12 shadow-pop-lg overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-pop-yellow border-2 border-pop-border opacity-60 pointer-events-none transform rotate-12" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-pop-mint border-2 border-pop-border opacity-50 pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pop-border bg-pop-yellow font-mono text-xs font-bold mb-4 shadow-pop-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-POWERED RECRUITMENT INTELLIGENCE</span>
          </div>

          <h1 className="font-grotesk font-black text-4xl sm:text-5xl md:text-6xl text-pop-dark tracking-tight leading-[1.05]">
            Your talent pipeline, <span className="text-pop-pink underline decoration-pop-yellow decoration-4">simplified.</span>
          </h1>

          <p className="mt-4 font-grotesk text-lg md:text-xl text-pop-dark/80 leading-relaxed max-w-2xl">
            Turn unstructured PDF resumes into clean, structured candidate records in seconds. Extract verified skills, contact info, experience, and universities with spaCy NLP.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('upload')}
              className="btn-primary px-6 py-3 text-base gap-2"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Resumes</span>
            </button>

            <button
              onClick={() => onNavigate('candidates')}
              className="btn-secondary px-6 py-3 text-base gap-2"
            >
              <span>Explore Candidates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-grotesk font-black text-2xl text-pop-dark">
            Talent Metrics
          </h2>
          <button
            onClick={fetchStats}
            className="text-xs font-mono font-bold flex items-center gap-1.5 text-pop-dark/70 hover:text-pop-dark"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Resumes"
            value={stats ? stats.total_resumes : '...'}
            icon={FileText}
            variant="yellow"
            subtext="Uploaded document files"
            badge="LIVE"
          />
          <StatCard
            label="Successful Extractions"
            value={stats ? stats.successful_extractions : '...'}
            icon={CheckCircle2}
            variant="mint"
            subtext="Parsed with 0 errors"
            badge="100%"
          />
          <StatCard
            label="Candidates Identified"
            value={stats ? stats.candidates_identified : '...'}
            icon={Users}
            variant="pink"
            subtext="Named candidate profiles"
          />
          <StatCard
            label="Skills Detected"
            value={stats ? stats.skills_detected : '...'}
            icon={Cpu}
            variant="soft"
            subtext="Unique technical skills"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 card-pop p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-pop-border/20 pb-3">
            <div>
              <h3 className="font-grotesk font-black text-xl text-pop-dark">
                Quick Resume Upload
              </h3>
              <p className="font-mono text-xs text-pop-dark/60 mt-0.5">
                Drop your PDF files here to instantly trigger the NLP extraction
              </p>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full border border-pop-border bg-pop-pink text-white">
              PDF
            </span>
          </div>

          <Dropzone compact onUploadSuccess={handleUploadSuccess} />
        </div>

        <div className="lg:col-span-6 card-pop p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-pop-border/20 pb-3">
            <div>
              <h3 className="font-grotesk font-black text-xl text-pop-dark">
                Recent Parsing Activity
              </h3>
              <p className="font-mono text-xs text-pop-dark/60 mt-0.5">
                Real-time extraction logs from SQLite database
              </p>
            </div>
            <button
              onClick={() => onNavigate('resumes')}
              className="text-xs font-mono font-bold text-pop-pink hover:underline"
            >
              View all
            </button>
          </div>

          {stats && stats.recent_activity && stats.recent_activity.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_activity.map((item) => (
                <div
                  key={item.resume_id}
                  onClick={() => item.candidate_id && onSelectCandidate(item.candidate_id)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-pop-blush border-2 border-pop-border hover:bg-pop-softYellow/30 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 truncate pr-2">
                    <div className="w-10 h-10 rounded-xl bg-pop-surface border border-pop-border flex items-center justify-center font-grotesk font-black text-pop-dark text-sm shrink-0">
                      {item.candidate_name ? item.candidate_name.charAt(0) : '?'}
                    </div>
                    <div className="truncate">
                      <div className="font-grotesk font-bold text-sm text-pop-dark truncate">
                        {item.candidate_name || 'Not detected'}
                      </div>
                      <div className="font-mono text-[11px] text-pop-dark/60 truncate">
                        {item.filename}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline-block font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-pop-border bg-pop-mint text-pop-dark">
                      {item.skills_count} skills
                    </span>
                    <span className="font-mono text-[11px] text-pop-dark/50 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.upload_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center font-mono text-xs text-pop-dark/50">
              No recent parsing activity yet. Upload a resume to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
