import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_BASE_URL = 'https://app-92fbc2c7-21cc-4f40-beb1-ff76864f76f9.cleverapps.io/api';

const getBaseURL = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  const globalObject = globalThis as any;
  if (globalObject && globalObject.document) {
    return 'http://localhost:5000/api';
  }
  return DEFAULT_BASE_URL;
};

class APIService {
  private baseURL: string;
  public defaults = {
    headers: {
      common: {} as Record<string, string>,
    },
  };

  constructor(baseURL: string = getBaseURL()) {
    this.baseURL = baseURL;
    console.log('🔗 API Service initialisé avec:', this.baseURL);
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<{ data: T; status: number }> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      // 🔑 Récupérer le token depuis AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...this.defaults.headers.common,
      };

      // ✅ Ajouter le token dans le header Authorization
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔐 Token ajouté au header Authorization');
      }

      const options: RequestInit = {
        method,
        headers,
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: await response.json().catch(() => ({})),
          },
        };
      }

      const responseData = await response.json();
      return { data: responseData as T, status: response.status };
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<{ data: T }> {
    return this.request<T>("GET", endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<{ data: T }> {
    return this.request<T>("POST", endpoint, data);
  }

  async put<T>(endpoint: string, data: any): Promise<{ data: T }> {
    return this.request<T>("PUT", endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<{ data: T }> {
    return this.request<T>("DELETE", endpoint);
  }
}

export const api = new APIService();
