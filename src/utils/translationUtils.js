/**
 * Safely translates a key, handling cases where the translation might be an object
 * instead of a string (nested translations).
 * 
 * @param {Function} t - The i18next translation function
 * @param {string} key - The translation key to translate
 * @param {string} defaultValue - Default value to use if translation fails
 * @returns {string} - The translated string or fallback
 */
export const safeTranslate = (t, key, defaultValue = '') => {
  try {
    const result = t(key, defaultValue);
    
    // Check if the result is an object (nested translations)
    if (typeof result === 'object' && result !== null) {
      console.error(`Translation key "${key}" returned an object instead of a string:`, result);
      return defaultValue || key.split('.').pop(); // Fallback to default or the last part of the key
    }
    
    return result;
  } catch (err) {
    console.error(`Translation error for key: ${key}`, err);
    return defaultValue || key.split('.').pop();
  }
};

/**
 * Creates a safeTranslate function bound to the provided translation function.
 * 
 * @param {Function} t - The i18next translation function
 * @returns {Function} - A bound safeTranslate function
 */
export const createSafeTranslate = (t) => {
  return (key, defaultValue = '') => safeTranslate(t, key, defaultValue);
};

export default {
  safeTranslate,
  createSafeTranslate
}; 