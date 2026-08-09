import React from 'react';
import { ArrowLeft, Users, Megaphone, CalendarDays, GraduationCap, Crown, Star, FileText } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCommunityById } from '../services/communities';
import { fetchEvents } from '../services/events';
import { fetchAnnouncements } from '../services/announcements';
import { StatusBadge } from '../components/StatusBadge';
import { Avatar } from '../components/Avatar';
import { EventCard } from '../components/EventCard';
import { Button } from '../components/Button';

const roleIcon = {
  Chairperson: Crown,
  'Vice Chairperson': Star,
  Secretary: FileText,
};

export function CommunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: community } = useQuery({ queryKey: ['community', id], queryFn: () => fetchCommunityById(id) });
  const { data: allEvents = [] } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const { data: allAnnouncements = [] } = useQuery({ queryKey: ['announcements'], queryFn: fetchAnnouncements });

  if (!community) {
    return <div className="bg-surface p-8 rounded-2xl text-center text-fg-muted">Community loading...</div>;
  }

  const upcomingEvents = allEvents.filter((e) => e.communityId === community.id);
  const anns = allAnnouncements.filter((a) => a.communityId === community.id);

  const leadership = [
    { ...(community.chairperson || { name: 'Aditya Sharma' }), role: 'Chairperson' },
    { ...(community.viceChairperson || { name: 'Priya Iyengar' }), role: 'Vice Chairperson' },
    { ...(community.secretary || { name: 'Rohan Verma' }), role: 'Secretary' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <button
        onClick={() => navigate('/communities')}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-fg-muted hover:text-fg transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to communities
      </button>

      {/* Hero Banner */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${
          community.gradient || 'from-royal-500 to-royal-700'
        } text-white p-6 sm:p-10 shadow-soft`}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-white/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white font-extrabold text-xl shadow-xs">
              {community.code}
            </div>
            <StatusBadge color="ink" className="bg-white/20 text-white font-bold">
              {community.code}
            </StatusBadge>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">{community.name}</h1>
          <p className="text-white/80 mt-2 text-sm sm:text-lg max-w-2xl">{community.tagline}</p>
          <div className="flex flex-wrap gap-5 mt-6 text-xs sm:text-sm text-white/90 font-medium">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" /> {community.members} members
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> {upcomingEvents.length} events
            </span>
            <span className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" /> {anns.length} announcements
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <div className="bg-surface rounded-2xl border border-border/70 p-6 shadow-soft">
            <h2 className="font-bold text-fg text-lg mb-3 font-display">About the Association</h2>
            <p className="text-fg-secondary leading-relaxed text-sm sm:text-base">{community.description}</p>
          </div>

          {/* Leadership */}
          <div className="bg-surface rounded-2xl border border-border/70 p-6 shadow-soft">
            <h2 className="font-bold text-fg text-lg mb-4 font-display">Leadership Team</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {leadership.map((p) => {
                const Icon = roleIcon[p.role] || Star;
                return (
                  <div key={p.role} className="p-4 rounded-xl bg-surface-muted text-center border border-border">
                    <div className="flex justify-center mb-2">
                      <Avatar name={p.name} color={community.color || 'royal'} size="lg" />
                    </div>
                    <p className="font-bold text-fg text-sm">{p.name}</p>
                    <p className="text-xs text-fg-muted mt-1 flex items-center justify-center gap-1 font-medium">
                      <Icon className="h-3 w-3 text-royal-600" /> {p.role}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Committee Members */}
          {community.committee && (
            <div className="bg-surface rounded-2xl border border-border/70 p-6 shadow-soft">
              <h2 className="font-bold text-fg text-lg mb-4 font-display">Committee Members & Heads</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {community.committee.map((m) => (
                  <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-muted transition-colors border border-border/50">
                    <Avatar name={m.name} color={m.avatarColor || 'royal'} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-fg truncate">{m.name}</p>
                      <p className="text-xs text-fg-faint">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Events */}
          <div>
            <h2 className="font-bold text-fg text-lg mb-4 font-display">Community Events</h2>
            {upcomingEvents.length === 0 ? (
              <div className="bg-surface rounded-2xl border border-border/70 p-8 text-center text-fg-faint text-sm">
                No events currently scheduled for this community.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {upcomingEvents.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Faculty Mentor */}
          {community.facultyMentor && (
            <div className="bg-surface rounded-2xl border border-border/70 p-6 shadow-soft">
              <h3 className="font-bold text-fg text-base mb-4 font-display">Faculty Mentor</h3>
              <div className="flex items-center gap-4">
                <Avatar name={community.facultyMentor.name} color="ink" size="lg" />
                <div>
                  <p className="font-bold text-fg text-sm sm:text-base">{community.facultyMentor.name}</p>
                  <p className="text-xs text-fg-muted flex items-center gap-1.5 mt-0.5">
                    <GraduationCap className="h-4 w-4 text-royal-600" /> {community.facultyMentor.role}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Announcements */}
          <div className="bg-surface rounded-2xl border border-border/70 p-6 shadow-soft">
            <h3 className="font-bold text-fg text-base mb-4 font-display">Community Feed</h3>
            {anns.length === 0 ? (
              <p className="text-xs text-fg-faint">No community posts yet.</p>
            ) : (
              <div className="space-y-4">
                {anns.map((a) => (
                  <div key={a.id} className="border-l-2 border-royal-500 pl-3">
                    <p className="text-xs font-semibold text-fg">{a.title}</p>
                    <p className="text-xs text-fg-muted mt-1">{a.body}</p>
                    <p className="text-[11px] text-fg-faint mt-1">{a.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button variant="secondary" className="w-full" onClick={() => navigate('/events')}>
            View All Department Events
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CommunityDetails;
