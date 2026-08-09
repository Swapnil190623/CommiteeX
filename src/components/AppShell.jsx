import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, roleConfig } from './Sidebar';
import { Header } from './Header';
import { LogOut } from 'lucide-react';

export function AppShell({ children, role, setRole }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function handleSwitchRole() {
    setRole(null);
    navigate('/');
  }

  // If no active role selected and on landing page '/', return standalone view without shell
  if (!role || location.pathname === '/') {
    return <>{children}</>;
  }

  const cfg = roleConfig[role] || roleConfig.student;

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar role={role} onSwitchRole={handleSwitchRole} />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-full bg-surface h-full shadow-2xl flex flex-col">
            <Sidebar
              role={role}
              onSwitchRole={handleSwitchRole}
              onItemClick={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Header
          role={role}
          onSwitchRole={handleSwitchRole}
          onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
          mobileNavOpen={mobileNavOpen}
        />

        {/* Mobile secondary navigation pill bar */}
        <div className="lg:hidden flex gap-1.5 overflow-x-auto px-4 py-2.5 bg-surface border-b border-border/70 scrollbar-none">
          {cfg.items.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-royal-50 text-royal-700 font-semibold shadow-xs'
                    : 'text-fg-secondary bg-surface-muted hover:bg-surface-hover'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
          <button
            onClick={handleSwitchRole}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap text-fg-muted bg-surface-muted hover:bg-surface-hover"
          >
            <LogOut className="h-3.5 w-3.5" />
            Switch
          </button>
        </div>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-6xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
