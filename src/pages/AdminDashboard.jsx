import React from 'react';
import { Users, CalendarDays, Shield, ClipboardList, TrendingUp, UserCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCommunities } from '../services/communities';
import { fetchEvents } from '../services/events';
import { fetchRegistrations } from '../services/registrations';
import { adminStats, adminUsers } from '../data/mock';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';

export function AdminDashboard() {
  const navigate = useNavigate();

  const { data: communities = [] } = useQuery({ queryKey: ['communities'], queryFn: fetchCommunities });
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const { data: registrations = [] } = useQuery({ queryKey: ['registrations'], queryFn: fetchRegistrations });

  return (
    <div className="animate-fade-in space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border/70 shadow-soft">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700">
            Admin Console · Global Control
          </span>
          <h1 className="text-2xl font-bold text-fg mt-2 tracking-tight font-display">System Overview</h1>
          <p className="text-fg-muted text-sm mt-1">Department-wide analytics, user directory, active communities, and event stats.</p>
        </div>
        <Button onClick={() => navigate('/admin/users')} className="shadow-md">
          <Users className="h-4 w-4" /> Manage User Directory
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={UserCheck} label="Active Students" value={adminStats.activeStudents} color="royal" trend="+12% term" />
        <StatCard icon={Users} label="Total Communities" value={communities.length || adminStats.totalCommunities} color="emerald" />
        <StatCard icon={CalendarDays} label="Total Events" value={events.length || adminStats.totalEvents} color="amber" />
        <StatCard icon={ClipboardList} label="Registrations" value={registrations.length || adminStats.totalRegistrations} color="rose" />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* User directory preview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface rounded-2xl border border-border/70 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-fg font-display">Recent Key Roles</h2>
              <button onClick={() => navigate('/admin/users')} className="text-sm font-semibold text-royal-600 hover:text-royal-700">
                View all ({adminStats.totalUsers})
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-fg-faint text-xs font-semibold uppercase">
                    <th className="pb-3 pl-1">Name</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Community</th>
                    <th className="pb-3 text-right pr-1">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {adminUsers.map((u, i) => (
                    <tr key={i} className="hover:bg-surface-muted transition-colors">
                      <td className="py-3 pl-1 font-semibold text-fg">{u.name}</td>
                      <td className="py-3 text-fg-secondary">{u.role}</td>
                      <td className="py-3 text-fg-secondary">{u.community}</td>
                      <td className="py-3 text-right pr-1">
                        <StatusBadge color={u.status === 'Active' ? 'emerald' : 'amber'}>{u.status}</StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-8">
          <div className="bg-surface rounded-2xl border border-border/70 p-6 shadow-soft">
            <h3 className="font-bold text-fg text-base mb-4 font-display">Department Health</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 rounded-xl bg-surface-muted">
                <span className="text-fg-secondary">Faculty Mentors</span>
                <span className="font-bold text-fg">{adminStats.facultyCount}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-surface-muted">
                <span className="text-fg-secondary">Pending Approvals</span>
                <span className="font-bold text-amber-600">{adminStats.pendingApprovals}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-surface-muted">
                <span className="text-fg-secondary">Active Communities</span>
                <span className="font-bold text-royal-600">{communities.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
