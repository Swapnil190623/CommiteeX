import React from 'react';
import { Users, Megaphone, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const colorMap = {
  royal: { bg: 'bg-royal-50', text: 'text-royal-700', gradient: 'from-royal-500 to-royal-700' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', gradient: 'from-emerald-500 to-emerald-700' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', gradient: 'from-amber-500 to-orange-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', gradient: 'from-rose-500 to-rose-700' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', gradient: 'from-cyan-500 to-cyan-700' },
};

export function CommunityCard({ community }) {
  const navigate = useNavigate();
  const c = colorMap[community.color] || colorMap.royal;

  return (
    <div
      onClick={() => navigate(`/communities/${community.id}`)}
      className="group bg-surface rounded-2xl border border-border/70 shadow-soft overflow-hidden cursor-pointer hover:shadow-float hover:border-fg-faint/40 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className={`relative h-24 bg-gradient-to-br ${c.gradient}`}>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 40%, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-white/10" />
        <div className="relative h-full flex items-center justify-between px-5">
          <span className="text-white font-bold text-2xl tracking-tight">{community.code}</span>
          <span className="text-white/80 text-xs font-medium px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm">
            {community.members} members
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-fg group-hover:text-royal-700 transition-colors">{community.name}</h3>
        <p className="text-sm text-fg-muted mt-1 line-clamp-2">{community.tagline}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-fg-faint">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {community.upcomingEventIds?.length || 0} events
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {(community.committee?.length || 0) + 3} committee
          </span>
          <span className="flex items-center gap-1.5">
            <Megaphone className="h-3.5 w-3.5" />
            {community.announcementIds?.length || 0} posts
          </span>
        </div>
      </div>
    </div>
  );
}

export function CommunityLogo({ community, size = 'md' }) {
  const c = colorMap[community?.color] || colorMap.royal;
  const sizes = { sm: 'h-9 w-9 text-xs', md: 'h-12 w-12 text-sm', lg: 'h-16 w-16 text-xl' };

  return (
    <div
      className={`${sizes[size] || sizes.md} rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white font-bold flex-shrink-0`}
    >
      {community?.code || 'CH'}
    </div>
  );
}

export default CommunityCard;
