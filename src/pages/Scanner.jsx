import React, { useState } from 'react';
import { ScanLine, CheckCircle2, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRegistrations } from '../services/registrations';
import { fetchEvents } from '../services/events';
import { markAttendance } from '../services/attendance';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';

export function Scanner() {
  const queryClient = useQueryClient();
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [manualCode, setManualCode] = useState('');

  const { data: registrations = [] } = useQuery({ queryKey: ['registrations'], queryFn: fetchRegistrations });
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });

  const markMutation = useMutation({
    mutationFn: ({ id, status }) => markAttendance(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
  });

  function triggerScan(targetReg = null) {
    setScanning(true);
    setScannedResult(null);
    setTimeout(() => {
      let pick = targetReg;
      if (!pick) {
        const pending = registrations.filter((r) => r.attendanceStatus !== 'Present');
        pick = pending[Math.floor(Math.random() * pending.length)] || registrations[0];
      }
      if (pick) {
        markMutation.mutate({ id: pick.id, status: 'Present' });
        const event = events.find((e) => e.id === pick.eventId);
        setScannedResult({
          name: pick.studentName,
          roll: pick.rollNumber,
          event: event?.title || 'Department Event',
          regId: pick.id,
        });
      }
      setScanning(false);
    }, 1200);
  }

  function handleManualSubmit(e) {
    e.preventDefault();
    if (!manualCode.trim()) return;
    const match = registrations.find(
      (r) => r.id.toLowerCase() === manualCode.trim().toLowerCase() || r.rollNumber.toLowerCase() === manualCode.trim().toLowerCase()
    );
    if (match) {
      triggerScan(match);
    } else {
      alert(`No registration record found for '${manualCode}'`);
    }
  }

  const presentList = registrations.filter((r) => r.attendanceStatus === 'Present');

  return (
    <div className="max-w-xl mx-auto animate-fade-in space-y-6">
      <PageHeader title="Desk QR Scanner" subtitle="Scan student QR pass or enter registration ID to record attendance." />

      <div className="bg-surface rounded-2xl border border-border/70 p-6 shadow-soft space-y-6">
        {/* Scanner Viewport */}
        <div className="relative aspect-square max-w-sm mx-auto rounded-2xl bg-ink-950 overflow-hidden shadow-md">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Corner Brackets */}
          <div className="absolute top-6 left-6 h-10 w-10 border-l-4 border-t-4 border-royal-400 rounded-tl-lg" />
          <div className="absolute top-6 right-6 h-10 w-10 border-r-4 border-t-4 border-royal-400 rounded-tr-lg" />
          <div className="absolute bottom-6 left-6 h-10 w-10 border-l-4 border-b-4 border-royal-400 rounded-bl-lg" />
          <div className="absolute bottom-6 right-6 h-10 w-10 border-r-4 border-b-4 border-royal-400 rounded-br-lg" />

          {/* Animated Scan Line */}
          {scanning && <div className="absolute left-6 right-6 h-0.5 bg-royal-400 shadow-[0_0_12px_2px_rgba(59,91,240,0.7)] scan-line" />}

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70">
            {scanning ? (
              <p className="text-sm font-semibold animate-pulse">Processing Pass Code...</p>
            ) : (
              <ScanLine className="h-12 w-12 text-white/40" />
            )}
          </div>
        </div>

        <Button className="w-full shadow-md" size="lg" onClick={() => triggerScan()} disabled={scanning}>
          <ScanLine className="h-5 w-5" /> {scanning ? 'Scanning...' : 'Simulate Camera Scan'}
        </Button>

        {/* Manual Lookup */}
        <form onSubmit={handleManualSubmit} className="flex gap-2 pt-2 border-t border-border">
          <input
            type="text"
            placeholder="Enter Reg ID (e.g. REG-2026-001) or Roll No."
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-surface-muted text-xs font-mono outline-none focus:border-royal-500 focus:bg-surface"
          />
          <Button type="submit" variant="secondary" size="sm">
            <Search className="h-4 w-4" /> Verify
          </Button>
        </form>

        {/* Scan Result */}
        {scannedResult && (
          <div className="animate-success-pop space-y-4">
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-emerald-900 text-sm">Attendance Verified & Recorded</p>
                  <p className="text-xs text-emerald-700/80">{scannedResult.name} is now marked Present.</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-surface-muted border border-border space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-fg-muted">Student</span><span className="font-bold text-fg">{scannedResult.name}</span></div>
              <div className="flex justify-between"><span className="text-fg-muted">Roll Number</span><span className="font-mono font-bold text-fg">{scannedResult.roll}</span></div>
              <div className="flex justify-between"><span className="text-fg-muted">Event</span><span className="font-semibold text-fg">{scannedResult.event}</span></div>
              <div className="flex justify-between"><span className="text-fg-muted">Pass Code</span><span className="font-mono font-bold text-fg">{scannedResult.regId}</span></div>
            </div>
          </div>
        )}

        {/* Recent verified desk records */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs font-bold text-fg-secondary mb-3">Recent Verified Check-ins</p>
          <div className="space-y-2">
            {presentList.slice(0, 3).map((r) => {
              const event = events.find((e) => e.id === r.eventId);
              return (
                <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-muted border border-border/60 text-xs">
                  <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-fg truncate">{r.studentName}</p>
                    <p className="text-[11px] text-fg-faint">{r.rollNumber} · {event?.title || r.eventId}</p>
                  </div>
                  <StatusBadge color="emerald">Present</StatusBadge>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scanner;
