/**
 * Custom order for startups display
 * This array defines the priority order in which startups should appear
 * Includes variations to support flexible matching
 */
export const STARTUP_DISPLAY_ORDER = [
  'MPC',
  'Everaw',
  'Studojo',
  'VetQure AI',
  'FYN',
  'Future Farming',
  'Thrift Store',
  'Sakhi',
  'Miomi',
  'Nazaraa',
  'Playroot',
  'Spriggle',
  'Seen AI',
  'Whisper Wave',
];

/**
 * Normalizes a string for flexible matching
 * - Converts to lowercase
 * - Removes extra whitespace
 * - Removes special characters and common words
 */
const normalizeForMatching = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' '); // Normalize whitespace
};

/**
 * Checks if a startup name matches an order name flexibly
 * Uses case-insensitive matching and handles variations
 */
const isMatch = (startupName: string, orderName: string): boolean => {
  const normalizedStartup = normalizeForMatching(startupName);
  const normalizedOrder = normalizeForMatching(orderName);

  // Exact match after normalization
  if (normalizedStartup === normalizedOrder) {
    return true;
  }

  // Check if one contains the other (for partial matches)
  if (
    normalizedStartup.includes(normalizedOrder) ||
    normalizedOrder.includes(normalizedStartup)
  ) {
    return true;
  }

  // Check for word-by-word matches (for acronyms or different orderings)
  const startupWords = normalizedStartup.split(' ').filter(Boolean);
  const orderWords = normalizedOrder.split(' ').filter(Boolean);

  // If order is an acronym, check if it matches initials
  if (orderWords.length === 1 && orderWords[0].length <= 5) {
    const initials = startupWords.map((word) => word[0]).join('');
    if (initials === orderWords[0]) {
      return true;
    }
  }

  return false;
};

/**
 * Finds the order index for a startup based on its name
 * Returns -1 if not found in custom order
 */
const findOrderIndex = (startupName: string, customOrder: string[]): number => {
  for (let i = 0; i < customOrder.length; i++) {
    if (isMatch(startupName, customOrder[i])) {
      return i;
    }
  }
  return -1;
};

/**
 * Reorders an array of startups based on a custom order
 * Startups not in the custom order are placed at the end
 */
export const reorderStartups = <T extends { name: string }>(
  startups: T[],
  customOrder: string[] = STARTUP_DISPLAY_ORDER
): T[] => {
  // Create a map of startup to its order index
  const startupOrderMap = new Map<T, number>();

  startups.forEach((startup) => {
    const orderIndex = findOrderIndex(startup.name, customOrder);
    // console.log(`[Ordering] "${startup.name}" -> index: ${orderIndex}`);
    startupOrderMap.set(startup, orderIndex === -1 ? Number.MAX_SAFE_INTEGER : orderIndex);
  });

  // Sort startups based on their order index
  const sorted = [...startups].sort((a, b) => {
    const orderA = startupOrderMap.get(a) ?? Number.MAX_SAFE_INTEGER;
    const orderB = startupOrderMap.get(b) ?? Number.MAX_SAFE_INTEGER;

    return orderA - orderB;
  });

  // console.log('[Ordering] Final order:', sorted.map(s => s.name));
  return sorted;
};
