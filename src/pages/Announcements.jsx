import React from 'react';
import { Megaphone, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAnnouncements } from '../services/announcements';
import { getCommunity } from '../data/mock';
import { StatusBadge } from '../components/StatusBadge';
import { PageHeader } from '../components/PageHeader';

const typeConfig = {
  info: { icon: Info, color: 'royal', bg: 'bg-royal-50', text: 'text-royal-600', label: 'Info' },
  warning: { icon: AlertTriangle, color: 'amber', bg: 'bg-amber-50', text: 'text-amber-600', label: 'Warning' },
  success: { icon: CheckCircle2, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Update' },
  urgent: { icon: AlertCircle, color: 'rose', bg: 'bg-rose-50', text: 'text-rose-600', label: 'Urgent' },
};

export function Announcements() {
  const navigate = useNavigate();
  const { data: announcements = [] } = useQuery({ queryKey: ['announcements'], queryFn: fetchAnnouncements });

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Announcements Feed" subtitle="Latest notices, schedule changes, and updates across all department communities." />

      <div className="space-y-4">
        {announcements.map((a) => {
          const cfg = typeConfig[a.type] || typeConfig.info;
          const Icon = cfg.icon;
          const community = getCommunity(a.communityId);

          return (
            <div key={a.id} className="bg-white rounded-2xl border border-ink-200/70 p-5 shadow-soft hover:shadow-float transition-all">
              <div className="flex gap-4">
                <div className={`h-10 w-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${cfg.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-ink-900 text-base">{a.title}</h3>
                    <StatusBadge color={cfg.color}>{cfg.label}</StatusBadge>
                  </div>
                  <p className="text-sm text-ink-600 mt-1.5 leading-relaxed">{a.body}</p>
                  <div className="flex items-center gap-3 mt-3.5 pt-2 border-t border-ink-100">
                    <button
                      onClick={() => community && navigate(`/communities/${community.id}`)}
                      className="flex items-center gap-2 text-xs font-semibold text-ink-600 hover:text-royal-600 transition-colors"
                    >
                      <div className={`h-5 w-5 rounded bg-gradient-to-br ${community?.gradient || 'from-royal-500 to-royal-700'} flex items-center justify-center text-white text-[9px] font-bold`}>
                        {community?.code || 'CH'}
                      </div>
                      {community?.name || 'Department'}
                    </button>
                    <span className="text-xs text-ink-300">·</span>
                    <span className="text-xs text-ink-400 font-medium">{a.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-ink-200/70 p-8 text-center shadow-soft">
        <Megaphone className="h-8 w-8 text-ink-300 mx-auto mb-2" />
        <p className="text-sm font-semibold text-ink-500">You are all caught up on department notices.</p>
      </div>
    </div>
  );
}

export default Announcements;
