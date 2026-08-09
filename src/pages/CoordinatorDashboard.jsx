import React from 'react';
import { CalendarDays, Users, ClipboardList, ScanLine, UserCog, Megaphone, Plus, ArrowRight, TrendingUp, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../services/events';
import { fetchCommunities } from '../services/communities';
import { fetchRegistrations } from '../services/registrations';
import { fetchAnnouncements } from '../services/announcements';
import { currentUser, recentActivity } from '../data/mock';
import { EventCard } from '../components/EventCard';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/Button';

export function CoordinatorDashboard() {
  const navigate = useNavigate();

  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const { data: communities = [] } = useQuery({ queryKey: ['communities'], queryFn: fetchCommunities });
  const { data: registrations = [] } = useQuery({ queryKey: ['registrations'], queryFn: fetchRegistrations });
  const { data: announcements = [] } = useQuery({ queryKey: ['announcements'], queryFn: fetchAnnouncements });

  const myCommunity = communities[0] || { id: 'asac', code: 'ASAC', name: 'AI & Software Association', members: 248 };
  const myEvents = events.filter((e) => e.communityId === myCommunity.id);
  const todayEvent = myEvents[0] || events[0];
  const presentCount = registrations.filter((r) => r.attendanceStatus === 'Present').length;

  return (
    <div className="animate-fade-in space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-ink-200/70 shadow-soft">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-royal-50 text-royal-700">
            Coordinator Console · {myCommunity.code}
          </span>
          <h1 className="text-2xl font-bold text-ink-900 mt-2 tracking-tight font-display">
            Welcome back, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-ink-500 text-sm mt-1">Manage {myCommunity.name} events, registrations, and your team.</p>
        </div>
        <Button onClick={() => navigate('/events')} className="shadow-md">
          <Plus className="h-4 w-4" /> Create New Event
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarDays} label="Community Events" value={myEvents.length || events.length} trend="Live" color="royal" />
        <StatCard icon={Users} label="Total Registrations" value={registrations.length} color="emerald" />
        <StatCard icon={ClipboardList} label="Attended Count" value={presentCount} color="amber" />
        <StatCard icon={Megaphone} label="Announcements" value={announcements.length} color="rose" />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Plus, label: 'Create Event', path: '/events', color: 'royal' },
          { icon: ClipboardList, label: 'View Registrations', path: '/registrations', color: 'emerald' },
          { icon: ScanLine, label: 'Scan Pass QR', path: '/scanner', color: 'amber' },
          { icon: UserCog, label: 'Manage Team', path: '/team', color: 'rose' },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <div
              key={a.label}
              onClick={() => navigate(a.path)}
              className="bg-white rounded-2xl border border-ink-200/70 p-4 cursor-pointer hover:shadow-float hover:border-ink-300 transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-royal-50 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform text-royal-600">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-semibold text-ink-900 text-sm group-hover:text-royal-600 transition-colors">{a.label}</p>
              <ArrowRight className="h-4 w-4 text-ink-300 mt-2" />
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink-900 font-display">{myCommunity.code} Events</h2>
              <button onClick={() => navigate('/events')} className="text-sm font-semibold text-royal-600 hover:text-royal-700">
                View all
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {(myEvents.length > 0 ? myEvents : events).slice(0, 4).map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-ink-200/70 p-6 shadow-soft">
            <h2 className="text-lg font-bold text-ink-900 font-display mb-4">Recent Desk Activity</h2>
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-ink-100 flex items-center justify-center flex-shrink-0 text-ink-500">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink-800">{a.text}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Focus & Overview */}
        <div className="space-y-8">
          {todayEvent && (
            <div className="bg-white rounded-2xl border border-ink-200/70 p-5 shadow-soft">
              <h3 className="font-bold text-ink-900 text-base mb-3 font-display">Active Desk Focus</h3>
              <div className={`p-4 rounded-xl bg-gradient-to-br ${myCommunity.gradient || 'from-royal-500 to-royal-700'} text-white shadow-xs`}>
                <p className="text-white/80 text-xs font-semibold">Priority Event</p>
                <p className="font-bold mt-1 text-base">{todayEvent.title}</p>
                <p className="text-white/80 text-xs mt-1">
                  {new Date(todayEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {todayEvent.venue}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => navigate('/registrations')}>
                  Registrations
                </Button>
                <Button size="sm" variant="secondary" onClick={() => navigate('/scanner')}>
                  <ScanLine className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-ink-200/70 p-5 shadow-soft">
            <h3 className="font-bold text-ink-900 text-base mb-3 font-display">Community Overview</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${myCommunity.gradient || 'from-royal-500 to-royal-700'} flex items-center justify-center text-white font-bold text-sm shadow-xs`}>
                {myCommunity.code}
              </div>
              <div>
                <p className="font-semibold text-ink-900">{myCommunity.name}</p>
                <p className="text-xs text-ink-400">{myCommunity.members || 248} active members</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate('/team')}>
              Manage Team & Committee
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoordinatorDashboard;
