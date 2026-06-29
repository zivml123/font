// AI service interface — clean placeholders for future features.
// Actual AI calls always go through the backend proxy in server.js.
// Never call Anthropic directly from the browser.
//
// To implement a service: replace the stub body, add the endpoint to server.js,
// then call it via the callBackend() helper in api.js.

import { analyzeText as _analyzeText, analyzePhoto as _analyzePhoto } from '../api.js';

// ─── AI Food Analysis ─────────────────────────────────────────────────────────
// Implemented via backend proxy. Wraps api.js for consolidated imports.
export const AIFoodAnalysis = {
  // analyzeText: analyze a text description of a meal.
  // Returns: { item, kcal, protein, carbs, fat, warning, explanation }
  async analyzeText(text) {
    return _analyzeText(text);
  },

  // analyzePhoto: analyze a photo of food.
  // Returns: { item, kcal, protein, carbs, fat, warning, explanation }
  async analyzePhoto(file) {
    return _analyzePhoto(file);
  },
};

// ─── AI Coach ────────────────────────────────────────────────────────────────
// Future: weekly personalized advice based on training + nutrition patterns.
export const AICoach = {
  // getAdvice: returns a coaching message for the current week.
  // context: { workoutProgress, weeklyNutrition, weightTrend, profile }
  // Returns: { message: string, tips: string[] }
  async getAdvice(_context) {
    // TODO: implement via POST /api/coach-advice in server.js
    throw new Error('AI Coach not yet available. Coming soon.');
  },

  // getMotivation: returns a short motivational message.
  // context: { streak, lastWorkoutDate, calorieAdherence }
  // Returns: { message: string }
  async getMotivation(_context) {
    // TODO: implement via POST /api/coach-motivation in server.js
    throw new Error('AI Coach not yet available. Coming soon.');
  },
};

// ─── AI Workout Recommendations ───────────────────────────────────────────────
// Future: progressive overload suggestions and plateau detection.
export const AIWorkoutRecommendations = {
  // getNextWorkout: suggest adjustments for the next session.
  // progress: workout progress object; profile: user profile
  // Returns: { suggestions: [{ exercise, currentSets, currentReps, recommendation }] }
  async getNextWorkout(_progress, _profile) {
    // TODO: implement via POST /api/workout-recommendations in server.js
    throw new Error('AI Workout Recommendations not yet available. Coming soon.');
  },

  // detectPlateau: flag if user has stalled on a metric.
  // weightLog: array of { date, weight_kg }; workoutHistory: recent sessions
  // Returns: { plateauDetected: boolean, metric: string, recommendation: string }
  async detectPlateau(_weightLog, _workoutHistory) {
    // TODO: implement via POST /api/detect-plateau in server.js
    throw new Error('AI Plateau Detection not yet available. Coming soon.');
  },
};

// ─── AI Body Composition (future) ────────────────────────────────────────────
// Estimate body composition from progress photos using vision.
export const AIBodyComposition = {
  // estimateFromPhoto: rough body fat % estimate from a photo.
  // file: File object (image)
  // Returns: { estimated_fat_pct: number, confidence: 'low'|'medium', notes: string }
  async estimateFromPhoto(_file) {
    // TODO: implement via POST /api/body-composition in server.js
    throw new Error('AI Body Composition not yet available. Coming soon.');
  },
};
