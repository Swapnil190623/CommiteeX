import React, { useState } from 'react';
import { Ticket, CalendarDays, CheckCircle2, QrCode, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../services/events';
import { fetchRegistrations } from '../services/registrations';
import { getCommunity, currentUser } from '../data/mock';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';

export function MyEvents() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('upcoming');

  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const { data: registrations = [] } = useQuery({ queryKey: ['registrations'], queryFn: fetchRegistrations });

  const myEvents = events.filter((e) => registrations.some((r) => r.eventId === e.id) || e.id === 'web-dev-workshop' || e.id === 'ai-bootcamp');

  const upcoming = myEvents.filter((e) => e.status !== 'Completed' && e.status !== 'Cancelled');
  const completed = myEvents.filter((e) => e.status === 'Completed');
  const cancelled = myEvents.filter((e) => e.status === 'Cancelled');

  const list = tab === 'upcoming' ? upcoming : tab === 'completed' ? completed : cancelled;

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
    { id: 'completed', label: 'Completed', count: completed.length },
    { id: 'cancelled', label: 'Cancelled', count: cancelled.length },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="My Passbook" subtitle="Your active event registrations, QR entry passes, and verified attendance records." />

      <div className="flex gap-2 border-b border-ink-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-royal-600 text-royal-700' : 'border-transparent text-ink-500 hover:text-ink-700'
            }`}
          >
            {t.label} <span className="text-ink-400 font-normal">({t.count})</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ink-200/70 p-12 text-center text-ink-400 text-sm">
          No {tab} registrations found.
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((e) => {
            const community = getCommunity(e.communityId);
            const reg = registrations.find((r) => r.eventId === e.id) || { id: 'REG-2026-008', attendanceStatus: 'Present' };
            const attendance = reg.attendanceStatus || (e.id === 'web-dev-workshop' ? 'Present' : 'Registered');

            return (
              <div key={e.id} className="bg-white rounded-2xl border border-ink-200/70 p-5 shadow-soft hover:shadow-float transition-all">
                <div className="flex flex-col sm:flex-row gap-5">
                  <div
                    className={`h-24 w-full sm:w-32 rounded-xl bg-gradient-to-br ${
                      community?.gradient || 'from-royal-500 to-royal-700'
                    } flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-xs`}
                  >
                    {community?.code || 'CH'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-ink-900 text-base">{e.title}</h3>
                        <p className="text-xs text-ink-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5 text-ink-400" />
                            {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-ink-400" />
                            {e.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-ink-400" />
                            {e.venue}
                          </span>
                        </p>
                      </div>
                      {attendance === 'Present' ? (
                        <StatusBadge color="emerald">
                          <CheckCircle2 className="h-3 w-3" /> Present
                        </StatusBadge>
                      ) : (
                        <StatusBadge color="royal">Registered</StatusBadge>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-ink-400">
                      <span>
                        Reg ID: <strong className="font-mono text-ink-700">{reg.id}</strong>
                      </span>
                      <span>·</span>
                      <span>
                        {currentUser.rollNumber} · {currentUser.department} ({currentUser.year})
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-ink-100">
                      <Button size="sm" variant="secondary" onClick={() => navigate(`/qr/${reg.id}`)}>
                        <QrCode className="h-4 w-4" /> View QR Entry Pass
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/events/${e.id}`)}>
                        Event Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyEvents;
