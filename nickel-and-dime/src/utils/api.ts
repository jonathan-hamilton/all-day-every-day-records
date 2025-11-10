// API configuration utility
const getApiUrl = (endpoint: string): string => {
  const apiMode = import.meta.env.VITE_API_MODE || 'production';
  const localApiUrl = import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:8000';
  const productionApiUrl = import.meta.env.VITE_PRODUCTION_API_URL || 'https://nickelanddimerecords.com/api';
  
  const baseUrl = apiMode === 'local' ? localApiUrl : productionApiUrl;
  
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  return `${baseUrl}/${cleanEndpoint}`;
};

export { getApiUrl };