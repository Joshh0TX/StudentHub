import API_BASE from '../../config';

const BASE = `${API_BASE}/api/users`;

const authFetch = (url, options = {}) => {
  const token = localStorage.getItem('token'); // we'll confirm this key next
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  }).then(r => r.json());
};

export const fetchMyProfile = () =>
  authFetch(`${BASE}/profile`);

export const updateMyProfile = (data) =>
  authFetch(`${BASE}/profile`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const uploadProfileImage = (file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('image', file);
  return fetch(`${BASE}/profile/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData, // no Content-Type here, browser sets it with boundary
  }).then(r => r.json());
};

export const uploadCoverImage = (file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('image', file);
  return fetch(`${BASE}/profile/cover`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => r.json());
};

export const fetchUserProfile = (userId) =>
  authFetch(`${BASE}/${userId}`);

export const sendFriendRequest = (receiverId) =>
  authFetch(`${BASE}/friend-request/${receiverId}`, { method: 'POST' });

export const getInboundRequests = () =>
  authFetch(`${BASE}/friends/inbound`);

export const getConnections = () =>
  authFetch(`${BASE}/friends/connections`);

export const respondToRequest = (requestId, action) =>
  authFetch(`${BASE}/friends/respond/${requestId}`, {
    method: 'POST',
    body: JSON.stringify({ action }),
  });