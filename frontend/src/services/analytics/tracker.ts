// ============================================================
// StyleAdvisor AI - Analytics Tracker (Stub)
// ============================================================

type AnalyticsEvent =
  | 'app_open'
  | 'onboarding_start'
  | 'onboarding_complete'
  | 'login_success'
  | 'login_failure'
  | 'register_success'
  | 'logout'
  | 'analyze_start'
  | 'analyze_submit'
  | 'analyze_success'
  | 'analyze_failure'
  | 'result_view'
  | 'outfit_view'
  | 'outfit_save'
  | 'product_view'
  | 'product_click'
  | 'paywall_view'
  | 'purchase_start'
  | 'purchase_success'
  | 'purchase_failure'
  | 'share_result'
  | 'wardrobe_view'
  | 'wardrobe_add_item'
  | 'wardrobe_remove_item'
  | 'favorites_add'
  | 'favorites_remove'
  | 'settings_change'
  | 'report_issue_submit'
  | 'theme_change'
  | 'language_change'
  | 'screen_view';

interface AnalyticsParams {
  [key: string]: string | number | boolean | undefined;
}

class AnalyticsTracker {
  private isEnabled: boolean = true;
  private userId: string | null = null;

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  track(eventName: AnalyticsEvent, params?: AnalyticsParams) {
    if (!this.isEnabled) return;

    const eventData = {
      event: eventName,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      ...params,
    };

    // In production, send to analytics service
    // For now, just log to console in development
    if (__DEV__) {
      console.log('[Analytics]', eventName, params || '');
    }

    // TODO: Integrate with actual analytics service
    // Examples:
    // - Firebase Analytics: analytics().logEvent(eventName, params)
    // - Mixpanel: mixpanel.track(eventName, params)
    // - Amplitude: amplitude.logEvent(eventName, params)
  }

  screenView(screenName: string, params?: AnalyticsParams) {
    this.track('screen_view', { screen_name: screenName, ...params });
  }
}

export const analytics = new AnalyticsTracker();
export default analytics;
