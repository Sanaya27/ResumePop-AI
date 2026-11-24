import React, { useEffect, useState } from 'react';
import { FolderKanban, Search, Trash2, RefreshCw, FileText, CheckCircle2, AlertCircle, Eye, ExternalLink } from 'lucide-react';
import { Resume } from '../types';
import { api } from '../services/api';

interface ResumesPageProps {
  onSelectCandidate: (candidateId: number) => void;
  onNavigate: (tab: string) => void;
}

export const ResumesPage: React.FC<ResumesPageProps> = ({ onSelectCandidate, onNavigate }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [reprocessingId, setReprocessingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const data = await api.getResumes(search || undefined, statusFilter || undefined);
      setResumes(data);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [search, statusFilter]);

  const handleReprocess = async (resumeId: number) => {
    setReprocessingId(resumeId);
    setNotice(null);
    try {
      await api.reprocessResume(resumeId);
      setNotice('Resume reprocessed successfully!');
      fetchResumes();
    } catch (err: any) {
      setNotice(`Reprocess failed: ${err.message}`);
    } finally {
      setReprocessingId(null);
    }
  };

  const handleDelete = async (resumeId: number) => {
    try {
      await api.deleteResume(resumeId);
      setDeleteConfirmId(null);
      setNotice('Resume and candidate record deleted.');
      fetchResumes();
    } catch (err: any) {
      setNotice(`Delete failed: ${err.message}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-pop-border/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pop-border bg-pop-mint font-mono text-xs font-bold mb-2 shadow-pop-sm">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>RESUME ARCHIVE & PERSISTENCE</span>
          </div>
          <h1 className="font-grotesk font-black text-3xl md:text-4xl text-pop-dark">
            Resume Management
          </h1>
          <p className="font-mono text-xs text-pop-dark/60 mt-1">
            Review uploaded files, manage database records, re-run extraction, or delete resumes
          </p>
        </div>

        <button
          onClick={() => onNavigate('upload')}
          className="btn-primary px-5 py-2.5 text-sm"
        >
          Upload New Resume
        </button>
      </div>

      {notice && (
        <div className="p-3 rounded-2xl bg-pop-yellow border-2 border-pop-border font-mono text-xs font-bold text-center">
          {notice}
        </div>
      )}

      <div className="card-pop p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pop-dark/50" />
          <input
            type="text"
            placeholder="Search resumes by filename or candidate name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-pop w-full pl-10 pr-4 py-2 text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-pop px-4 py-2 text-sm w-full sm:w-auto cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="processed">Processed</option>
          <option value="error">Error</option>
        </select>

        <button
          onClick={fetchResumes}
          className="btn-secondary px-4 py-2 text-sm gap-1.5 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="card-pop overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pop-blush border-b-2 border-pop-border font-mono text-xs font-bold uppercase text-pop-dark/70">
                <th className="p-4">Resume File</th>
                <th className="p-4">Candidate Identified</th>
                <th className="p-4">Size</th>
                <th className="p-4">Uploaded Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y border-pop-border/10 font-mono text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-pop-dark/50 animate-pulse">
                    Loading records from SQLite database...
                  </td>
                </tr>
              ) : resumes.length > 0 ? (
                resumes.map((resume) => (
                  <tr key={resume.id} className="hover:bg-pop-blush/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-bold text-pop-dark truncate max-w-[220px]">
                        <FileText className="w-4 h-4 text-pop-pink shrink-0" />
                        <span className="truncate" title={resume.filename}>{resume.filename}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      {resume.candidate_id ? (
                        <button
                          onClick={() => onSelectCandidate(resume.candidate_id!)}
                          className="font-grotesk font-bold text-sm text-pop-dark hover:text-pop-pink hover:underline flex items-center gap-1.5"
                        >
                          <span>{resume.candidate_name || 'Not detected'}</span>
                          <ExternalLink className="w-3 h-3 text-pop-dark/40" />
                        </button>
                      ) : (
                        <span className="text-pop-dark/40 italic">No candidate linked</span>
                      )}
                    </td>

                    <td className="p-4 text-pop-dark/60">
                      {formatFileSize(resume.file_size)}
                    </td>

                    <td className="p-4 text-pop-dark/70">
                      {new Date(resume.upload_date).toLocaleDateString()}{' '}
                      <span className="text-[10px] text-pop-dark/40">
                        {new Date(resume.upload_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="p-4">
                      {resume.status === 'processed' ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-pop-border bg-pop-mint text-pop-dark">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          PROCESSED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-pop-border bg-pink-100 text-pop-error">
                          <AlertCircle className="w-3 h-3" />
                          ERROR
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {resume.candidate_id && (
                          <button
                            onClick={() => onSelectCandidate(resume.candidate_id!)}
                            className="p-1.5 rounded-full border border-pop-border bg-pop-surface hover:bg-pop-yellow text-pop-dark shadow-pop-sm"
                            title="View Candidate"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleReprocess(resume.id)}
                          disabled={reprocessingId === resume.id}
                          className="p-1.5 rounded-full border border-pop-border bg-pop-surface hover:bg-pop-softYellow text-pop-dark shadow-pop-sm disabled:opacity-50"
                          title="Reprocess Resume"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${reprocessingId === resume.id ? 'animate-spin' : ''}`} />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(resume.id)}
                          className="p-1.5 rounded-full border border-pop-border bg-pop-surface hover:bg-pop-error hover:text-white text-pop-error shadow-pop-sm"
                          title="Delete Resume"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-pop-dark/50">
                    No resumes found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pop-dark/60 backdrop-blur-sm">
          <div className="card-pop p-6 max-w-sm w-full space-y-4 bg-pop-surface border-3 border-pop-border">
            <h3 className="font-grotesk font-black text-xl text-pop-dark">Confirm Delete</h3>
            <p className="font-mono text-xs text-pop-dark/70">
              Are you sure you want to permanently delete this resume and its extracted candidate profile?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-secondary px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="btn-danger px-4 py-2 text-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
