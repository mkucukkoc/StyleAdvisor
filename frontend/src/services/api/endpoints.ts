// ============================================================
// StyleAdvisor AI - API Endpoints with Mock Adapters
// ============================================================

import { apiClient } from './client';
import {
  mockUser,
  mockUserProfile,
  mockAnalysisResult,
  mockOutfits,
  mockProducts,
  mockWardrobeItems,
  mockFreeSubscription,
  generateMockProducts,
} from './mockData';
import {
  User,
  UserProfile,
  AnalysisRequest,
  AnalysisResult,
  Outfit,
  Product,
  WardrobeItem,
  SubscriptionStatus,
  ApiResponse,
  PaginatedResponse,
} from '../../types';

// Use mock mode for development (no backend needed)
const USE_MOCK = true;

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================
// Auth Endpoints
// ============================================================

export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    if (USE_MOCK) {
      await delay(800);
      if (email && password.length >= 4) {
        return {
          success: true,
          data: {
            user: { ...mockUser, email },
            token: `mock-token-${Date.now()}`,
          },
        };
      }
      throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }
    return apiClient.post('/v1/auth/login', { email, password });
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    if (USE_MOCK) {
      await delay(1000);
      return {
        success: true,
        data: {
          user: { ...mockUser, name, email },
          token: `mock-token-${Date.now()}`,
        },
      };
    }
    return apiClient.post('/v1/auth/register', { name, email, password });
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    if (USE_MOCK) {
      await delay(600);
      return { success: true, data: { message: 'Reset link sent' } };
    }
    return apiClient.post('/v1/auth/forgot-password', { email });
  },

  logout: async (): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await delay(200);
      return { success: true };
    }
    return apiClient.post('/v1/auth/logout');
  },
};

// ============================================================
// User Endpoints
// ============================================================

export const userApi = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    if (USE_MOCK) {
      await delay(500);
      return { success: true, data: mockUserProfile };
    }
    return apiClient.get('/v1/user/profile');
  },

  updateProfile: async (updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
    if (USE_MOCK) {
      await delay(600);
      return { success: true, data: { ...mockUserProfile, ...updates } };
    }
    return apiClient.put('/v1/user/profile', updates);
  },

  deleteAccount: async (): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await delay(1000);
      return { success: true };
    }
    return apiClient.delete('/v1/user/account');
  },

  exportData: async (): Promise<ApiResponse<{ downloadUrl: string }>> => {
    if (USE_MOCK) {
      await delay(2000);
      return { success: true, data: { downloadUrl: 'https://example.com/export.zip' } };
    }
    return apiClient.get('/v1/user/export');
  },
};

// ============================================================
// Analysis Endpoints
// ============================================================

export const analysisApi = {
  create: async (request: AnalysisRequest): Promise<ApiResponse<{ id: string }>> => {
    if (USE_MOCK) {
      await delay(500);
      return { success: true, data: { id: `analysis-${Date.now()}` } };
    }
    return apiClient.post('/v1/analyses', request);
  },

  getById: async (id: string): Promise<ApiResponse<AnalysisResult>> => {
    if (USE_MOCK) {
      await delay(800);
      return { success: true, data: { ...mockAnalysisResult, id } };
    }
    return apiClient.get(`/v1/analyses/${id}`);
  },

  getHistory: async (page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<AnalysisResult>>> => {
    if (USE_MOCK) {
      await delay(600);
      const items = Array(5)
        .fill(null)
        .map((_, i) => ({
          ...mockAnalysisResult,
          id: `analysis-history-${i}`,
          createdAt: new Date(Date.now() - 86400000 * i).toISOString(),
          overallScore: 70 + Math.floor(Math.random() * 25),
        }));
      return {
        success: true,
        data: {
          items,
          total: items.length,
          page,
          pageSize: limit,
          hasMore: false,
        },
      };
    }
    return apiClient.get('/v1/history', { page, limit });
  },
};

// ============================================================
// Products Endpoints
// ============================================================

export const productsApi = {
  search: async (
    query?: string,
    category?: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    if (USE_MOCK) {
      await delay(700);
      let items = generateMockProducts(15);
      if (category) {
        items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }
      if (query) {
        items = items.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
      }
      const startIndex = (page - 1) * limit;
      const paginatedItems = items.slice(startIndex, startIndex + limit);
      return {
        success: true,
        data: {
          items: paginatedItems,
          total: items.length,
          page,
          pageSize: limit,
          hasMore: startIndex + limit < items.length,
        },
      };
    }
    return apiClient.get('/v1/products/search', { query, category, page, limit });
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    if (USE_MOCK) {
      await delay(400);
      const product = mockProducts.find((p) => p.id === id) || mockProducts[0];
      return { success: true, data: { ...product, id } };
    }
    return apiClient.get(`/v1/products/${id}`);
  },
};

// ============================================================
// Wardrobe Endpoints
// ============================================================

export const wardrobeApi = {
  getAll: async (): Promise<ApiResponse<WardrobeItem[]>> => {
    if (USE_MOCK) {
      await delay(500);
      return { success: true, data: mockWardrobeItems };
    }
    return apiClient.get('/v1/wardrobe');
  },

  getById: async (id: string): Promise<ApiResponse<WardrobeItem>> => {
    if (USE_MOCK) {
      await delay(300);
      const item = mockWardrobeItems.find((i) => i.id === id) || mockWardrobeItems[0];
      return { success: true, data: { ...item, id } };
    }
    return apiClient.get(`/v1/wardrobe/${id}`);
  },

  create: async (item: Omit<WardrobeItem, 'id' | 'createdAt'>): Promise<ApiResponse<WardrobeItem>> => {
    if (USE_MOCK) {
      await delay(800);
      const newItem: WardrobeItem = {
        ...item,
        id: `wardrobe-${Date.now()}`,
        createdAt: new Date().toISOString(),
        timesWorn: item.timesWorn || 0,
        isFavorite: item.isFavorite || false,
      };
      return { success: true, data: newItem };
    }
    return apiClient.post('/v1/wardrobe', item);
  },

  update: async (id: string, updates: Partial<WardrobeItem>): Promise<ApiResponse<WardrobeItem>> => {
    if (USE_MOCK) {
      await delay(500);
      const existing = mockWardrobeItems.find((i) => i.id === id) || mockWardrobeItems[0];
      return { success: true, data: { ...existing, ...updates, id } };
    }
    return apiClient.put(`/v1/wardrobe/${id}`, updates);
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await delay(400);
      return { success: true };
    }
    return apiClient.delete(`/v1/wardrobe/${id}`);
  },
};

