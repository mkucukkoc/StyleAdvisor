// ============================================================
// StyleAdvisor AI - React Query Keys
// ============================================================

export const QueryKeys = {
  // Analysis
  analysis: (id: string) => ['analysis', id] as const,
  analysisHistory: ['analyses', 'history'] as const,
  analysisHistoryPaginated: (page: number) => ['analyses', 'history', page] as const,

  // Products
  products: ['products'] as const,
  productSearch: (query: string) => ['products', 'search', query] as const,
  productDetail: (id: string) => ['products', id] as const,
  productsByCategory: (category: string) => ['products', 'category', category] as const,

  // Wardrobe
  wardrobe: ['wardrobe'] as const,
  wardrobeItems: ['wardrobe', 'items'] as const,
  wardrobeItem: (id: string) => ['wardrobe', 'items', id] as const,
  wardrobeByCategory: (category: string) => ['wardrobe', 'category', category] as const,

  // Favorites
  favorites: ['favorites'] as const,
  favoriteOutfits: ['favorites', 'outfits'] as const,
  favoriteProducts: ['favorites', 'products'] as const,

  // User
  user: ['user'] as const,
  userProfile: ['user', 'profile'] as const,
  userPreferences: ['user', 'preferences'] as const,

  // Subscription
  subscription: ['subscription'] as const,
  subscriptionStatus: ['subscription', 'status'] as const,

  // Trends
  trends: ['trends'] as const,
  dailyOutfit: ['trends', 'daily-outfit'] as const,
} as const;

export type QueryKeyType = typeof QueryKeys;
