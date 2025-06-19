export function getCoinGeckoApiKey(): string | undefined {
  // Try to access import.meta.env only if available (browser/Vite)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_COINGECKO_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_COINGECKO_API_KEY;
    }
  } catch (e) {
    // Ignore if not available
  }
  // Fallback for Node/Jest
  if (typeof process !== 'undefined' && process.env && process.env.VITE_COINGECKO_API_KEY) {
    return process.env.VITE_COINGECKO_API_KEY;
  }
  return undefined;
} 