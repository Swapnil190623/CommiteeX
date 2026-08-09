import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Megaphone,
  Ticket,
  UserCog,
  ClipboardList,
  ScanLine,
  GraduationCap,
  Shield,
  LogOut,
  Bell,
  Award,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { currentUser } from '../data/mock';

export const roleConfig = {
  student: {
    label: 'Student',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: CalendarDays, label: 'Events', path: '/events' },
      { icon: Ticket, label: 'My Events', path: '/my-events' },
      { icon: Award, label: 'Certificates', path: '/certificates' },
      { icon: Users, label: 'Communities', path: '/communities' },
      { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    ],
  },
  coordinator: {
    label: 'Coordinator',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: CalendarDays, label: 'Events', path: '/events' },
      { icon: ClipboardList, label: 'Registrations', path: '/registrations' },
      { icon: ScanLine, label: 'Scan QR', path: '/scanner' },
      { icon: UserCog, label: 'Manage Team', path: '/team' },
      { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    ],
  },
  faculty: {
    label: 'Faculty',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: CalendarDays, label: 'Events', path: '/events' },
      { icon: Users, label: 'Communities', path: '/communities' },
      { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    ],
  },
  admin: {
    label: 'Admin',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: CalendarDays, label: 'Events', path: '/events' },
      { icon: Users, label: 'Communities', path: '/communities' },
      { icon: Shield, label: 'User Directory', path: '/admin/users' },
      { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    ],
  },
};

const roleIconMap = {
  student: GraduationCap,
  coordinator: UserCog,
  faculty: Shield,
  admin: Shield,
};

export function Sidebar({ role, onSwitchRole, onItemClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const cfg = roleConfig[role] || roleConfig.student;
  const RoleIcon = roleIconMap[role] || GraduationCap;

  function isActive(path) {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  }

  return (
    <aside className="w-64 flex flex-col border-r border-ink-200/70 bg-white sticky top-0 h-screen">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="h-9 w-9 rounded-xl bg-royal-600 flex items-center justify-center shadow-sm">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-ink-900 leading-none">CampusHub</p>
            <p className="text-xs text-ink-400 mt-1">Department Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {cfg.items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                if (onItemClick) onItemClick();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-royal-50 text-royal-700 font-semibold'
                  : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${active ? 'text-royal-600' : 'text-ink-400'}`} style={{ width: 18, height: 18 }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-ink-200/70">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-royal-500 to-royal-700 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            {currentUser.name
              .split(' ')
              .map((w) => w[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink-800 truncate">{currentUser.name}</p>
            <p className="text-xs text-ink-400 flex items-center gap-1">
              <RoleIcon className="h-3 w-3" /> {cfg.label}
            </p>
          </div>
        </div>
        <button
          onClick={onSwitchRole}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-500 hover:bg-ink-100 hover:text-ink-800 transition-all"
        >
          <LogOut className="h-4 w-4 text-ink-400" />
          Switch Role
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
