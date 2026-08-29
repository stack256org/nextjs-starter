import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/auth/config";

/**
 * Generates `/robots.txt` using the Next.js metadata API.
 *
 * Allows all crawlers on public pages; disallows the authenticated areas
 * (dashboard, orbit, API) and the component demo page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/orbit/", "/api/", "/ui/"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
