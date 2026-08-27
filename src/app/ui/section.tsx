import type { ReactNode } from "react";

/**
 * One documented component in the gallery.
 *
 * Title and description sit outside the demo surface so the page reads like a
 * catalogue rather than a wall of boxes.
 */
export function GallerySection({
  id,
  title,
  description,
  children,
  usage,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
  usage?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-base-300 pt-10">
      <div className="mb-6 max-w-[62ch]">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-1.5 text-sm text-base-content/70">{description}</p>
      </div>

      <div className="rounded-box border border-base-300 bg-base-200/50 p-6">
        {children}
      </div>

      {usage && (
        <pre className="mt-3 overflow-x-auto rounded-box border border-base-300 bg-base-200 p-4 font-mono text-xs text-base-content/80">
          {usage}
        </pre>
      )}
    </section>
  );
}

/** A labelled row of variants inside a section. */
export function Row({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
      {label && (
        <span className="text-xs tracking-wide text-base-content/50 uppercase">
          {label}
        </span>
      )}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
