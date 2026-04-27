// js/api.js
// GitCoven API Client
// Handles all communication with the backend
// Falls back to localStorage if backend is unavailable

const API_BASE = 'http://localhost:3001/api';
// Production: const API_BASE = 'https://gitcoven-api.vercel.app/api';

const TOKEN_KEY = 'gitcoven_token';

// ── Token helpers ─────────────────────────────────────────────
function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}
function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Base fetch wrapper ────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken();
  const res   = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data;
}

// ── Auth API ──────────────────────────────────────────────────
const Auth = {
  async register({ name, username, email, password }) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, username, email, password })
    });
    setToken(data.token);
    return data;
  },

  async login({ login, password }) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password })
    });
    setToken(data.token);
    return data;
  },

  async me() {
    return apiFetch('/auth/me');
  },

  logout() {
    clearToken();
  }
};

// ── Progress API ──────────────────────────────────────────────
const Progress = {
  async load() {
    return apiFetch('/progress');
  },

  async save({ currentPhase, completedPhases, challengeData }) {
    return apiFetch('/progress', {
      method: 'PUT',
      body: JSON.stringify({ currentPhase, completedPhases, challengeData })
    });
  },

  async reset() {
    return apiFetch('/progress', { method: 'DELETE' });
  }
};

// ── Profile API ───────────────────────────────────────────────
const Profile = {
  async get() {
    return apiFetch('/profile');
  }
};

// ── Health check ──────────────────────────────────────────────
async function checkBackend() {
  try {
    const res = await fetch(`${API_BASE.replace('/api', '')}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

// Export to global scope (no bundler needed)
window.GitCovenAPI = { Auth, Progress, Profile, checkBackend, getToken };