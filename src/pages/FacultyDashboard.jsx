import React from 'react';
import { Users, CalendarDays, CheckCircle2, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCommunities } from '../services/communities';
import { fetchEvents } from '../services/events';
import { fetchRegistrations } from '../services/registrations';
import { fetchAnnouncements } from '../services/announcements';
import { getCommunity } from '../data/mock';
import { StatCard } from '../components/StatCard';
import { EventCard } from '../components/EventCard';
import { Avatar } from '../components/Avatar';

export function FacultyDashboard() {
  const navigate = useNavigate();

  const { data: communities = [] } = useQuery({ queryKey: ['communities'], queryFn: fetchCommunities });
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const { data: registrations = [] } = useQuery({ queryKey: ['registrations'], queryFn: fetchRegistrations });
  const { data: announcements = [] } = useQuery({ queryKey: ['announcements'], queryFn: fetchAnnouncements });

  const totalRegs = registrations.length || 1;
  const present = registrations.filter((r) => r.attendanceStatus === 'Present').length;
  const attendanceRate = Math.round((present / totalRegs) * 100);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Page Banner */}
      <div className="bg-surface p-6 rounded-2xl border border-border/70 shadow-soft">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
          Faculty View · Read-only Oversight
        </span>
        <h1 className="text-2xl font-bold text-fg mt-2 tracking-tight font-display">Department Overview</h1>
        <p className="text-fg-muted text-sm mt-1">Monitor communities, active events, student attendance, and department announcements.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Communities" value={communities.length} color="royal" />
        <StatCard icon={CalendarDays} label="Active Events" value={events.length} color="emerald" />
        <StatCard icon={CheckCircle2} label="Attendance Rate" value={`${attendanceRate}%`} color="amber" />
        <StatCard icon={Megaphone} label="Announcements" value={announcements.length} color="rose" />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Communities Overview */}
          <div className="bg-surface rounded-2xl border border-border/70 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-fg font-display">Department Communities</h2>
              <button onClick={() => navigate('/communities')} className="text-sm font-semibold text-royal-600 hover:text-royal-700">
                View all
              </button>
            </div>
            <div className="space-y-3">
              {communities.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/communities/${c.id}`)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-muted transition-colors cursor-pointer"
                >
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${c.gradient || 'from-royal-500 to-royal-700'} flex items-center justify-center text-white font-bold text-xs shadow-xs`}>
                    {c.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-fg truncate">{c.name}</p>
                    <p className="text-xs text-fg-faint">{c.members} members · {c.upcomingEventIds?.length || 0} events</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar name={c.facultyMentor?.name || 'Faculty Mentor'} color="ink" size="sm" />
                    <div className="hidden sm:block text-right">
                      <p className="text-xs font-semibold text-fg-secondary">{c.facultyMentor?.name || 'Faculty Mentor'}</p>
                      <p className="text-[11px] text-fg-faint">Mentor</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-fg font-display">Upcoming Events</h2>
              <button onClick={() => navigate('/events')} className="text-sm font-semibold text-royal-600 hover:text-royal-700">
                View all
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {events.slice(0, 4).map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Attendance & Feed */}
        <div className="space-y-8">
          <div className="bg-surface rounded-2xl border border-border/70 p-6 shadow-soft">
            <h3 className="font-bold text-fg text-base mb-4 font-display">Attendance Breakdown</h3>
            <div className="flex items-center justify-center my-4">
              <div className="relative h-32 w-32">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#eef0f4" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="#3b5bf0"
                    strokeWidth="3"
                    strokeDasharray={`${(attendanceRate / 100) * 97.4} 97.4`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-extrabold text-fg">{attendanceRate}%</p>
                  <p className="text-xs text-fg-faint">Checked-in</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm pt-2 border-t border-border">
              <div className="flex justify-between text-xs"><span className="text-fg-muted">Total Registrations</span><span className="font-semibold text-fg">{totalRegs}</span></div>
              <div className="flex justify-between text-xs"><span className="text-fg-muted">Present</span><span className="font-semibold text-emerald-600">{present}</span></div>
              <div className="flex justify-between text-xs"><span className="text-fg-muted">Pending Check-in</span><span className="font-semibold text-fg-secondary">{Math.max(0, totalRegs - present)}</span></div>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-border/70 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-fg text-base font-display">Announcements</h3>
              <button onClick={() => navigate('/announcements')} className="text-xs font-semibold text-royal-600 hover:text-royal-700">
                View all
              </button>
            </div>
            <div className="space-y-3">
              {announcements.slice(0, 4).map((a) => {
                const community = getCommunity(a.communityId);
                return (
                  <div key={a.id} className="border-l-2 border-royal-500 pl-3">
                    <p className="text-xs font-semibold text-fg">{a.title}</p>
                    <p className="text-[11px] text-fg-faint mt-0.5">{a.time} · {community?.code || 'Dept'}</p>
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

export default FacultyDashboard;
