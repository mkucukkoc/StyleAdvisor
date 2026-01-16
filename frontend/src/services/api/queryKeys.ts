// ============================================================
// StyleAdvisor AI - React Query Keys
// ============================================================

export const QueryKeys = {
  // Auth
  currentUser: ['currentUser'] as const,

  // User
  userProfile: ['userProfile'] as const,

  // Analysis
  analysis: (id: string) => ['analysis', id] as const,
  analysisHistory: (page?: number) => ['analysisHistory', page] as const,

  // Products
  products: (params?: { query?: string; category?: string; page?: number }) =>
    ['products', params] as const,
  product: (id: string) => ['product', id] as const,

  // Wardrobe
  wardrobeItems: ['wardrobeItems'] as const,
  wardrobeItem: (id: string) => ['wardrobeItem', id] as const,

  // Favorites
  favoriteOutfits: ['favoriteOutfits'] as const,
  favoriteProducts: ['favoriteProducts'] as const,

  // Subscription
  subscriptionStatus: ['subscriptionStatus'] as const,
} as const;
