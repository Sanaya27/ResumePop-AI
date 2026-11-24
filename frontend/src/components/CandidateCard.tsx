import React from 'react';
import { Mail, Phone, GraduationCap, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  onViewDetails: (candidate: Candidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onViewDetails }) => {
  const initials = candidate.candidate_name && candidate.candidate_name !== 'Not detected'
    ? candidate.candidate_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const avatarColors = ['bg-pop-yellow', 'bg-pop-pink text-white', 'bg-pop-mint', 'bg-pop-softYellow'];
  const avatarBg = avatarColors[(candidate.id || 0) % avatarColors.length];

  return (
    <div className="card-pop p-6 flex flex-col justify-between card-pop-hover">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full border-2 border-pop-border shadow-pop-sm flex items-center justify-center font-grotesk font-black text-lg ${avatarBg}`}>
              {initials}
            </div>
            <div>
              <h3 className="font-grotesk font-bold text-xl text-pop-dark leading-tight">
                {candidate.candidate_name || 'Not detected'}
              </h3>
              <p className="font-mono text-xs text-pop-dark/60 mt-0.5 truncate max-w-[200px]" title={candidate.filename}>
                {candidate.filename || 'Resume document'}
              </p>
            </div>
          </div>
          <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-full border border-pop-border bg-pop-mint text-pop-dark flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            PARSED
          </span>
        </div>

        <div className="space-y-1.5 mb-4 text-xs font-mono text-pop-dark/80">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-pop-pink shrink-0" />
            {candidate.email && candidate.email !== 'Not detected' ? (
              <a href={`mailto:${candidate.email}`} className="hover:underline truncate">
                {candidate.email}
              </a>
            ) : (
              <span className="text-pop-dark/40 italic">Email not detected</span>
            )}
          </div>
          <div className="flex items-center gap-2 truncate">
            <Phone className="w-3.5 h-3.5 text-pop-mint shrink-0" />
            {candidate.phone && candidate.phone !== 'Not detected' ? (
              <a href={`tel:${candidate.phone}`} className="hover:underline">
                {candidate.phone}
              </a>
            ) : (
              <span className="text-pop-dark/40 italic">Phone not detected</span>
            )}
          </div>
          {candidate.universities && candidate.universities.length > 0 && (
            <div className="flex items-center gap-2 truncate">
              <GraduationCap className="w-3.5 h-3.5 text-pop-yellow shrink-0" />
              <span className="truncate">{candidate.universities.join(', ')}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-5">
          {candidate.programming_skills && candidate.programming_skills.length > 0 && (
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-pop-dark/60 block mb-1">
                Programming
              </span>
              <div className="flex flex-wrap gap-1.5">
                {candidate.programming_skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border border-pop-border bg-pop-yellow text-pop-dark"
                  >
                    {skill}
                  </span>
                ))}
                {candidate.programming_skills.length > 4 && (
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border border-pop-border bg-pop-surface text-pop-dark/70">
                    +{candidate.programming_skills.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {candidate.database_skills && candidate.database_skills.length > 0 && (
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-pop-dark/60 block mb-1">
                Databases
              </span>
              <div className="flex flex-wrap gap-1.5">
                {candidate.database_skills.slice(0, 3).map((db) => (
                  <span
                    key={db}
                    className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border border-pop-border bg-pop-mint text-pop-dark"
                  >
                    {db}
                  </span>
                ))}
              </div>
            </div>
          )}

          {candidate.machine_learning && candidate.machine_learning.length > 0 && (
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-pop-dark/60 block mb-1">
                Machine Learning
              </span>
              <div className="flex flex-wrap gap-1.5">
                {candidate.machine_learning.slice(0, 2).map((ml) => (
                  <span
                    key={ml}
                    className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border border-pop-border bg-pop-pink text-white"
                  >
                    {ml}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-pop-border/20 flex items-center justify-between">
        <span className="font-mono text-xs text-pop-dark/50">
          ID #{candidate.id}
        </span>
        <button
          onClick={() => onViewDetails(candidate)}
          className="btn-secondary px-3.5 py-1.5 text-xs gap-1.5"
        >
          <span>View Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
