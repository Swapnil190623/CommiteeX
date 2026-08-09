import React from 'react';
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCommunity } from '../data/mock';
import { StatusBadge } from './StatusBadge';

export function statusColor(status) {
  switch (status) {
    case 'Open':
      return 'emerald';
    case 'Filling Fast':
      return 'amber';
    case 'Closed':
    case 'Completed':
      return 'ink';
    case 'Cancelled':
      return 'rose';
    default:
      return 'ink';
  }
}

export function Poster({ event, className = '' }) {
  const community = getCommunity(event?.communityId);
  const gradient = community?.gradient || 'from-royal-500 to-royal-700';

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradient} ${className}`}>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-white/10" />
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
      <div className="relative h-full flex flex-col justify-between p-4">
        <span className="text-white/80 text-xs font-semibold tracking-wide">{community?.code}</span>
        <p className="text-white font-bold text-lg leading-tight line-clamp-2">{event?.poster || event?.title}</p>
      </div>
    </div>
  );
}

export function EventCard({ event }) {
  const navigate = useNavigate();
  const community = getCommunity(event.communityId);
  const remaining = Math.max(0, event.seatsTotal - event.seatsFilled);
  const pct = Math.round((event.seatsFilled / event.seatsTotal) * 100);

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="group bg-white rounded-2xl border border-ink-200/70 shadow-soft overflow-hidden cursor-pointer hover:shadow-float hover:border-ink-300 hover:-translate-y-0.5 transition-all duration-200"
    >
      <Poster event={event} className="h-32" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <StatusBadge color={community?.color || 'ink'}>{community?.code}</StatusBadge>
          <StatusBadge color={statusColor(event.status)}>{event.status}</StatusBadge>
        </div>
        <h3 className="font-semibold text-ink-900 group-hover:text-royal-700 transition-colors line-clamp-1">
          {event.title}
        </h3>
        <div className="mt-3 space-y-1.5 text-sm text-ink-500">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-ink-400 flex-shrink-0" />
            <span className="truncate">
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-ink-400 flex-shrink-0" />
            <span className="truncate">{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-ink-400 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-ink-100">
          <div className="flex items-center justify-between text-xs text-ink-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {event.seatsFilled}/{event.seatsTotal} seats
            </span>
            <span>{remaining} left</span>
          </div>
          <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                pct >= 100 ? 'bg-ink-400' : pct >= 80 ? 'bg-amber-500' : 'bg-royal-500'
              }`}
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
