// src/services/api.ts
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api' // In production, use relative path
  : 'http://localhost:3000/api'; // In development, use the full URL

export const fetchApi = async <T>(url: string, options: RequestInit = {}) => {
    // Get the token from localStorage
    const token = localStorage.getItem('googleToken');
    
    // Default options
    const defaultOptions: RequestInit = {
      credentials: 'include', // Important for CORS with cookies
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };
    
    // Merge options
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/${url}`, mergedOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `API error: ${response.status}`);
      }
      
      const data: ApiResponse<T> = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };