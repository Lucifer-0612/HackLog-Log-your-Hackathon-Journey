import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Hackathon {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  teamSize: number;
  plannedFeatures: number;
  completedFeatures: number;
  riskScore: number;
  riskiestPhase: 'Early' | 'Mid' | 'Final Hours';
}

export interface Failure {
  _id: string;
  hackathonId: string;
  category: 'Scope' | 'Time' | 'Tech' | 'Focus' | 'Team';
  phase: 'Early' | 'Mid' | 'Final Hours';
  description: string;
  severity: number;
  timestamp: string;
}

export interface Insight {
  _id: string;
  hackathonId: string;
  rule: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface HackerProfile {
  _id: string;
  name: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  techStack: string[];
  totalHackathons: number;
  averageCompletionRate: number;
}

export interface FailureAnalytics {
  byCategory: { category: string; count: number }[];
  byPhase: { phase: string; count: number }[];
}

export interface CreateHackathonInput {
  name: string;
  startDate: string;
  endDate: string;
  teamSize: number;
  plannedFeatures: number;
  completedFeatures: number;
  failures: {
    category: 'Scope' | 'Time' | 'Tech' | 'Focus' | 'Team';
    phase: 'Early' | 'Mid' | 'Final Hours';
    description: string;
  }[];
}

export const hackathonApi = {
  getAll: () => api.get<Hackathon[]>('/api/hackathons'),
  getById: (id: string) => api.get<Hackathon>(`/api/hackathons/${id}`),
  create: (data: CreateHackathonInput) => api.post<Hackathon>('/api/hackathons', data),
  update: (id: string, data: CreateHackathonInput) => api.put<Hackathon>(`/api/hackathons/${id}`, data),
  delete: (id: string) => api.delete(`/api/hackathons/${id}`),
  getFailures: (id: string) => api.get<Failure[]>(`/api/hackathons/${id}/failures`),
  getInsights: (id: string) => api.get<Insight[]>(`/api/hackathons/${id}/insights`),
  getAnalytics: (id: string) => api.get<FailureAnalytics>(`/api/hackathons/${id}/analytics`),
};

export const profileApi = {
  get: () => api.get<HackerProfile>('/api/profile'),
};

export default api;
