import axios from 'axios';

function getApiUrl() {
  // Always check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback based on environment
  if (import.meta.env.PROD) {
    // In production, use your Render backend URL
    return 'https://my-defillama-dashboard-backend.onrender.com/api';
  }
  
  // In development, use localhost
  return 'http://localhost:3001/api';
}

const API_URL = getApiUrl();
const BASE_URL = `${API_URL}/news/defi-news`;

export const fetchDeFiNews = async () => {
  const response = await axios.get(BASE_URL);
  // CryptoCompare returns { results: [ { id, title, body, published_on, url } ] }
  // Map to expected NewsItem shape
  return (response.data.results || []).map((item: any) => ({
    id: String(item.id),
    title: item.title,
    description: item.body,
    published_at: new Date(item.published_on * 1000).toISOString(),
    url: item.url,
  }));
};

export const fetchComments = async (newsId: string) => {
  const response = await axios.get(`${API_URL}/news/${newsId}/comments`);
  return response.data;
};

export const postComment = async (newsId: string, text: string) => {
  const token = localStorage.getItem('auth_token');
  const response = await axios.post(
    `${API_URL}/news/${newsId}/comments`,
    { text },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return response.data;
}; 