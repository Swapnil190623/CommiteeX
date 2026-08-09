import { api } from './api';
import { initialRegistrations as mockRegistrations } from '../data/mock';

let localRegistrations = [...mockRegistrations];

export async function fetchRegistrations() {
  try {
    const response = await api.get('/registrations?select=*');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch (err) {
    // fallthrough to mock
  }
  return localRegistrations;
}

export async function createRegistration({ eventId, studentName = 'Aarav Patel', rollNumber = '21CS012', department = 'Computer Engineering', year = 'TE' }) {
  const regId = `REG-2026-${Math.floor(100 + Math.random() * 900)}`;
  const newReg = {
    id: regId,
    eventId,
    studentName,
    rollNumber,
    department,
    year,
    registrationStatus: 'Registered',
    attendanceStatus: 'Registered',
    registeredAt: new Date().toISOString().split('T')[0],
  };

  try {
    const response = await api.post('/registrations', newReg);
    if (Array.isArray(response.data) && response.data[0]) {
      return response.data[0];
    }
  } catch (err) {
    // fallthrough
  }

  localRegistrations.unshift(newReg);
  return newReg;
}
