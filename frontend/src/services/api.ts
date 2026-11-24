import { Candidate, Resume, DashboardStats, AnalyticsData, UploadResponse } from '../types';

const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return `${envUrl.replace(/\/$/, '')}/api`;
  }
  return '/api';
};

const API_BASE = getApiBase();

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  async uploadResumes(files: File[]): Promise<UploadResponse> {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    const res = await fetch(`${API_BASE}/resumes/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload resumes');
    }
    return res.json();
  },

  async getResumes(search?: string, status?: string): Promise<Resume[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const res = await fetch(`${API_BASE}/resumes?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch resumes');
    return res.json();
  },

  async getResume(id: number): Promise<Resume> {
    const res = await fetch(`${API_BASE}/resumes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch resume');
    return res.json();
  },

  async reprocessResume(id: number): Promise<{ success: boolean; candidate: Candidate }> {
    const res = await fetch(`${API_BASE}/resumes/${id}/reprocess`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to reprocess resume');
    }
    return res.json();
  },

  async deleteResume(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete resume');
    return res.json();
  },

  async getCandidates(params?: {
    search?: string;
    skill?: string;
    university?: string;
    experience?: string;
    sort_by?: string;
    sort_order?: string;
  }): Promise<Candidate[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.skill) query.append('skill', params.skill);
    if (params?.university) query.append('university', params.university);
    if (params?.experience) query.append('experience', params.experience);
    if (params?.sort_by) query.append('sort_by', params.sort_by);
    if (params?.sort_order) query.append('sort_order', params.sort_order);

    const res = await fetch(`${API_BASE}/candidates?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch candidates');
    return res.json();
  },

  async getCandidate(id: number): Promise<Candidate> {
    const res = await fetch(`${API_BASE}/candidates/${id}`);
    if (!res.ok) throw new Error('Failed to fetch candidate profile');
    return res.json();
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics data');
    return res.json();
  },

  getExportCsvUrl(params?: { search?: string; skill?: string; university?: string }): string {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.skill) query.append('skill', params.skill);
    if (params?.university) query.append('university', params.university);
    return `${API_BASE}/export/csv?${query.toString()}`;
  }
};
