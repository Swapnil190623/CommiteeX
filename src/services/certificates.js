import { api } from './api';

const mockCertificates = [
  {
    id: 'CERT-2026-881',
    eventTitle: 'Web Development Workshop',
    issueDate: '2026-08-26',
    issuedBy: 'AI & Software Association (ASAC)',
    studentName: 'Aarav Patel',
    verificationCode: 'ASAC-WEBDEV-2026-0881',
  },
];

export async function fetchCertificates() {
  try {
    const response = await api.get('/certificates?select=*');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch (err) {
    // fallthrough to mock
  }
  return mockCertificates;
}
