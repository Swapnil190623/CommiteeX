import { api } from './api';

const mockNotifications = [
  { id: 'n1', title: 'Registration Confirmed', message: 'You are registered for AI Bootcamp 2026.', time: '10m ago', read: false },
  { id: 'n2', title: 'New Announcement', message: 'ASAC posted an update regarding bootcamp kits.', time: '2h ago', read: false },
  { id: 'n3', title: 'Attendance Marked', message: 'Your presence was recorded for Web Dev Workshop.', time: '1d ago', read: true },
];

export async function fetchNotifications() {
  try {
    const response = await api.get('/notifications?select=*');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch (err) {
    // fallthrough to mock
  }
  return mockNotifications;
}
