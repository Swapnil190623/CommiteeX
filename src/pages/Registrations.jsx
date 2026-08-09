import React, { useState } from 'react';
import { Search, Download, CheckCircle2, Clock, XCircle, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRegistrations } from '../services/registrations';
import { fetchEvents } from '../services/events';
import { markAttendance } from '../services/attendance';
import { getCommunity } from '../data/mock';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';

export function Registrations() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [attFilter, setAttFilter] = useState('all');

  const { data: registrations = [] } = useQuery({ queryKey: ['registrations'], queryFn: fetchRegistrations });
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });

  const markMutation = useMutation({
    mutationFn: ({ id, status }) => markAttendance(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
  });

  const filtered = registrations.filter((r) => {
    if (
      query &&
      !r.studentName.toLowerCase().includes(query.toLowerCase()) &&
      !r.rollNumber.toLowerCase().includes(query.toLowerCase())
    ) {
      return false;
    }
    if (eventFilter !== 'all' && r.eventId !== eventFilter) return false;
    if (statusFilter !== 'all' && r.registrationStatus !== statusFilter) return false;
    if (attFilter !== 'all' && r.attendanceStatus !== attFilter) return false;
    return true;
  });

  const presentCount = filtered.filter((r) => r.attendanceStatus === 'Present').length;

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Event Registrations & Attendance Desk"
        subtitle={`${filtered.length} total records · ${presentCount} verified checked-in`}
        action={
          <Button variant="secondary" onClick={() => alert('Exporting registration records to CSV')}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />

      {/* Filters Toolbar */}
      <div className="bg-white rounded-2xl border border-ink-200/70 p-4 shadow-soft">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-ink-50 flex-1 border border-ink-200/50">
            <Search className="h-4 w-4 text-ink-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by student name or roll number..."
              className="bg-transparent outline-none text-sm flex-1 text-ink-800 placeholder:text-ink-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-ink-50 text-sm text-ink-700 border border-ink-200/50 outline-none cursor-pointer font-medium"
            >
              <option value="all">All Events</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-ink-50 text-sm text-ink-700 border border-ink-200/50 outline-none cursor-pointer font-medium"
            >
              <option value="all">Any Status</option>
              <option value="Registered">Registered</option>
              <option value="Waitlisted">Waitlisted</option>
            </select>
            <select
              value={attFilter}
              onChange={(e) => setAttFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-ink-50 text-sm text-ink-700 border border-ink-200/50 outline-none cursor-pointer font-medium"
            >
              <option value="all">Any Attendance</option>
              <option value="Present">Present</option>
              <option value="Registered">Not checked in</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-2xl border border-ink-200/70 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/70 text-ink-500 font-semibold text-xs uppercase">
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Year</th>
                <th className="px-5 py-3.5">Event</th>
                <th className="px-5 py-3.5">Reg. Status</th>
                <th className="px-5 py-3.5">Attendance</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((r) => {
                const event = events.find((e) => e.id === r.eventId);
                const community = event ? getCommunity(event.communityId) : undefined;
                const isPresent = r.attendanceStatus === 'Present';

                return (
                  <tr key={r.id} className="hover:bg-ink-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-ink-900">{r.studentName}</p>
                      <p className="text-xs text-ink-400 font-mono">{r.rollNumber}</p>
                    </td>
                    <td className="px-5 py-3.5 text-ink-600 text-xs">{r.department}</td>
                    <td className="px-5 py-3.5 text-ink-600 font-semibold text-xs">{r.year}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {community && <StatusBadge color={community.color}>{community.code}</StatusBadge>}
                        <span className="text-ink-700 text-xs truncate max-w-[140px] font-medium">{event?.title || r.eventId}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge color={r.registrationStatus === 'Registered' ? 'emerald' : 'amber'}>
                        {r.registrationStatus}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      {isPresent ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-ink-400 text-xs font-medium">
                          <Clock className="h-3.5 w-3.5" /> Not checked in
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {!isPresent ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => markMutation.mutate({ id: r.id, status: 'Present' })}
                          className="text-xs"
                        >
                          <Check className="h-3.5 w-3.5 text-emerald-600" /> Mark Present
                        </Button>
                      ) : (
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-ink-400 text-sm">No registrations match your search filters.</div>
        )}
      </div>
    </div>
  );
}

export default Registrations;
