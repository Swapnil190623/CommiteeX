import React, { useState } from 'react';
import { Search, UserPlus, Shield, GraduationCap, UserCog } from 'lucide-react';
import { adminUsers, adminStats } from '../data/mock';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';

export function AdminUsers() {
  const [query, setQuery] = useState('');

  const filtered = adminUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase()) ||
      u.community.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Department User Directory"
        subtitle={`System-wide user roles, faculty mentors, chairpersons, and volunteers (${adminStats.totalUsers} registered).`}
        action={
          <Button onClick={() => alert('Add User Modal')}>
            <UserPlus className="h-4 w-4" /> Add New User
          </Button>
        }
      />

      <div className="bg-surface rounded-2xl border border-border/70 p-4 shadow-soft">
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-muted border border-border/50">
          <Search className="h-4 w-4 text-fg-faint flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search directory by name, role, or community..."
            className="bg-transparent outline-none text-sm flex-1 text-fg placeholder:text-fg-faint"
          />
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border/70 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/70 text-fg-muted font-semibold text-xs uppercase">
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Assigned Role</th>
                <th className="px-5 py-3.5">Community</th>
                <th className="px-5 py-3.5 text-right">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((u, i) => (
                <tr key={i} className="hover:bg-surface-muted/50 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-fg">{u.name}</td>
                  <td className="px-5 py-3.5 text-fg-secondary font-medium text-xs">{u.role}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge color="royal">{u.community}</StatusBadge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <StatusBadge color={u.status === 'Active' ? 'emerald' : 'amber'}>{u.status}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
