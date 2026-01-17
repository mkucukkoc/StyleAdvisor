// ============================================================
// StyleAdvisor AI - Premium Gating Utility
// ============================================================

import { useSubscriptionStore, useUIStore, useAnalysisStore } from '../stores';
import { analytics } from '../services';

export type PremiumFeature =
  | 'analysis'
  | 'outfit_suggestions'
  | 'product_list'
  | 'advanced_insights'
  | 'wardrobe_unlimited'
  | 'export_data';

interface PremiumCheckResult {
  allowed: boolean;
  reason?: 'limit_reached' | 'premium_required';
  remaining?: number;
}

// Premium limits for free users
const FREE_LIMITS = {
  analysis_per_day: 1,
  outfit_suggestions_visible: 2,
  product_list_visible: 10,
  wardrobe_items: 20,
};

/**
 * Check if user can access a premium feature
 * Returns allow/deny status and triggers UI actions if denied
 */
export function checkAndHandlePremiumLock(
  featureKey: PremiumFeature,
  options?: { showModal?: boolean; itemIndex?: number }
): PremiumCheckResult {
  const { isPremium, analysisRemaining, analysisLimit } = useSubscriptionStore.getState();
  const { showLimitModal } = useUIStore.getState();
  const showModal = options?.showModal ?? true;
  const itemIndex = options?.itemIndex;

  // Premium users have full access
  if (isPremium) {
    return { allowed: true };
  }

  // Check specific feature limits
  switch (featureKey) {
    case 'analysis':
      if (analysisRemaining <= 0) {
        if (showModal) {
          showLimitModal('analysis');
          analytics.track('paywall_view', { trigger: 'analysis_limit' });
        }
        return {
          allowed: false,
          reason: 'limit_reached',
          remaining: 0,
        };
      }
      return { allowed: true, remaining: analysisRemaining };

    case 'outfit_suggestions':
      if (itemIndex !== undefined && itemIndex >= FREE_LIMITS.outfit_suggestions_visible) {
        return {
          allowed: false,
          reason: 'premium_required',
        };
      }
      return { allowed: true };

    case 'product_list':
      if (itemIndex !== undefined && itemIndex >= FREE_LIMITS.product_list_visible) {
        return {
          allowed: false,
          reason: 'premium_required',
        };
      }
      return { allowed: true };

    case 'advanced_insights':
      return {
        allowed: false,
        reason: 'premium_required',
      };

    case 'wardrobe_unlimited':
      // Check current wardrobe count would need to be passed in
      return { allowed: true };

    case 'export_data':
      if (showModal) {
        showLimitModal('export');
        analytics.track('paywall_view', { trigger: 'export_data' });
      }
      return {
        allowed: false,
        reason: 'premium_required',
      };

    default:
      return { allowed: true };
  }
}

/**
 * Hook version for React components
 */
export function usePremiumCheck(featureKey: PremiumFeature) {
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const analysisRemaining = useSubscriptionStore((state) => state.analysisRemaining);

  const check = (options?: { showModal?: boolean; itemIndex?: number }) => {
    return checkAndHandlePremiumLock(featureKey, options);
  };

  return {
    isPremium,
    analysisRemaining,
    check,
    isFeatureLocked: !isPremium && ['advanced_insights', 'export_data'].includes(featureKey),
  };
}

/**
 * Check if an item in a list should be locked
 */
export function isItemLocked(
  featureKey: 'outfit_suggestions' | 'product_list',
  index: number,
  isPremium: boolean
): boolean {
  if (isPremium) return false;

  const limit = featureKey === 'outfit_suggestions'
    ? FREE_LIMITS.outfit_suggestions_visible
    : FREE_LIMITS.product_list_visible;

  return index >= limit;
}

export { FREE_LIMITS };
