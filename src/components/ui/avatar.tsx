export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const sizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "w-4 h-4",
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
  xl: "w-12 h-12",
  "2xl": "w-16 h-16",
};

/**
 * Reusable avatar component. Uses DaisyUI's `avatar` class
 * wrapper for consistent ring/spacing, and a plain `<img>` for
 * user-supplied URLs (avoids configuring `next/image` external domains).
 *
 * Falls back to initials on a colored background when no image is provided.
 */
export function Avatar({ src, name, size = "md", className = "" }: AvatarProps) {
  const initials = (name?.[0] || "?").toUpperCase();
  const sizeClass = sizeClasses[size];

  return (
    <div className={`avatar ${className}`}>
      <div className={`${sizeClass} rounded-full`}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={name || "User"}
            src={src}
            className={`${sizeClass} rounded-full object-cover`}
          />
        ) : (
          <div
            className={`${sizeClass} rounded-full bg-primary flex items-center justify-center text-primary-content font-semibold`}
          >
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}
