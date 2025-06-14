import { LRUCache } from "lru-cache";

// Cache configuration
const cache = new LRUCache<string, any>({
  max: 500, // Maximum number of items to store
  ttl: 1000 * 60 * 60, // Time to live: 1 hour
});

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 30; // Maximum requests per minute
const requestTimestamps: number[] = [];

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Helper function to check rate limit
function checkRateLimit(): boolean {
  const now = Date.now();
  // Remove timestamps older than the window
  while (
    requestTimestamps.length > 0 &&
    requestTimestamps[0] < now - RATE_LIMIT_WINDOW
  ) {
    requestTimestamps.shift();
  }

  // Check if we're under the limit
  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  // Add current timestamp
  requestTimestamps.push(now);
  return true;
}

// Helper function to calculate exponential backoff delay
function getRetryDelay(retryCount: number): number {
  return Math.min(INITIAL_RETRY_DELAY * Math.pow(2, retryCount), 10000); // Max 10 seconds
}

// Main API call function with retry, rate limiting, and caching
export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  cacheKey?: string,
  retryCount = 0
): Promise<any> {
  // Check cache first if cacheKey is provided
  if (cacheKey) {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`);
      return cachedData;
    }
  }

  // Check rate limit
  if (!checkRateLimit()) {
    const waitTime = RATE_LIMIT_WINDOW - (Date.now() - requestTimestamps[0]);
    console.log(`Rate limit reached, waiting ${waitTime}ms`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  try {
    const response = await fetch(url, options);

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After") || "60");
      console.log(`Rate limited, retrying after ${retryAfter} seconds`);
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      return fetchWithRetry(url, options, cacheKey, retryCount);
    }

    // Handle other errors
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the response if cacheKey is provided
    if (cacheKey) {
      cache.set(cacheKey, data);
    }

    return data;
  } catch (error) {
    // Retry logic
    if (retryCount < MAX_RETRIES) {
      const delay = getRetryDelay(retryCount);
      console.log(`Retry attempt ${retryCount + 1} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, cacheKey, retryCount + 1);
    }
    throw error;
  }
}

// Helper function to generate cache keys
export function generateCacheKey(
  url: string,
  params?: Record<string, any>
): string {
  const baseKey = url;
  if (!params) return baseKey;

  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join("|");

  return `${baseKey}?${sortedParams}`;
}
