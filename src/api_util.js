import { getCookie } from './cookie';

export const apiRequest = async (url, options = {}) => {
  const csrfToken = getCookie('csrftoken'); // Fetch the latest CSRF token
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Ensures cookies are sent with requests
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};
