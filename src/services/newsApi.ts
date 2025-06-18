import axios from 'axios';

const BASE_URL = '/api/news/defi-news'; // Now points to your backend

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
  const response = await axios.get(`/api/news/${newsId}/comments`);
  return response.data;
};

export const postComment = async (newsId: string, text: string) => {
  const token = localStorage.getItem('auth_token');
  const response = await axios.post(
    `/api/news/${newsId}/comments`,
    { text },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return response.data;
}; 