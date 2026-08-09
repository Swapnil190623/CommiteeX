import React from 'react';
import { CheckCircle2, QrCode, ArrowRight, CalendarDays, Clock, MapPin } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchEventById } from '../services/events';
import { currentUser } from '../data/mock';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';

export function RegisterSuccess() {
  const { eventId, registrationId } = useParams();
  const navigate = useNavigate();

  const { data: event } = useQuery({ queryKey: ['event', eventId], queryFn: () => fetchEventById(eventId) });

  return (
    <div className="max-w-2xl mx-auto animate-fade-in py-6">
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 rounded-full bg-emerald-50 items-center justify-center mb-4 animate-success-pop shadow-sm">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-fg font-display">Registration Confirmed!</h1>
        <p className="text-fg-muted mt-2 text-sm sm:text-base">
          You are successfully registered for <span className="font-semibold text-fg">{event?.title || 'Department Event'}</span>.
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border/70 p-7 shadow-soft space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-fg-faint font-medium">Registration Pass Code</p>
            <p className="font-mono font-bold text-fg text-lg">{registrationId || 'REG-2026-001'}</p>
          </div>
          <StatusBadge color="emerald">Registered</StatusBadge>
        </div>

        {event && (
          <div className="space-y-3 text-sm border-t border-border pt-5">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-fg-faint flex-shrink-0" />
              <span className="text-fg-secondary font-medium">
                {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-fg-faint flex-shrink-0" />
              <span className="text-fg-secondary font-medium">{event.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-fg-faint flex-shrink-0" />
              <span className="text-fg-secondary font-medium">{event.venue}</span>
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-royal-50 border border-royal-100">
          <div className="flex items-start gap-3">
            <QrCode className="h-5 w-5 text-royal-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-royal-800">Instant Entry QR Pass Ready</p>
              <p className="text-xs text-royal-700/80 mt-0.5">Show this pass at the desk to mark attendance upon entry.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button className="flex-1 shadow-sm" onClick={() => navigate(`/qr/${registrationId || 'REG-2026-001'}`)}>
            <QrCode className="h-4 w-4" /> View QR Pass
          </Button>
          <Button variant="secondary" className="flex-1" onClick={() => navigate('/my-events')}>
            Go to My Events <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-center text-xs text-fg-faint mt-6">
        Confirmation saved to local student passbook for {currentUser.email}
      </p>
    </div>
  );
}

export default RegisterSuccess;