// ============================================================
// Favorites Endpoints
// ============================================================

export const favoritesApi = {
  getOutfits: async (): Promise<ApiResponse<Outfit[]>> => {
    if (USE_MOCK) {
      await delay(500);
      return { success: true, data: mockOutfits.filter((o) => o.isFavorite) };
    }
    return apiClient.get('/v1/favorites/outfits');
  },

  addOutfit: async (outfit: Outfit): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await delay(300);
      return { success: true };
    }
    return apiClient.post('/v1/favorites/outfits', outfit);
  },

  removeOutfit: async (id: string): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await delay(300);
      return { success: true };
    }
    return apiClient.delete(`/v1/favorites/outfits/${id}`);
  },

  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    if (USE_MOCK) {
      await delay(500);
      return { success: true, data: mockProducts.filter((p) => p.isFavorite) };
    }
    return apiClient.get('/v1/favorites/products');
  },

  addProduct: async (product: Product): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await delay(300);
      return { success: true };
    }
    return apiClient.post('/v1/favorites/products', product);
  },

  removeProduct: async (id: string): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await delay(300);
      return { success: true };
    }
    return apiClient.delete(`/v1/favorites/products/${id}`);
  },
};

// ============================================================
// Subscription Endpoints
// ============================================================

export const subscriptionApi = {
  getStatus: async (): Promise<ApiResponse<SubscriptionStatus>> => {
    if (USE_MOCK) {
      await delay(400);
      return { success: true, data: mockFreeSubscription };
    }
    return apiClient.get('/v1/subscription/status');
  },

  subscribe: async (planId: string): Promise<ApiResponse<SubscriptionStatus>> => {
    if (USE_MOCK) {
      await delay(2000);
      return {
        success: true,
        data: {
          isPremium: true,
          plan: planId === 'yearly' ? 'yearly' : 'monthly',
          expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
          analysisRemaining: 999,
          analysisLimit: 999,
          features: [],
        },
      };
    }
    return apiClient.post('/v1/subscription/subscribe', { planId });
  },

  cancel: async (): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await delay(1000);
      return { success: true };
    }
    return apiClient.post('/v1/subscription/cancel');
  },

  restore: async (): Promise<ApiResponse<SubscriptionStatus>> => {
    if (USE_MOCK) {
      await delay(1500);
      return { success: true, data: mockFreeSubscription };
    }
    return apiClient.post('/v1/subscription/restore');
  },
};

// ============================================================
// Report Endpoints
// ============================================================

export const reportApi = {
  submitIssue: async (type: string, description: string): Promise<ApiResponse<{ ticketId: string }>> => {
    if (USE_MOCK) {
      await delay(800);
      return { success: true, data: { ticketId: `ticket-${Date.now()}` } };
    }
    return apiClient.post('/v1/report/issue', { type, description });
  },
};
