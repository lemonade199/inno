// Search history & popular search tracking helper using localStorage

const SEARCH_HISTORY_KEY = 'berkah_search_history';
const SEARCH_COUNTS_KEY = 'berkah_search_counts';

export const getSearchHistory = () => {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const addSearchHistory = (query) => {
  if (!query || !query.trim()) return;
  const q = query.trim();

  try {
    // 1. Update Recent Search History List (max 8 items)
    let history = getSearchHistory();
    history = [q, ...history.filter(item => item.toLowerCase() !== q.toLowerCase())].slice(0, 8);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));

    // 2. Increment Search Frequency for Popular Searches calculation
    const countsRaw = localStorage.getItem(SEARCH_COUNTS_KEY);
    const counts = countsRaw ? JSON.parse(countsRaw) : {};
    const key = q.toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
    localStorage.setItem(SEARCH_COUNTS_KEY, JSON.stringify(counts));
  } catch (e) {
    console.error('Error updating search history:', e);
  }
};

export const removeSearchHistoryItem = (query) => {
  try {
    let history = getSearchHistory();
    history = history.filter(item => item.toLowerCase() !== query.toLowerCase());
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch (e) {
    return [];
  }
};

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (e) {
    console.error(e);
  }
};

export const getPopularSearches = () => {
  try {
    const countsRaw = localStorage.getItem(SEARCH_COUNTS_KEY);
    const counts = countsRaw ? JSON.parse(countsRaw) : {};

    // Sort terms by highest search frequency count
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([term]) => term);

    // Default real product fallback terms from Toko Berkah Pancing (NO fake/dummy terms)
    const fallbackRealTerms = [
      'Pakan Ayam 511',
      'Pelet Apung',
      'Umpan Jitu',
      'Essen Udang',
      'Phoenix Pakan Burung',
      'Koja Jaring'
    ];

    // Combine recorded user search counts + fallback real product terms uniquely
    const combined = Array.from(new Set([...sorted, ...fallbackRealTerms]));
    return combined.slice(0, 6);
  } catch (e) {
    return ['Pakan Ayam 511', 'Pelet Apung', 'Umpan Jitu', 'Essen Udang'];
  }
};
