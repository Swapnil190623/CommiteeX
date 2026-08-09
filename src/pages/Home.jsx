import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, UserCog, Shield, Users, ArrowRight, Sparkles, CalendarDays, Megaphone, QrCode } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

const roles = [
  {
    id: 'student',
    label: 'Student',
    desc: 'Browse events, register in one tap, get your QR pass, and track attendance.',
    icon: GraduationCap,
    gradient: 'from-royal-500 to-royal-700',
  },
  {
    id: 'coordinator',
    label: 'Coordinator',
    desc: 'Create events, manage registrations, scan QR codes, and lead your committee team.',
    icon: UserCog,
    gradient: 'from-emerald-500 to-emerald-700',
  },
  {
    id: 'faculty',
    label: 'Faculty',
    desc: 'Monitor communities, events, and attendance with department-wide oversight.',
    icon: Users,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'admin',
    label: 'Admin',
    desc: 'Department statistics, user directory, communities, and global platform controls.',
    icon: Shield,
    gradient: 'from-cyan-500 to-cyan-700',
  },
];

export function Home({ setRole }) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  function enter(r) {
    setRole(r);
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col lg:flex-row">
      {/* Left Brand Panel */}
      <div className="lg:w-1/2 relative overflow-hidden bg-ink-950 text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(59,91,240,0.4) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(59,91,240,0.25) 0%, transparent 45%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 mb-12">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-royal-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-xl leading-none font-display">CampusHub</p>
              <p className="text-xs text-white/50 mt-1">Department Community & Events</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-md my-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-royal-300" /> Interactive Platform Prototype
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] font-display">
            One platform for your department's communities and events.
          </h1>
          <p className="text-white/60 mt-5 text-base sm:text-lg leading-relaxed">
            Explore how students, coordinators, faculty, and admins use CampusHub — from discovering events to scanning QR passes at the desk.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 max-w-sm">
            {[
              { icon: CalendarDays, label: '6 live events' },
              { icon: Users, label: '5 communities' },
              { icon: Megaphone, label: 'Live announcements' },
              { icon: QrCode, label: 'QR attendance' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 text-sm text-white/70">
                <f.icon className="h-4 w-4 text-royal-300 flex-shrink-0" />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/40 mt-12">
          Engineering College Department Community Management System
        </div>
      </div>

      {/* Right Role Selector */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight font-display">Choose a role to explore</h2>
          <p className="text-fg-muted mt-2 text-sm sm:text-base">Each role opens a tailored dashboard. You can switch roles anytime.</p>

          <div className="mt-8 space-y-3.5">
            {roles.map((r) => {
              const Icon = r.icon;
              const active = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  onDoubleClick={() => enter(r.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${
                    active
                      ? 'border-royal-500 bg-royal-50/60 shadow-float ring-2 ring-royal-500/20'
                      : 'border-border bg-surface hover:border-fg-faint/40 hover:shadow-soft'
                  }`}
                >
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-fg">{r.label}</p>
                    <p className="text-xs sm:text-sm text-fg-muted mt-0.5 leading-snug">{r.desc}</p>
                  </div>
                  {active && <ArrowRight className="h-5 w-5 text-royal-600 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => selectedRole && enter(selectedRole)}
            disabled={!selectedRole}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-royal-600 text-white font-semibold text-sm sm:text-base hover:bg-royal-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            Enter CampusHub
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
