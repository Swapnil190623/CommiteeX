import { api } from './api';
import { communities as mockCommunities } from '../data/mock';

export async function fetchCommunities() {
  try {
    const response = await api.get('/communities?select=*');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch (err) {
    // fallthrough to mock
  }
  return mockCommunities;
}

export async function fetchCommunityById(id) {
  try {
    const response = await api.get(`/communities?id=eq.${id}&select=*`);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    }
  } catch (err) {
    // fallthrough to mock
  }
  return mockCommunities.find((c) => c.id === id) || mockCommunities[0];
}
