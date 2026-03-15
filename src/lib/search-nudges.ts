interface SearchEvent {
  term: string;
  timestamp: number;
}

const searchHistory: SearchEvent[] = [];

const RAPID_FIRE_WINDOW = 40_000; // 40 seconds
const RAPID_FIRE_THRESHOLD = 12;
const REPEAT_WINDOW = 60_000; // 60 seconds
const REPEAT_THRESHOLD = 10;

const nudgeMessages = {
  rapidFire: [
    'The right to search is not unlimited. Perhaps try reading the results?',
    'Section 7 guarantees freedom of expression. It does not guarantee unlimited API calls.',
  ],
  repeat: (n: number, term: string) =>
    `"${term}" has been searched ${n} times in the last minute. The Constitution hasn\u2019t changed.`,
};

function pruneHistory() {
  const cutoff = Date.now() - REPEAT_WINDOW;
  while (searchHistory.length > 0 && searchHistory[0].timestamp < cutoff) {
    searchHistory.shift();
  }
}

export function checkForSpam(term: string): string | null {
  const now = Date.now();
  const normalised = term.trim().toLowerCase();

  // Record event
  searchHistory.push({ term: normalised, timestamp: now });
  pruneHistory();

  // Check same-term repeat
  const repeatCount = searchHistory.filter(
    (e) => e.term === normalised && now - e.timestamp < REPEAT_WINDOW
  ).length;
  if (repeatCount >= REPEAT_THRESHOLD) {
    return nudgeMessages.repeat(repeatCount, term.trim());
  }

  // Check rapid-fire (any terms)
  const recentCount = searchHistory.filter(
    (e) => now - e.timestamp < RAPID_FIRE_WINDOW
  ).length;
  if (recentCount >= RAPID_FIRE_THRESHOLD) {
    return nudgeMessages.rapidFire[Math.floor(Math.random() * nudgeMessages.rapidFire.length)];
  }

  return null;
}
