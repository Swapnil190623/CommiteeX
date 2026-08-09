import React from 'react';

export function StatCard({ icon: Icon, label, value, trend, color = 'royal' }) {
  const colorStyles = {
    royal: 'bg-royal-50 text-royal-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    cyan: 'bg-cyan-50 text-cyan-600',
  };

  return (
    <div className="bg-white rounded-2xl border border-ink-200/70 p-5 shadow-soft hover:shadow-float transition-all">
      <div className="flex items-center justify-between">
        <div className={`h-11 w-11 rounded-xl ${colorStyles[color] || colorStyles.royal} flex items-center justify-center`}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        {trend && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-ink-900 tracking-tight">{value}</p>
        <p className="text-sm font-medium text-ink-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
