/**
 * Turns a raw User-Agent string into something recognisable in a session list.
 *
 * Deliberately coarse — the goal is "is this the laptop I'm on, or something I
 * don't recognise?", not analytics-grade device detection.
 */
export function describeUserAgent(userAgent: string | null | undefined): string {
  if (!userAgent) return "Unknown device";

  const browser = /Edg\//.test(userAgent)
    ? "Edge"
    : /OPR\/|Opera/.test(userAgent)
      ? "Opera"
      : /Firefox\//.test(userAgent)
        ? "Firefox"
        : /Chrome\//.test(userAgent)
          ? "Chrome"
          : /Safari\//.test(userAgent)
            ? "Safari"
            : /curl\//i.test(userAgent)
              ? "curl"
              : /node|axios|python/i.test(userAgent)
                ? "Script"
                : "Unknown browser";

  const os = /Windows/.test(userAgent)
    ? "Windows"
    : /Mac OS X|Macintosh/.test(userAgent)
      ? "macOS"
      : /Android/.test(userAgent)
        ? "Android"
        : /iPhone|iPad|iPod/.test(userAgent)
          ? "iOS"
          : /Linux/.test(userAgent)
            ? "Linux"
            : null;

  return os ? `${browser} on ${os}` : browser;
}

/**
 * Renders an IP address for display.
 *
 * Node reports loopback as the fully-expanded IPv6 form
 * `0000:0000:0000:0000:0000:0000:0000:0000`, which is 39 characters of noise
 * in a session list. Collapse the local addresses to a readable label and
 * leave real addresses untouched.
 */
export function formatIpAddress(ip: string | null | undefined): string {
  if (!ip) return "Unknown IP";

  const normalised = ip.replace(/^::ffff:/i, "");
  const isLoopback =
    normalised === "::1" ||
    normalised === "127.0.0.1" ||
    /^0{1,4}(:0{1,4}){7}$/.test(normalised) ||
    normalised === "::";

  return isLoopback ? "This machine" : normalised;
}

export function formatDateTime(value: string | Date): string {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
}
