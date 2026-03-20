"use client";

import { useState } from "react";

type LazyGoogleMapEmbedProps = {
  src: string;
  title: string;
  /** Tailwind height classes for the iframe (e.g. h-[300px] md:h-[380px]) */
  iframeClassName: string;
  /** Minimum height for the placeholder panel */
  minHeight?: number;
  className?: string;
};

/**
 * Defers loading Google Maps embed JS until the user opts in, cutting main-thread
 * and network cost on initial page load (Lighthouse / Core Web Vitals).
 */
export default function LazyGoogleMapEmbed({
  src,
  title,
  iframeClassName,
  minHeight = 280,
  className = "",
}: LazyGoogleMapEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className={className}>
        <iframe
          title={title}
          src={src}
          className={iframeClassName}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center ${className}`}
      style={{ minHeight }}
    >
      <p className="max-w-md text-sm text-slate-600">
        Interactive map loads Google&apos;s embed (~large download). Use{" "}
        <strong className="text-slate-800">Open in Google Maps</strong> for directions without
        loading the embed.
      </p>
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        Load interactive map
      </button>
    </div>
  );
}
