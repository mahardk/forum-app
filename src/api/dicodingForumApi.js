const BASE_URL = 'https://forum-api.dicoding.dev/v1';

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function putAccessToken(token) {
  localStorage.setItem('accessToken', token);
}

function clearAccessToken() {
  localStorage.removeItem('accessToken');
}

async function fetchWithAuth(url, options = {}) {
  const token = getAccessToken();
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

async function handleResponse(response) {
  const json = await response.json();
  if (!response.ok) {
    const message = json?.message || 'Terjadi kesalahan';
    throw new Error(message);
  }
  return json;
}

const dicodingForumApi = {
  getAccessToken,
  putAccessToken,
  clearAccessToken,

  async register({ name, email, password }) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(res);
  },

  async login({ email, password }) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async getOwnProfile() {
    const res = await fetchWithAuth(`${BASE_URL}/users/me`);
    return handleResponse(res);
  },

  async getAllUsers() {
    const res = await fetch(`${BASE_URL}/users`);
    return handleResponse(res);
  },

  async getAllThreads() {
    const res = await fetch(`${BASE_URL}/threads`);
    return handleResponse(res);
  },

  async getThreadDetail(threadId) {
    const res = await fetch(`${BASE_URL}/threads/${threadId}`);
    return handleResponse(res);
  },

  async createThread({ title, body, category }) {
    const res = await fetchWithAuth(`${BASE_URL}/threads`, {
      method: 'POST',
      body: JSON.stringify({ title, body, category }),
    });
    return handleResponse(res);
  },

  async createComment({ threadId, content }) {
    const res = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return handleResponse(res);
  },

  async upVoteThread(threadId) {
    const res = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/up-vote`, { method: 'POST' });
    return handleResponse(res);
  },

  async downVoteThread(threadId) {
    const res = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/down-vote`, { method: 'POST' });
    return handleResponse(res);
  },

  async neutralizeThreadVote(threadId) {
    const res = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/neutral-vote`, { method: 'POST' });
    return handleResponse(res);
  },

  async upVoteComment({ threadId, commentId }) {
    const res = await fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
      { method: 'POST' },
    );
    return handleResponse(res);
  },

  async downVoteComment({ threadId, commentId }) {
    const res = await fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
      { method: 'POST' },
    );
    return handleResponse(res);
  },

  async neutralizeCommentVote({ threadId, commentId }) {
    const res = await fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
      { method: 'POST' },
    );
    return handleResponse(res);
  },

  async getLeaderboards() {
    const res = await fetch(`${BASE_URL}/leaderboards`);
    return handleResponse(res);
  },
};

export default dicodingForumApi;