import { api } from './api';
import { events as mockEvents } from '../data/mock';

export async function fetchEvents() {
  try {
    const response = await api.get('/events?select=*');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch (err) {
    // fallthrough to mock
  }
  return mockEvents;
}

export async function fetchEventById(id) {
  try {
    const response = await api.get(`/events?id=eq.${id}&select=*`);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    }
  } catch (err) {
    // fallthrough to mock
  }
  return mockEvents.find((e) => e.id === id) || mockEvents[0];
}

export async function createEvent(eventData) {
  try {
    const response = await api.post('/events', eventData);
    if (Array.isArray(response.data) && response.data[0]) return response.data[0];
  } catch (err) {
    // fallthrough
  }
  return { ...eventData, id: `event-${Date.now()}` };
}
