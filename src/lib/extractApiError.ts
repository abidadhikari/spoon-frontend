/**
 * Extracts a human-readable error message from FastAPI backend errors.
 *
 * FastAPI error shapes:
 * - HTTP errors:      { detail: "string message" }
 * - Validation (422): { detail: [{ loc, msg, type }] }
 *
 * Falls back to the provided `fallback` string if no BE message found.
 */
export function extractApiError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!error) return fallback;

  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;

    // Handle AxiosError (thrown when throwOnError: true) or hey-api wrapper
    let apiData = err;
    if (err.response && typeof err.response === "object") {
      const response = err.response as Record<string, unknown>;
      if (response.data && typeof response.data === "object") {
        apiData = response.data as Record<string, unknown>;
      }
    } else if (err.error && typeof err.error === "object") {
      apiData = err.error as Record<string, unknown>;
    }

    // ── Case 1: HTTP error  →  { detail: "plain string" } ──────────────────
    if (typeof apiData.detail === "string" && apiData.detail.trim()) {
      return apiData.detail.trim();
    }

    // ── Case 2: Validation error (422)  →  { detail: [{loc, msg, type}] } ──
    if (Array.isArray(apiData.detail) && apiData.detail.length > 0) {
      const messages = (apiData.detail as Array<{ msg?: string; message?: string }>)
        .map((v) => v.msg ?? v.message ?? "")
        .filter(Boolean);
      if (messages.length > 0) return messages.join(" · ");
    }

    // ── Case 3: Top-level message (axios / fetch wrappers) ──────────────────
    if (typeof err.message === "string" && err.message.trim()) {
      const msg = err.message.trim();
      // Don't surface raw network noise or default Axios status messages
      if (
        msg.toLowerCase().includes("network") ||
        msg.toLowerCase().includes("status code")
      ) {
        return fallback; // Use fallback instead of showing generic "Request failed with status code 400"
      }
      return msg;
    }
  }

  return fallback;
}

