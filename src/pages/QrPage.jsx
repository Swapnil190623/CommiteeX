import React, { useMemo, useState } from 'react';
import { ArrowLeft, QrCode, CheckCircle2, ScanLine, User, Hash, CalendarDays } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchEventById } from '../services/events';
import { markAttendance, getAttendanceStatus } from '../services/attendance';
import { getCommunity, currentUser } from '../data/mock';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';

function useQrMatrix(seed, size = 21) {
  return useMemo(() => {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const rng = () => {
      h ^= h << 13;
      h ^= h >>> 17;
      h ^= h << 5;
      return (h >>> 0) / 4294967296;
    };
    const m = [];
    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) row.push(rng() > 0.5);
      m.push(row);
    }
    const placeFinder = (oy, ox) => {
      for (let y = -1; y <= 7; y++) {
        for (let x = -1; x <= 7; x++) {
          const yy = oy + y, xx = ox + x;
          if (yy < 0 || yy >= size || xx < 0 || xx >= size) continue;
          const edge = y === 0 || y === 6 || x === 0 || x === 6;
          const inner = y >= 2 && y <= 4 && x >= 2 && x <= 4;
          const border = y === -1 || y === 7 || x === -1 || x === 7;
          m[yy][xx] = border ? false : edge || inner;
        }
      }
    };
    placeFinder(0, 0);
    placeFinder(0, size - 7);
    placeFinder(size - 7, 0);
    return m;
  }, [seed, size]);
}

function QrCodeVisual({ seed }) {
  const matrix = useQrMatrix(seed);
  const size = matrix.length;
  return (
    <div className="bg-white p-4 rounded-2xl border-2 border-ink-900 inline-block shadow-sm">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, gap: '1px' }}>
        {matrix.map((row, y) =>
          row.map((on, x) => (
            <div key={`${y}-${x}`} className={on ? 'bg-ink-900' : 'bg-white'} style={{ width: 8, height: 8 }} />
          ))
        )}
      </div>
    </div>
  );
}

export function QrPage() {
  const { registrationId = 'REG-2026-001' } = useParams();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [justScanned, setJustScanned] = useState(false);
  const [attendance, setAttendance] = useState(getAttendanceStatus(registrationId));

  const { data: event } = useQuery({ queryKey: ['event', 'ai-bootcamp'], queryFn: () => fetchEventById('ai-bootcamp') });
  const community = getCommunity(event?.communityId);

  async function handleScan() {
    setScanning(true);
    setTimeout(async () => {
      await markAttendance(registrationId, 'Present');
      setAttendance('Present');
      setScanning(false);
      setJustScanned(true);
    }, 1000);
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in py-4 space-y-6">
      <button
        onClick={() => navigate('/my-events')}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to My Passbook
      </button>

      <div className="bg-white rounded-2xl border border-ink-200/70 overflow-hidden shadow-soft">
        <div className={`bg-gradient-to-br ${community?.gradient || 'from-royal-500 to-royal-700'} px-6 py-5 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs font-semibold">Official Entry Pass</p>
              <h1 className="font-bold text-lg leading-tight mt-0.5">{event?.title || 'AI Bootcamp 2026'}</h1>
            </div>
            <QrCode className="h-7 w-7 text-white/80" />
          </div>
        </div>

        <div className="p-7 space-y-6">
          <div className="flex justify-center">
            <QrCodeVisual seed={registrationId} />
          </div>

          <div className="space-y-3 text-sm border-t border-ink-100 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-ink-400 flex items-center gap-2"><User className="h-4 w-4" /> Student</span>
              <span className="font-semibold text-ink-900">{currentUser.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-400 flex items-center gap-2"><Hash className="h-4 w-4" /> Roll Number</span>
              <span className="font-mono font-bold text-ink-900">{currentUser.rollNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-400 flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Event</span>
              <span className="font-semibold text-ink-900">{event?.title || 'AI Bootcamp 2026'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-400 flex items-center gap-2"><QrCode className="h-4 w-4" /> Pass ID</span>
              <span className="font-mono font-bold text-ink-900">{registrationId}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-ink-50 flex items-center justify-between border border-ink-100">
            <span className="text-sm text-ink-600 font-medium">Verification Status</span>
            {attendance === 'Present' ? (
              <StatusBadge color="emerald">
                <CheckCircle2 className="h-3.5 w-3.5" /> Present
              </StatusBadge>
            ) : (
              <StatusBadge color="royal">Registered</StatusBadge>
            )}
          </div>

          {attendance !== 'Present' && (
            <Button className="w-full shadow-md" size="lg" onClick={handleScan} disabled={scanning}>
              <ScanLine className="h-5 w-5" /> {scanning ? 'Scanning Pass...' : 'Simulate Desk QR Scan'}
            </Button>
          )}

          {justScanned && attendance === 'Present' && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 animate-success-pop">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-emerald-800 text-sm">Attendance Recorded Successfully!</p>
                <p className="text-xs text-emerald-700/80">You are checked in for {event?.title}.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QrPage;
