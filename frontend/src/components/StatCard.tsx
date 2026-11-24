import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  variant: 'yellow' | 'pink' | 'mint' | 'soft';
  subtext?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  variant,
  subtext,
  badge,
}) => {
  const colorMap = {
    yellow: { bg: 'bg-pop-yellow', iconBg: 'bg-pop-surface text-pop-dark' },
    pink: { bg: 'bg-pop-pink', iconBg: 'bg-pop-surface text-pop-pink' },
    mint: { bg: 'bg-pop-mint', iconBg: 'bg-pop-surface text-pop-dark' },
    soft: { bg: 'bg-pop-softYellow', iconBg: 'bg-pop-surface text-pop-dark' },
  };

  const currentTheme = colorMap[variant];

  return (
    <div className={`relative rounded-card p-6 border-[2.5px] border-pop-border shadow-pop-md transition-all hover:-translate-y-1 hover:shadow-pop-lg ${currentTheme.bg} overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-pop-dark/80">
              {label}
            </span>
            {badge && (
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-pop-border bg-pop-surface">
                {badge}
              </span>
            )}
          </div>
          <div className="font-grotesk font-black text-4xl md:text-5xl text-pop-dark tracking-tight">
            {value}
          </div>
          {subtext && (
            <p className="mt-2 text-xs font-mono text-pop-dark/75">
              {subtext}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl border-2 border-pop-border shadow-pop-sm flex items-center justify-center ${currentTheme.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
