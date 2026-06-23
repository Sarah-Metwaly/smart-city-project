/**
 * Token Manager
 *
 * Stores the access token in memory (module-level variable).
 * When PERSIST_LOGIN is true, also mirrors it to localStorage so it
 * survives page refreshes.  Switching strategies is a one-line change.
 */

const PERSIST_LOGIN = true; // ← flip to false for memory-only mode
const LS_KEY = "app_access_token";

// In-memory store — never exposed to the DOM directly
let _accessToken: string | null = null;

// ─── Bootstrap ───────────────────────────────────────────────────────────────
// Restore token from localStorage on module load (only when persistence is on)
if (PERSIST_LOGIN) {
  const stored = localStorage.getItem(LS_KEY);
  if (stored) _accessToken = stored;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const tokenManager = {
  getAccessToken(): string | null {
    return _accessToken;
  },

  setAccessToken(token: string): void {
    _accessToken = token;
    if (PERSIST_LOGIN) {
      localStorage.setItem(LS_KEY, token);
    }
  },

  clearAccessToken(): void {
    _accessToken = null;
    if (PERSIST_LOGIN) {
      localStorage.removeItem(LS_KEY);
    }
  },

  hasToken(): boolean {
    return _accessToken !== null && _accessToken.length > 0;
  },
};
