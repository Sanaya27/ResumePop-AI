import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, Users, X } from 'lucide-react';
import { CandidateCard } from '../components/CandidateCard';
import { CandidateModal } from '../components/CandidateModal';
import { Candidate } from '../types';
import { api } from '../services/api';

interface CandidatesPageProps {
  onNavigate: (tab: string) => void;
  selectedCandidateId?: number | null;
  onClearSelectedCandidate?: () => void;
}

export const CandidatesPage: React.FC<CandidatesPageProps> = ({
  onNavigate,
  selectedCandidateId,
  onClearSelectedCandidate,
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [modalCandidate, setModalCandidate] = useState<Candidate | null>(null);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const data = await api.getCandidates({
        search: search || undefined,
        skill: selectedSkill || undefined,
        university: selectedUniversity || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setCandidates(data);

      if (selectedCandidateId) {
        const found = data.find(c => c.id === selectedCandidateId);
        if (found) {
          setModalCandidate(found);
        } else {
          api.getCandidate(selectedCandidateId).then(setModalCandidate).catch(console.error);
        }
      }
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [search, selectedSkill, selectedUniversity, sortBy, sortOrder]);

  const handleReprocessSuccess = (updated: Candidate) => {
    setModalCandidate(updated);
    fetchCandidates();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedSkill('');
    setSelectedUniversity('');
  };

  const hasActiveFilters = Boolean(search || selectedSkill || selectedUniversity);
  const quickSkills = ['Python', 'SQL', 'R', 'C++', 'Deep Learning', 'MySQL', 'JavaScript'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-pop-border/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pop-border bg-pop-yellow font-mono text-xs font-bold mb-2 shadow-pop-sm">
            <Users className="w-3.5 h-3.5" />
            <span>CANDIDATE TALENT DIRECTORY</span>
          </div>
          <h1 className="font-grotesk font-black text-3xl md:text-4xl text-pop-dark">
            Extracted Candidates
          </h1>
          <p className="font-mono text-xs text-pop-dark/60 mt-1">
            Browse, search, and filter talent profiles extracted directly from resumes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={api.getExportCsvUrl({ search, skill: selectedSkill, university: selectedUniversity })}
            download
            className="btn-primary px-5 py-2.5 text-sm gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Filtered CSV</span>
          </a>
        </div>
      </div>

      <div className="card-pop p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pop-dark/50" />
            <input
              type="text"
              placeholder="Search by name, email, skills, university..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-pop w-full pl-10 pr-4 py-2.5 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-pop-dark/50 hover:text-pop-dark"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="md:col-span-3">
            <input
              type="text"
              placeholder="Filter by skill (e.g. Python, SQL)"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="input-pop w-full px-4 py-2.5 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="University..."
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="input-pop w-full px-4 py-2.5 text-sm"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-pop w-full px-3 py-2.5 text-sm cursor-pointer"
            >
              <option value="name">Sort: Name</option>
              <option value="date">Sort: Date</option>
              <option value="skills">Sort: Skills Count</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-pop-border/10">
          <span className="font-mono text-xs font-bold text-pop-dark/60 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Quick filters:
          </span>
          {quickSkills.map((skill) => {
            const active = selectedSkill.toLowerCase() === skill.toLowerCase();
            return (
              <button
                key={skill}
                onClick={() => setSelectedSkill(active ? '' : skill)}
                className={`font-mono text-xs font-bold px-3 py-1 rounded-full border transition-all ${
                  active
                    ? 'border-pop-border bg-pop-pink text-white shadow-pop-sm'
                    : 'border-pop-border bg-pop-surface hover:bg-pop-yellow text-pop-dark'
                }`}
              >
                {skill}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-mono text-pop-error hover:underline ml-auto"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between font-mono text-xs text-pop-dark/70">
        <span>Showing {candidates.length} candidate profile{candidates.length === 1 ? '' : 's'}</span>
        {hasActiveFilters && (
          <span className="text-pop-pink font-bold">Filtered results active</span>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-sm text-pop-dark/60 animate-pulse">
          Loading candidate records from database...
        </div>
      ) : candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onViewDetails={(c) => setModalCandidate(c)}
            />
          ))}
        </div>
      ) : (
        <div className="card-pop p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-pop-blush border-2 border-pop-border shadow-pop-sm flex items-center justify-center mx-auto text-pop-dark/40 font-bold text-2xl">
            ?
          </div>
          <div>
            <h3 className="font-grotesk font-black text-xl text-pop-dark">No Candidates Found</h3>
            <p className="font-mono text-xs text-pop-dark/60 mt-1">
              No resumes match your current filter query.
            </p>
          </div>
          <button onClick={clearFilters} className="btn-secondary px-4 py-2 text-xs">
            Clear all filters
          </button>
        </div>
      )}

      <CandidateModal
        candidate={modalCandidate}
        onClose={() => {
          setModalCandidate(null);
          if (onClearSelectedCandidate) onClearSelectedCandidate();
        }}
        onReprocessSuccess={handleReprocessSuccess}
      />
    </div>
  );
};
