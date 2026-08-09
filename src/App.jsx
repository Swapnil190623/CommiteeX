import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/queryClient';
import { AppShell } from './components/AppShell';
import { useTheme } from './theme';

import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { RegisterSuccess } from './pages/RegisterSuccess';
import { MyEvents } from './pages/MyEvents';
import { QrPage } from './pages/QrPage';
import { Communities } from './pages/Communities';
import { CommunityDetails } from './pages/CommunityDetails';
import { Announcements } from './pages/Announcements';
import { Registrations } from './pages/Registrations';
import { Scanner } from './pages/Scanner';
import { TeamManagement } from './pages/TeamManagement';
import { Notifications } from './pages/Notifications';
import { Certificates } from './pages/Certificates';
import { AdminUsers } from './pages/AdminUsers';

// Persist role in sessionStorage so page refresh doesn't lose state
function getPersistedRole() {
  try {
    return sessionStorage.getItem('campushub_role') || null;
  } catch {
    return null;
  }
}

function persistRole(role) {
  try {
    if (role) sessionStorage.setItem('campushub_role', role);
    else sessionStorage.removeItem('campushub_role');
  } catch {}
}

export function App() {
  const [role, setRoleState] = useState(getPersistedRole);
  const { theme } = useTheme();

  function setRole(r) {
    setRoleState(r);
    persistRole(r);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell role={role} setRole={setRole}>
          <Routes>
            <Route path="/" element={<Home setRole={setRole} />} />
            <Route path="/dashboard" element={<Dashboard role={role || 'student'} />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/register-success/:eventId/:registrationId" element={<RegisterSuccess />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/qr/:registrationId" element={<QrPage />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/communities/:id" element={<CommunityDetails />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/registrations" element={<Registrations />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/team/:communityId" element={<TeamManagement />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
        <Toaster position="top-right" richColors theme={theme} />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
