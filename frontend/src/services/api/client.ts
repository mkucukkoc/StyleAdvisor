// ============================================================
// StyleAdvisor AI - API Client
// ============================================================

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError, ApiResponse } from '../../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';

class ApiClient {
  private client: AxiosInstance;
  private isOffline: boolean = false;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (this.isOffline) {
          throw new Error('OFFLINE');
        }

        const token = await AsyncStorage.getItem('styleadvisor-auth');
        if (token) {
          try {
            const parsed = JSON.parse(token);
            if (parsed.state?.token) {
              config.headers.Authorization = `Bearer ${parsed.state.token}`;
            }
          } catch (e) {
            // Token parsing failed
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.message === 'OFFLINE') {
          return Promise.reject({
            code: 'OFFLINE',
            message: 'You are offline',
          });
        }

        if (!error.response) {
          return Promise.reject({
            code: 'NETWORK_ERROR',
            message: 'Network error. Please check your connection.',
          });
        }

        const { status, data } = error.response;

        if (status === 401) {
          // Token expired or invalid - could trigger logout here
          return Promise.reject({
            code: 'UNAUTHORIZED',
            message: 'Please log in to continue.',
          });
        }

        return Promise.reject(data || {
          code: 'SERVER_ERROR',
          message: 'Server error. Please try again later.',
        });
      }
    );
  }

  setOfflineMode(offline: boolean) {
    this.isOffline = offline;
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(url, { params });
    return { success: true, data: response.data };
  }

  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(url, data);
    return { success: true, data: response.data };
  }

  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(url, data);
    return { success: true, data: response.data };
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(url);
    return { success: true, data: response.data };
  }
}

export const apiClient = new ApiClient();
export default apiClient;
