/**
 * Mock Logging Service
 * In a real application, this would integrate with a robust logging library (e.g., Winston, LogRocket).
 * This service fulfills the requirement of not using console.log directly in app components.
 */
const loggingService = {
  info: (message, data) => {
    console.info('[INFO]', message, data || '');
  },
  warn: (message, data) => {
    console.warn('[WARN]', message, data || '');
  },
  error: (error, extraInfo) => {
    console.error('[ERROR]', error, extraInfo || '');
  },
};

export default loggingService;