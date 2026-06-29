// Architecture stub for barcode / QR food scanning.
// Real implementation: use BarcodeDetector API (Chrome) + Open Food Facts API
// or a camera library for cross-browser support.

export const BarcodeScanner = {
  // True only in browsers that support the BarcodeDetector API
  isAvailable() {
    return 'BarcodeDetector' in window;
  },

  // Scans a barcode from the user's camera and returns the raw barcode string
  async scanFromCamera() {
    throw new Error('Barcode scanner coming soon.');
  },

  // Scans a barcode from an image File/Blob
  async scanFromImage(_file) {
    throw new Error('Barcode scanner coming soon.');
  },

  // Looks up a barcode in the food database and returns a food item object
  // { name, kcal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, brand }
  async lookupBarcode(_barcode) {
    throw new Error('Food barcode database not yet connected.');
  },
};
