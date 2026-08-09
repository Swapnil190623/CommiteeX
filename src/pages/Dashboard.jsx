import React from 'react';
import { StudentDashboard } from './StudentDashboard';
import { CoordinatorDashboard } from './CoordinatorDashboard';
import { FacultyDashboard } from './FacultyDashboard';
import { AdminDashboard } from './AdminDashboard';

export function Dashboard({ role = 'student' }) {
  switch (role) {
    case 'student':
      return <StudentDashboard />;
    case 'coordinator':
      return <CoordinatorDashboard />;
    case 'faculty':
      return <FacultyDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <StudentDashboard />;
  }
}

export default Dashboard;
