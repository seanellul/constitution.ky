import { create } from 'zustand';

/**
 * Simple active users store.
 * Shows a static "online" indicator since PostHog handles real analytics.
 */
interface ActiveUsersState {
  count: number;
  lastFetched: number;
  isFetching: boolean;
  fetch: () => Promise<number>;
}

export const useActiveUsersStore = create<ActiveUsersState>((set, get) => ({
  count: 1,
  lastFetched: 0,
  isFetching: false,
  fetch: async () => {
    // Return a simple count — PostHog tracks real active users
    set({ count: 1, lastFetched: Date.now() });
    return 1;
  },
}));

export function initActiveUsersTracking() {
  // No-op: PostHog handles active user tracking natively
}
