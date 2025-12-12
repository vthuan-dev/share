const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const errors = Array.isArray(body.errors) ? body.errors : [];
    const message = body.error || errors.join('\n') || `Request failed: ${res.status}`;
    const e = new Error(message) as Error & { details?: string[] };
    if (errors.length) e.details = errors;
    throw e;
  }
  return res.json();
}

export const api = {
  login(email: string, password: string) {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  register(name: string, email: string, password: string) {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },
  me() {
    return apiRequest('/api/users/me');
  },
  groups(region?: string, province?: string) {
    const params = new URLSearchParams();
    if (region) params.append('region', region);
    if (province) params.append('province', province);
    const query = params.toString();
    return apiRequest(`/api/groups${query ? '?' + query : ''}`);
  },
  getRegions() {
    return apiRequest('/api/groups/regions');
  },
  getProvinces(region?: string) {
    const params = new URLSearchParams();
    if (region) params.append('region', region);
    const query = params.toString();
    return apiRequest(`/api/groups/provinces${query ? '?' + query : ''}`);
  },
  // Admin APIs
  getPendingUsers() {
    return apiRequest('/api/admin/users/pending');
  },
  getAllUsers() {
    return apiRequest('/api/admin/users');
  },
  approveUser(userId: string, balance?: number) {
    return apiRequest(`/api/admin/users/${userId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ balance }),
    });
  },
  rejectUser(userId: string) {
    return apiRequest(`/api/admin/users/${userId}/reject`, {
      method: 'DELETE',
    });
  },
  incrementShareCount(groupCount: number) {
    return apiRequest('/api/users/share', {
      method: 'POST',
      body: JSON.stringify({ groupCount }),
    });
  },
  getTodayNewUsers() {
    return apiRequest('/api/users/today-new-users');
  },
  updateProfile(payload: { name?: string; email?: string; phone?: string; address?: string }) {
    return apiRequest('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  // Share post with link
  sharePost(postLink: string, groupIds: string[], groupCount: number) {
    return apiRequest('/api/users/share-post', {
      method: 'POST',
      body: JSON.stringify({ postLink, groupIds, groupCount }),
    });
  },
  // Get shared posts
  getSharePosts() {
    return apiRequest('/api/users/share-posts');
  },
  // Subscription APIs
  getSubscriptionPlans() {
    return apiRequest('/api/subscription/plans');
  },
  getSubscriptionStatus() {
    return apiRequest('/api/subscription/status');
  },
  purchasePlan(planId: '6months' | '12months') {
    return apiRequest('/api/subscription/purchase', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  }
};


