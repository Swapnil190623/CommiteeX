import { api } from './api';
import { announcements as mockAnnouncements } from '../data/mock';

let localAnnouncements = [...mockAnnouncements];

export async function fetchAnnouncements() {
  try {
    const response = await api.get('/announcements?select=*');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch (err) {
    // fallthrough to mock
  }
  return localAnnouncements;
}

export async function createAnnouncement(announcementData) {
  const newAnn = {
    id: `a-${Date.now()}`,
    time: 'Just now',
    ...announcementData,
  };
  try {
    const response = await api.post('/announcements', newAnn);
    if (Array.isArray(response.data) && response.data[0]) {
      return response.data[0];
    }
  } catch (err) {
    // fallthrough
  }
  localAnnouncements.unshift(newAnn);
  return newAnn;
}
