import axios from 'axios';

function getApiUrl() {
  // Check if we're in production (Vercel deployment)
  if (import.meta.env.PROD) {
    // In production, use your Render backend URL
    // Replace 'your-backend-name' with your actual Render service name
    return import.meta.env.VITE_API_URL || 'https://your-backend-name.onrender.com/api';
  }
  // In development, use localhost
  return 'http://localhost:3001/api';
}
const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export interface SignUpData {
  email: string;
  password: string;
  username: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export const authApi = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signin', data);
    return response.data;
  },

  signOut: async (): Promise<void> => {
    await api.post('/auth/signout');
  },

  verifyToken: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/auth/verify');
    return response.data;
  },
};

export default api; 