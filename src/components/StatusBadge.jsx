import React from 'react';

const colorMap = {
  ink: 'bg-ink-100 text-ink-600',
  royal: 'bg-royal-50 text-royal-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
  cyan: 'bg-cyan-50 text-cyan-700',
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-rose-50 text-rose-700',
};

export function StatusBadge({ children, color = 'ink', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colorMap[color] || colorMap.ink} ${className}`}>
      {children}
    </span>
  );
}

export default StatusBadge;
