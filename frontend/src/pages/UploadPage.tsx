import React, { useState } from 'react';
import { Upload, CheckCircle2, ArrowRight, ShieldCheck, FileCheck, Layers } from 'lucide-react';
import { Dropzone } from '../components/Dropzone';
import { UploadResponse } from '../types';

interface UploadPageProps {
  onNavigate: (tab: string) => void;
  onSelectCandidate: (candidateId: number) => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onNavigate, onSelectCandidate }) => {
  const [latestUpload, setLatestUpload] = useState<UploadResponse | null>(null);

  const handleUploadSuccess = (response: UploadResponse) => {
    setLatestUpload(response);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pop-border bg-pop-pink text-white font-mono text-xs font-bold shadow-pop-sm">
          <Upload className="w-3.5 h-3.5" />
          <span>MULTI-DOCUMENT INGESTION</span>
        </div>
        <h1 className="font-grotesk font-black text-4xl md:text-5xl text-pop-dark">
          Upload & Parse Resumes
        </h1>
        <p className="font-grotesk text-base text-pop-dark/70">
          Upload individual or batch PDF resumes. Our enhanced spaCy extraction engine analyzes candidates and saves structured records into persistent SQLite storage.
        </p>
      </div>

      <div className="card-pop p-6 md:p-8">
        <Dropzone onUploadSuccess={handleUploadSuccess} />
      </div>

      {latestUpload && latestUpload.results && latestUpload.results.length > 0 && (
        <div className="card-pop p-6 space-y-4 border-pop-mint bg-emerald-50/50">
          <div className="flex items-center justify-between border-b border-pop-border/20 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h3 className="font-grotesk font-black text-xl text-pop-dark">
                Extraction Results ({latestUpload.results.length} Resumes)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('candidates')}
              className="btn-primary px-4 py-1.5 text-xs gap-1.5"
            >
              <span>View in Candidates Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestUpload.results.map((r, i) => (
              <div
                key={i}
                onClick={() => onSelectCandidate(r.candidate_id)}
                className="p-4 rounded-2xl bg-pop-surface border-2 border-pop-border hover:bg-pop-softYellow/30 cursor-pointer transition-colors shadow-pop-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="font-grotesk font-black text-lg text-pop-dark">
                    {r.candidate_name}
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full border border-pop-border bg-pop-mint">
                    {r.skills_count} skills
                  </span>
                </div>
                <div className="font-mono text-xs text-pop-dark/60 mt-1">
                  {r.email} • {r.phone}
                </div>
                <div className="font-mono text-[11px] text-pop-dark/40 mt-1 truncate">
                  File: {r.filename}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="card-pop p-5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-pop-yellow border-2 border-pop-border shadow-pop-sm flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5 text-pop-dark" />
          </div>
          <h4 className="font-grotesk font-bold text-lg text-pop-dark">PDFMiner Text Engine</h4>
          <p className="font-mono text-xs text-pop-dark/70 leading-relaxed">
            Raw PDF streams are decoded with precise encoding cleanup, stripping CID artifacts and weird glyphs.
          </p>
        </div>

        <div className="card-pop p-5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-pop-pink border-2 border-pop-border shadow-pop-sm flex items-center justify-center font-bold text-white">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-grotesk font-bold text-lg text-pop-dark">spaCy 2.1.3 + Regex</h4>
          <p className="font-mono text-xs text-pop-dark/70 leading-relaxed">
            Word-boundary regexes isolate C++, .NET, and single-letter languages without false partial matches.
          </p>
        </div>

        <div className="card-pop p-5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-pop-mint border-2 border-pop-border shadow-pop-sm flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-pop-dark" />
          </div>
          <h4 className="font-grotesk font-bold text-lg text-pop-dark">SQLite Persistence</h4>
          <p className="font-mono text-xs text-pop-dark/70 leading-relaxed">
            All extracted candidate profiles, skills, and files are permanently stored in SQLite database.
          </p>
        </div>
      </div>
    </div>
  );
};
