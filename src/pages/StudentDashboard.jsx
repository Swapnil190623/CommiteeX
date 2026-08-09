import React from 'react';
import { CalendarDays, Ticket, Users, Megaphone, QrCode, ArrowRight, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../services/events';
import { fetchCommunities } from '../services/communities';
import { fetchAnnouncements } from '../services/announcements';
import { fetchRegistrations } from '../services/registrations';
import { currentUser, getCommunity } from '../data/mock';
import { EventCard } from '../components/EventCard';
import { StatusBadge } from '../components/StatusBadge';

export function StudentDashboard() {
  const navigate = useNavigate();

  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const { data: communities = [] } = useQuery({ queryKey: ['communities'], queryFn: fetchCommunities });
  const { data: announcements = [] } = useQuery({ queryKey: ['announcements'], queryFn: fetchAnnouncements });
  const { data: registrations = [] } = useQuery({ queryKey: ['registrations'], queryFn: fetchRegistrations });

  const upcomingEvents = events.filter((e) => e.status === 'Open' || e.status === 'Filling Fast').slice(0, 4);
  const myRegistrations = registrations.slice(0, 4);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const today = new Date();
  const monthDays = Array.from({ length: 35 }, (_, i) => i - new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 1);
  const eventDates = new Set(events.map((e) => new Date(e.date).getDate()));
  const isThisMonth = (d) => d >= 1 && d <= new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  return (
    <div className="animate-fade-in space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-royal-600 to-royal-800 text-white p-6 sm:p-8 shadow-soft">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative z-10 max-w-2xl">
          <p className="text-white/80 text-sm font-medium">{greeting},</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight font-display">{currentUser.name} 👋</h1>
          <p className="text-white/80 mt-2 text-sm sm:text-base leading-relaxed">
            You have <strong>{myRegistrations.length}</strong> registered events. <strong>{upcomingEvents.length}</strong> new events are open for registration this week.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-royal-700 font-semibold text-xs sm:text-sm hover:bg-royal-50 transition shadow-sm"
            >
              <CalendarDays className="h-4 w-4" /> Browse Events
            </button>
            <button
              onClick={() => navigate('/my-events')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 text-white backdrop-blur-md font-semibold text-xs sm:text-sm hover:bg-white/25 transition"
            >
              <Ticket className="h-4 w-4" /> My Passbook
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: CalendarDays, label: 'Browse Events', path: '/events', color: 'royal', desc: 'Discover & Register' },
          { icon: Users, label: 'Communities', path: '/communities', color: 'emerald', desc: 'Join Associations' },
          { icon: QrCode, label: 'My QR Pass', path: '/my-events', color: 'amber', desc: 'Scan for Entry' },
          { icon: Award, label: 'Certificates', path: '/certificates', color: 'rose', desc: 'View Credentials' },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <div
              key={a.label}
              onClick={() => navigate(a.path)}
              className="bg-white rounded-2xl border border-ink-200/70 p-4 cursor-pointer hover:shadow-float hover:border-ink-300 transition-all group"
            >
              <div className={`h-10 w-10 rounded-xl bg-royal-50 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <Icon className="h-5 w-5 text-royal-600" />
              </div>
              <p className="font-semibold text-ink-900 text-sm group-hover:text-royal-600 transition-colors">{a.label}</p>
              <p className="text-xs text-ink-400 mt-0.5">{a.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink-900 font-display">Upcoming Department Events</h2>
              <button onClick={() => navigate('/events')} className="text-sm font-semibold text-royal-600 hover:text-royal-700">
                View all ({events.length})
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {upcomingEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>

          {/* My Registrations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink-900 font-display">My Registrations</h2>
              <button onClick={() => navigate('/my-events')} className="text-sm font-semibold text-royal-600 hover:text-royal-700">
                View all ({registrations.length})
              </button>
            </div>
            {myRegistrations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-ink-200/70 p-8 text-center text-ink-400 text-sm">
                No active registrations found. Browse events to register!
              </div>
            ) : (
              <div className="space-y-3">
                {myRegistrations.map((r) => {
                  const event = events.find((e) => e.id === r.eventId) || events[0];
                  const community = getCommunity(event?.communityId);
                  return (
                    <div
                      key={r.id}
                      onClick={() => navigate(`/events/${event?.id || 'ai-bootcamp'}`)}
                      className="bg-white rounded-2xl border border-ink-200/70 p-4 flex items-center gap-4 cursor-pointer hover:shadow-float transition-all"
                    >
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${
                          community?.gradient || 'from-royal-500 to-royal-700'
                        } flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-xs`}
                      >
                        {community?.code || 'CH'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink-900 truncate">{event?.title || 'Department Event'}</p>
                        <p className="text-xs text-ink-500 flex items-center gap-2 mt-0.5">
                          <CalendarDays className="h-3.5 w-3.5 text-ink-400" />
                          {event?.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Upcoming'}
                          <Clock className="h-3.5 w-3.5 ml-1 text-ink-400" />
                          {event?.time || 'Day Event'}
                        </p>
                      </div>
                      <StatusBadge color="emerald">{r.attendanceStatus || 'Registered'}</StatusBadge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Calendar Widget */}
          <div className="bg-white rounded-2xl border border-ink-200/70 p-5 shadow-soft">
            <h3 className="font-bold text-ink-900 text-base mb-3 font-display">Campus Calendar</h3>
            <p className="text-xs font-semibold text-ink-500 mb-3">{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-ink-400 mb-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {monthDays.map((d, i) => {
                const isToday = d === today.getDate() && isThisMonth(d);
                const hasEvent = isThisMonth(d) && eventDates.has(d);
                return (
                  <div
                    key={i}
                    className={`h-8 flex items-center justify-center rounded-lg relative ${
                      isToday
                        ? 'bg-royal-600 text-white font-bold'
                        : isThisMonth(d)
                        ? 'text-ink-700 hover:bg-ink-100'
                        : 'text-ink-300'
                    }`}
                  >
                    {isThisMonth(d) ? d : ''}
                    {hasEvent && !isToday && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-royal-500" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-2xl border border-ink-200/70 p-5 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-ink-900 text-base font-display">Announcements</h3>
              <button onClick={() => navigate('/announcements')} className="text-xs font-semibold text-royal-600 hover:text-royal-700">
                View all
              </button>
            </div>
            <div className="space-y-3">
              {announcements.slice(0, 3).map((a) => {
                const community = getCommunity(a.communityId);
                return (
                  <div key={a.id} className="flex gap-3 text-left">
                    <div className="h-8 w-8 rounded-lg bg-royal-50 flex items-center justify-center flex-shrink-0 text-royal-600">
                      <Megaphone className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-ink-900 line-clamp-1">{a.title}</p>
                      <p className="text-[11px] text-ink-400 mt-0.5">{a.time} · {community?.code || 'Dept'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
