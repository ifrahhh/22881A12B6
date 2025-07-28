import loggingService from './loggingService';

const STORAGE_KEY = 'shortenedUrls';

// --- Helper Functions ---

const getUrlsFromStorage = () => {
  try {
    const urls = localStorage.getItem(STORAGE_KEY);
    return urls ? JSON.parse(urls) : [];
  } catch (error) {
    loggingService.error('Failed to parse URLs from localStorage', error);
    return [];
  }
};

const saveUrlsToStorage = (urls) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
  } catch (error) {
    loggingService.error('Failed to save URLs to localStorage', error);
  }
};

const generateShortcode = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortcode = '';
  for (let i = 0; i < length; i++) {
    shortcode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return shortcode;
};


// --- Main Service Object ---

const urlService = {
  /**
   * Creates a new shortened URL.
   * @param {string} originalUrl The URL to shorten.
   * @param {string|null} customShortcode An optional user-provided shortcode.
   * @param {number|null} validityInMinutes Optional validity period. Defaults to 30.
   * @returns {Promise<{success: boolean, message: string, data: object|null}>}
   */
  createShortUrl: async (originalUrl, customShortcode, validityInMinutes) => {
    loggingService.info('Attempting to create short URL for:', originalUrl);
    const allUrls = getUrlsFromStorage();

    // 1. Determine Shortcode
    let shortcode = customShortcode;
    if (shortcode) {
      if (!/^[a-zA-Z0-9]+$/.test(shortcode)) {
        return { success: false, message: 'Custom shortcode must be alphanumeric.', data: null };
      }
      if (allUrls.some(url => url.shortcode === shortcode)) {
        return { success: false, message: `Shortcode "${shortcode}" is already taken.`, data: null };
      }
    } else {
      do {
        shortcode = generateShortcode();
      } while (allUrls.some(url => url.shortcode === shortcode));
    }

    // 2. Determine Expiry
    const validity = validityInMinutes || 30; // Default to 30 minutes
    const creationDate = new Date();
    const expiryDate = new Date(creationDate.getTime() + validity * 60000);

    // 3. Create and Save New URL Object
    const newUrl = {
      id: shortcode,
      originalUrl,
      shortcode,
      createdAt: creationDate.toISOString(),
      expiresAt: expiryDate.toISOString(),
      clicks: [],
    };

    allUrls.push(newUrl);
    saveUrlsToStorage(allUrls);
    loggingService.info('Successfully created short URL:', newUrl);

    return { success: true, message: 'URL shortened successfully!', data: newUrl };
  },

  /**
   * Retrieves all shortened URLs.
   * @returns {Array} An array of URL objects.
   */
  getAllUrls: () => {
    return getUrlsFromStorage().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /**
   * Finds a URL by its shortcode and logs a click if found and valid.
   * @param {string} shortcode The shortcode to look up.
   * @returns {object|null} The URL object if found and valid, otherwise null.
   */
  getUrlAndLogClick: (shortcode) => {
    const allUrls = getUrlsFromStorage();
    const urlIndex = allUrls.findIndex(url => url.shortcode === shortcode);

    if (urlIndex === -1) {
      loggingService.warn('Attempted to access non-existent shortcode:', shortcode);
      return null;
    }

    const url = allUrls[urlIndex];

    // Check for expiry
    if (new Date(url.expiresAt) < new Date()) {
      loggingService.warn('Attempted to access expired shortcode:', shortcode);
      return { ...url, isExpired: true };
    }

    // Log the click
    const clickData = {
      timestamp: new Date().toISOString(),
      source: document.referrer || 'Direct',
      // Geolocation is not feasible client-side without external APIs.
      location: 'N/A (Client-Side)',
    };
    url.clicks.push(clickData);
    allUrls[urlIndex] = url;
    saveUrlsToStorage(allUrls);
    loggingService.info(`Click logged for ${shortcode}`, clickData);

    return url;
  },
};

export default urlService;