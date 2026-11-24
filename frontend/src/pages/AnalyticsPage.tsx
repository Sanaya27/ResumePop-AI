import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Cpu, Database, Code, GraduationCap, Briefcase, RefreshCw } from 'lucide-react';
import { AnalyticsData, DistributionItem } from '../types';
import { api } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const renderHorizontalBarChart = (
    title: string,
    items: DistributionItem[],
    colorClass: string,
    icon: React.ReactNode
  ) => {
    if (!items || items.length === 0) {
      return (
        <div className="card-pop p-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-pop-border/20 pb-3">
            {icon}
            <h3 className="font-grotesk font-black text-xl text-pop-dark">{title}</h3>
          </div>
          <p className="font-mono text-xs text-pop-dark/40 py-6 text-center italic">
            No data detected yet for this category
          </p>
        </div>
      );
    }

    const maxCount = Math.max(...items.map(i => i.count), 1);

    return (
      <div className="card-pop p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-pop-border/20 pb-3">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-grotesk font-black text-xl text-pop-dark">{title}</h3>
          </div>
          <span className="font-mono text-xs font-bold text-pop-dark/60">
            {items.length} items
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const percentage = Math.round((item.count / maxCount) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between font-mono text-xs font-bold">
                  <span className="text-pop-dark truncate max-w-[200px]">{item.name}</span>
                  <span className="text-pop-dark/70">{item.count} candidate{item.count > 1 ? 's' : ''}</span>
                </div>
                <div className="w-full h-4 bg-pop-blush rounded-full border border-pop-border overflow-hidden">
                  <div
                    className={`h-full rounded-full border-r border-pop-border transition-all duration-500 ${colorClass}`}
                    style={{ width: `${Math.max(percentage, 8)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-pop-border/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pop-border bg-pop-pink text-white font-mono text-xs font-bold mb-2 shadow-pop-sm">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>REAL EXTRACTED TALENT METRICS</span>
          </div>
          <h1 className="font-grotesk font-black text-3xl md:text-4xl text-pop-dark">
            Talent & Skills Analytics
          </h1>
          <p className="font-mono text-xs text-pop-dark/60 mt-1">
            Aggregated statistics derived from actual parsed resumes in your database
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="btn-secondary px-4 py-2 text-sm gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-sm text-pop-dark/60 animate-pulse">
          Computing analytics distributions...
        </div>
      ) : data ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card-pop p-6 bg-pop-yellow text-pop-dark">
              <span className="font-mono text-xs font-bold uppercase tracking-wider block mb-1">
                Total Analyzed Candidates
              </span>
              <div className="font-grotesk font-black text-4xl">
                {data.total_candidates}
              </div>
              <p className="font-mono text-xs text-pop-dark/70 mt-1">Profiles in SQLite database</p>
            </div>

            <div className="card-pop p-6 bg-pop-mint text-pop-dark">
              <span className="font-mono text-xs font-bold uppercase tracking-wider block mb-1">
                Top Programming Language
              </span>
              <div className="font-grotesk font-black text-3xl truncate">
                {data.top_programming_languages[0]?.name || 'N/A'}
              </div>
              <p className="font-mono text-xs text-pop-dark/70 mt-1">
                Found in {data.top_programming_languages[0]?.count || 0} candidate profiles
              </p>
            </div>

            <div className="card-pop p-6 bg-pop-pink text-white">
              <span className="font-mono text-xs font-bold uppercase tracking-wider block mb-1 text-white/90">
                Top Database Skill
              </span>
              <div className="font-grotesk font-black text-3xl truncate">
                {data.top_databases[0]?.name || 'N/A'}
              </div>
              <p className="font-mono text-xs text-white/80 mt-1">
                Found in {data.top_databases[0]?.count || 0} candidate profiles
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderHorizontalBarChart(
              'Programming Languages',
              data.top_programming_languages,
              'bg-pop-yellow',
              <Code className="w-5 h-5 text-pop-dark" />
            )}

            {renderHorizontalBarChart(
              'Database Technologies',
              data.top_databases,
              'bg-pop-mint',
              <Database className="w-5 h-5 text-pop-dark" />
            )}

            {renderHorizontalBarChart(
              'Machine Learning & AI',
              data.top_machine_learning,
              'bg-pop-pink',
              <Cpu className="w-5 h-5 text-pop-pink" />
            )}

            {renderHorizontalBarChart(
              'University Distribution',
              data.university_distribution,
              'bg-pop-softYellow',
              <GraduationCap className="w-5 h-5 text-pop-dark" />
            )}

            {renderHorizontalBarChart(
              'Experience & Job Roles',
              data.experience_distribution,
              'bg-pop-mint',
              <Briefcase className="w-5 h-5 text-pop-dark" />
            )}

            {renderHorizontalBarChart(
              'Platforms & OS',
              data.platforms_distribution,
              'bg-pop-surface',
              <TrendingUp className="w-5 h-5 text-pop-dark" />
            )}
          </div>
        </div>
      ) : (
        <div className="card-pop p-12 text-center font-mono text-xs text-pop-dark/50">
          No analytics data available. Upload resumes to generate statistics.
        </div>
      )}
    </div>
  );
};
