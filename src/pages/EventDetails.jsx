import React, { useState } from 'react';
import { CalendarDays, MapPin, Users, ArrowLeft, CheckCircle2, Tag, CalendarClock } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchEventById, fetchEvents } from '../services/events';
import { createRegistration } from '../services/registrations';
import { getCommunity } from '../data/mock';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { Poster, EventCard } from '../components/EventCard';
import { Avatar } from '../components/Avatar';

export function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registeredId, setRegisteredId] = useState(null);

  const { data: event } = useQuery({ queryKey: ['event', id], queryFn: () => fetchEventById(id) });
  const { data: allEvents = [] } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });

  if (!event) {
    return <div className="bg-white p-8 rounded-2xl text-center text-ink-500">Event loading or not found.</div>;
  }

  const community = getCommunity(event.communityId);
  const remaining = Math.max(0, event.seatsTotal - event.seatsFilled);
  const isFull = remaining <= 0;
  const related = allEvents.filter((e) => e.communityId === event.communityId && e.id !== event.id).slice(0, 2);

  async function handleRegister() {
    const reg = await createRegistration({ eventId: event.id });
    setRegisteredId(reg.id);
    navigate(`/register-success/${event.id}/${reg.id}`);
  }

  return (
    <div className="animate-fade-in space-y-6">
      <button
        onClick={() => navigate('/events')}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to events
      </button>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left main details */}
        <div className="lg:col-span-3 space-y-6">
          <Poster event={event} className="h-56 sm:h-72 shadow-soft" />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                onClick={() => community && navigate(`/communities/${community.id}`)}
                className="cursor-pointer"
              >
                <StatusBadge color={community?.color || 'ink'}>{community?.code}</StatusBadge>
              </span>
              <StatusBadge color={event.status === 'Open' ? 'emerald' : event.status === 'Filling Fast' ? 'amber' : 'ink'}>
                {event.status}
              </StatusBadge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight font-display">{event.title}</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              {event.tags?.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 text-xs text-ink-500 bg-ink-100 px-2.5 py-1 rounded-lg">
                  <Tag className="h-3 w-3" /> {t}
                </span>
              ))}
            </div>
            <p className="text-ink-600 mt-5 leading-relaxed text-sm sm:text-base">{event.description}</p>
          </div>

          {/* Timeline */}
          {event.timeline && (
            <div className="bg-white rounded-2xl border border-ink-200/70 p-6 shadow-soft">
              <h2 className="font-bold text-ink-900 mb-4 text-base font-display">Schedule & Agenda</h2>
              <div className="space-y-1">
                {event.timeline.map((t, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-royal-50 text-royal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      {i < event.timeline.length - 1 && <div className="w-px flex-1 bg-ink-200 my-1" />}
                    </div>
                    <div className="pb-5">
                      <p className="text-xs text-ink-400 font-semibold">{t.time}</p>
                      <p className="font-semibold text-ink-800 text-sm mt-0.5">{t.title}</p>
                      <p className="text-xs text-ink-500 mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Events */}
          {related.length > 0 && (
            <div>
              <h2 className="font-bold text-ink-900 mb-4 text-base font-display">Related Events</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Registration Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-ink-200/70 p-6 shadow-soft sticky top-24">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <CalendarDays className="h-5 w-5 text-ink-400 flex-shrink-0" />
                <div>
                  <p className="text-ink-900 font-semibold">
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-ink-400 text-xs">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-5 w-5 text-ink-400 flex-shrink-0" />
                <div>
                  <p className="text-ink-900 font-semibold">{event.venue}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CalendarClock className="h-5 w-5 text-ink-400 flex-shrink-0" />
                <div>
                  <p className="text-ink-900 font-semibold">Register by {new Date(event.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-ink-100">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-ink-500 flex items-center gap-1.5"><Users className="h-4 w-4" /> Capacity</span>
                <span className="font-semibold text-ink-900">{event.seatsFilled}/{event.seatsTotal}</span>
              </div>
              <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${remaining <= 0 ? 'bg-ink-400' : remaining < 20 ? 'bg-amber-500' : 'bg-royal-500'}`}
                  style={{ width: `${(event.seatsFilled / event.seatsTotal) * 100}%` }}
                />
              </div>
              <p className="text-xs text-ink-400 mt-1.5">{remaining > 0 ? `${remaining} seats remaining` : 'Event is full'}</p>
            </div>

            <div className="mt-6">
              {registeredId ? (
                <Button variant="secondary" className="w-full" onClick={() => navigate('/my-events')}>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Registered — View Passbook
                </Button>
              ) : isFull ? (
                <Button variant="secondary" className="w-full" disabled>
                  Seats Full
                </Button>
              ) : (
                <Button className="w-full shadow-md" size="lg" onClick={handleRegister}>
                  Register in 1-Tap
                </Button>
              )}
              <p className="text-xs text-ink-400 text-center mt-3">Instant entry QR pass generated upon confirmation</p>
            </div>
          </div>

          {/* Organizers */}
          {event.organizers && (
            <div className="bg-white rounded-2xl border border-ink-200/70 p-6 shadow-soft">
              <h3 className="font-bold text-ink-900 mb-4 text-base font-display">Organizing Team</h3>
              <div className="space-y-3">
                {event.organizers.map((name) => (
                  <div key={name} className="flex items-center gap-3">
                    <Avatar name={name} color={community?.color || 'royal'} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{name}</p>
                      <p className="text-xs text-ink-400">Lead Organizer · {community?.code || 'Dept'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
