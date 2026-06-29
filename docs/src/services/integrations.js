// Architecture stubs for future health platform integrations.
// None of these are implemented. Adding a real integration means replacing
// the throw with actual SDK calls and updating Premium.hasFeature() check.

export const AppleHealth = {
  isAvailable() {
    // Only available in WKWebView via native bridge
    return !!(window.__AppleHealthBridge);
  },
  async requestPermissions(_types) {
    throw new Error('Apple Health integration coming soon.');
  },
  async readSteps(_startDate, _endDate) {
    throw new Error('Apple Health integration coming soon.');
  },
  async readHeartRate(_startDate, _endDate) {
    throw new Error('Apple Health integration coming soon.');
  },
  async readBodyMass(_startDate, _endDate) {
    throw new Error('Apple Health integration coming soon.');
  },
  async writeWorkout(_workout) {
    throw new Error('Apple Health integration coming soon.');
  },
  async writeNutrition(_entry) {
    throw new Error('Apple Health integration coming soon.');
  },
};

export const Garmin = {
  isAvailable() { return false; },
  async connect(_clientId) {
    throw new Error('Garmin Connect integration coming soon.');
  },
  async getActivities(_startDate, _endDate) {
    throw new Error('Garmin Connect integration coming soon.');
  },
  async getDailyStats(_date) {
    throw new Error('Garmin Connect integration coming soon.');
  },
  disconnect() {},
};

export const Fitbit = {
  isAvailable() { return false; },
  async connect(_clientId) {
    throw new Error('Fitbit integration coming soon.');
  },
  async getActivities(_startDate, _endDate) {
    throw new Error('Fitbit integration coming soon.');
  },
  async getSleep(_date) {
    throw new Error('Fitbit integration coming soon.');
  },
  disconnect() {},
};

export const Whoop = {
  isAvailable() { return false; },
  async connect(_clientId) {
    throw new Error('WHOOP integration coming soon.');
  },
  async getRecovery(_date) {
    throw new Error('WHOOP integration coming soon.');
  },
  async getStrain(_startDate, _endDate) {
    throw new Error('WHOOP integration coming soon.');
  },
  disconnect() {},
};

// Registry of all available integrations — used by Settings to render the list
export const ALL_INTEGRATIONS = [
  { id: 'apple_health', name: 'Apple Health', platform: 'ios',     provider: AppleHealth },
  { id: 'garmin',       name: 'Garmin Connect', platform: 'any',   provider: Garmin },
  { id: 'fitbit',       name: 'Fitbit',          platform: 'any',  provider: Fitbit },
  { id: 'whoop',        name: 'WHOOP',           platform: 'any',  provider: Whoop },
];
