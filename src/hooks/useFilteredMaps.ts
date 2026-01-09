import { useMemo } from 'react';
import maps from '../maps.json';

const sortedMaps = [...maps].sort((a, b) => a.name.localeCompare(b.name));

function fuzzyMatch(text: string, query: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  let queryIndex = 0;
  for (const char of lowerText) {
    if (char === lowerQuery[queryIndex]) {
      queryIndex++;
      if (queryIndex === lowerQuery.length) return true;
    }
  }
  return queryIndex === lowerQuery.length;
}

export function useFilteredMaps(search: string) {
  return useMemo(() => {
    if (!search.trim()) return sortedMaps;
    return sortedMaps.filter((map) => fuzzyMatch(map.name, search));
  }, [search]);
}
