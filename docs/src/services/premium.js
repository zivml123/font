// Architecture stub for Premium subscription tier.
// Real implementation: Stripe + Supabase entitlement table or RevenueCat.
// To gate a feature: check Premium.hasFeature('feature_id') before calling it.

export const PLANS = {
  FREE:    'free',
  PREMIUM: 'premium',
};

// All features that exist behind a paywall.
// Add new premium features here and check them with hasFeature().
export const PREMIUM_FEATURES = {
  AI_COACH:                   'ai_coach',
  AI_FOOD_ANALYSIS_UNLIMITED: 'ai_food_analysis_unlimited',
  AI_BODY_COMPOSITION:        'ai_body_composition',
  BARCODE_SCANNER:            'barcode_scanner',
  APPLE_HEALTH_SYNC:          'apple_health_sync',
  GARMIN_SYNC:                'garmin_sync',
  FITBIT_SYNC:                'fitbit_sync',
  WHOOP_SYNC:                 'whoop_sync',
  ADVANCED_ANALYTICS:         'advanced_analytics',
  UNLIMITED_PHOTO_STORAGE:    'unlimited_photo_storage',
  PRIORITY_SUPPORT:           'priority_support',
  EXPORT_DATA:                'export_data',
};

export const Premium = {
  // Returns the user's current plan from Supabase profile or localStorage
  getCurrentPlan() {
    try {
      const settings = JSON.parse(localStorage.getItem('zivplan_settings') || '{}');
      return settings.plan || PLANS.FREE;
    } catch {
      return PLANS.FREE;
    }
  },

  // Returns true if the user's plan includes the given feature ID
  hasFeature(_featureId) {
    // All features are free until Premium is launched
    return false;
  },

  // Initiates a premium upgrade flow (Stripe checkout / RevenueCat purchase)
  async upgrade(_plan) {
    throw new Error('Premium subscriptions coming soon.');
  },

  // Restores a previous purchase (mobile / Stripe billing portal)
  async restorePurchase() {
    throw new Error('Premium subscriptions coming soon.');
  },

  // Returns the current entitlements from the backend
  async fetchEntitlements() {
    throw new Error('Premium entitlements not yet available.');
  },
};
