/**
 * Resolves after `ms` milliseconds. Used to simulate network latency for the
 * mock services until a real backend is wired up.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
