import { SearchResult } from '../types';

// nominatim has rate limits but it's free so 🤷
export const searchLocation = async (
  query: string
): Promise<SearchResult[]> => {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // fail silently, not a big deal
    return [];
  }
};
