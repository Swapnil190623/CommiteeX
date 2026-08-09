import React, { useState } from 'react';
import { GraduationCap, Bell, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Header({ role, onSwitchRole, onToggleMobileNav, mobileNavOpen }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const roleLabels = {
    student: 'Student View',
    coordinator: 'Coordinator Console',
    faculty: 'Faculty Oversight',
    admin: 'Admin Console',
  };

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-ink-200/70">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 rounded-xl text-ink-600 hover:bg-ink-100 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="h-8 w-8 rounded-xl bg-royal-600 flex items-center justify-center shadow-sm">
              <GraduationCap className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-bold text-ink-900 text-lg">CampusHub</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-ink-100 text-ink-700 text-xs font-semibold">
            {roleLabels[role] || 'CampusHub'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search events, communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-60 rounded-xl border border-ink-200 bg-ink-50/70 pl-9 pr-3 text-xs outline-none transition focus:border-royal-500 focus:bg-white focus:ring-2 focus:ring-royal-500/20"
            />
          </form>

          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-xl hover:bg-ink-100 text-ink-500 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <button
            onClick={onSwitchRole}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-ink-200 hover:bg-ink-50 text-xs font-medium text-ink-700 transition"
          >
            <span>Role: <strong className="capitalize">{role}</strong></span>
            <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
