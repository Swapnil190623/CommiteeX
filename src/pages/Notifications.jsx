import React from 'react';
import { Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotifications } from '../services/notifications';
import { PageHeader } from '../components/PageHeader';

export function Notifications() {
  const { data: notifications = [] } = useQuery({ queryKey: ['notifications'], queryFn: fetchNotifications });

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Notifications Center" subtitle="Stay updated with registration status, desk updates, and department alerts." />

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="bg-white rounded-2xl border border-ink-200/70 p-5 shadow-soft hover:shadow-float transition-all flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-royal-50 flex items-center justify-center flex-shrink-0 text-royal-600">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink-900 text-sm">{n.title}</h3>
                <span className="text-xs text-ink-400 font-medium">{n.time}</span>
              </div>
              <p className="text-xs text-ink-600 mt-1 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
