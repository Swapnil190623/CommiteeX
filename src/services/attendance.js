import { api } from './api';
import { initialRegistrations } from '../data/mock';

let attendanceState = {};
initialRegistrations.forEach((r) => {
  attendanceState[r.id] = r.attendanceStatus;
});

export async function markAttendance(registrationId, status = 'Present') {
  attendanceState[registrationId] = status;
  try {
    await api.patch(`/registrations?id=eq.${registrationId}`, { attendance_status: status });
  } catch (err) {
    console.log('Attendance status fallback active');
  }
  return { id: registrationId, status };
}

export function getAttendanceStatus(registrationId) {
  return attendanceState[registrationId] || 'Registered';
}
