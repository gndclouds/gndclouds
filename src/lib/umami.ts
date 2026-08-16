/**
 * Umami analytics event tracking.
 * Only sends in production when the Umami script is loaded.
 * @see https://umami.is/docs/track-events
 */

declare global {
  interface Window {
    umami?: {
      track: (
        eventName: string,
        eventData?: Record<string, string | number | boolean>
      ) => void;
    };
  }
}

const isClient = typeof window !== "undefined";

export function track(
  eventName: string,
  eventData?: Record<string, string | number | boolean>
): void {
  if (!isClient || !window.umami) return;
  try {
    if (eventData) {
      window.umami.track(eventName, eventData);
    } else {
      window.umami.track(eventName);
    }
  } catch {
    // no-op if tracking fails
  }
}
