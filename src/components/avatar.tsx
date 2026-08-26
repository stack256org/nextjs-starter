/* eslint-disable @next/next/no-img-element */

interface AvatarProps {
  src?: string | null;
  name: string;
  className?: string;
}

/**
 * Reusable avatar component.  Uses a plain `<img>` for
 * user-supplied URLs (avoids the need to configure
 * `next/image` external domains).
 */
export function Avatar({ src, name, className = "w-8 h-8" }: AvatarProps) {
  const initials = (name?.[0] || "?").toUpperCase();

  return src ? (
    <img
      alt={name || "User"}
      src={src}
      className={`${className} rounded-full`}
    />
  ) : (
    <div
      className={`${className} rounded-full bg-primary flex items-center justify-center text-primary-content`}
    >
      {initials}
    </div>
  );
}
