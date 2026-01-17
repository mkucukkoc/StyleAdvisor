// ============================================================
// StyleAdvisor AI - React Query Hooks
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from './queryKeys';
import { analysisApi, wardrobeApi, favoritesApi, productsApi, subscriptionApi } from './endpoints';
import { AnalysisRequest, WardrobeItem } from '../../types';
import { useAnalysisStore, useFavoritesStore, useWardrobeStore } from '../../stores';

// ==================== Analysis Hooks ====================

export function useAnalysisResult(id: string) {
  return useQuery({
    queryKey: QueryKeys.analysis(id),
    queryFn: () => analysisApi.getResult(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useAnalysisHistory() {
  return useQuery({
    queryKey: QueryKeys.analysisHistory,
    queryFn: () => analysisApi.getHistory(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSubmitAnalysis() {
  const queryClient = useQueryClient();
  const setCurrentResult = useAnalysisStore((state) => state.setCurrentResult);

  return useMutation({
    mutationFn: (request: AnalysisRequest) => analysisApi.submit(request),
    onSuccess: (data) => {
      if (data.data) {
        setCurrentResult(data.data);
        queryClient.invalidateQueries({ queryKey: QueryKeys.analysisHistory });
      }
    },
  });
}

// ==================== Wardrobe Hooks ====================

export function useWardrobeItems() {
  return useQuery({
    queryKey: QueryKeys.wardrobeItems,
    queryFn: () => wardrobeApi.getItems(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useWardrobeItem(id: string) {
  return useQuery({
    queryKey: QueryKeys.wardrobeItem(id),
    queryFn: () => wardrobeApi.getItem(id),
    enabled: !!id,
  });
}

export function useAddWardrobeItem() {
  const queryClient = useQueryClient();
  const addItem = useWardrobeStore((state) => state.addItem);

  return useMutation({
    mutationFn: (item: Omit<WardrobeItem, 'id' | 'createdAt'>) => wardrobeApi.addItem(item),
    onSuccess: (data) => {
      if (data.data) {
        addItem(data.data);
        queryClient.invalidateQueries({ queryKey: QueryKeys.wardrobeItems });
      }
    },
  });
}

export function useUpdateWardrobeItem() {
  const queryClient = useQueryClient();
  const updateItem = useWardrobeStore((state) => state.updateItem);

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<WardrobeItem> }) =>
      wardrobeApi.updateItem(id, updates),
    onSuccess: (data, variables) => {
      if (data.success) {
        updateItem(variables.id, variables.updates);
        queryClient.invalidateQueries({ queryKey: QueryKeys.wardrobeItems });
        queryClient.invalidateQueries({ queryKey: QueryKeys.wardrobeItem(variables.id) });
      }
    },
  });
}

export function useDeleteWardrobeItem() {
  const queryClient = useQueryClient();
  const removeItem = useWardrobeStore((state) => state.removeItem);

  return useMutation({
    mutationFn: (id: string) => wardrobeApi.deleteItem(id),
    onSuccess: (_, id) => {
      removeItem(id);
      queryClient.invalidateQueries({ queryKey: QueryKeys.wardrobeItems });
    },
  });
}

// ==================== Favorites Hooks ====================

export function useFavoriteOutfits() {
  return useQuery({
    queryKey: QueryKeys.favoriteOutfits,
    queryFn: () => favoritesApi.getOutfits(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFavoriteProducts() {
  return useQuery({
    queryKey: QueryKeys.favoriteProducts,
    queryFn: () => favoritesApi.getProducts(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useToggleFavoriteOutfit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (outfitId: string) => favoritesApi.toggleOutfit(outfitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.favoriteOutfits });
    },
  });
}

export function useToggleFavoriteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => favoritesApi.toggleProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.favoriteProducts });
    },
  });
}

// ==================== Products Hooks ====================

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: QueryKeys.productSearch(query),
    queryFn: () => productsApi.search(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: QueryKeys.productDetail(id),
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  });
}

// ==================== Subscription Hooks ====================

export function useSubscriptionStatus() {
  return useQuery({
    queryKey: QueryKeys.subscriptionStatus,
    queryFn: () => subscriptionApi.getStatus(),
    staleTime: 1000 * 60 * 5,
  });
}
