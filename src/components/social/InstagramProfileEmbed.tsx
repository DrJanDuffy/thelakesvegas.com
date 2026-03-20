"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

type InstagramProfileEmbedProps = {
  /** Full permalink URL (Instagram recommends utm_source=ig_embed for profiles) */
  permalink: string;
  className?: string;
  /** If true, load embed.js and iframe only after user interaction (fewer third-party cookies on load). */
  embedClickToLoad?: boolean;
};

/**
 * Official Instagram embed: loads embed.js once and hydrates the blockquote.
 * @see https://developers.facebook.com/docs/instagram/oembed
 */
export default function InstagramProfileEmbed({
  permalink,
  className = "",
  embedClickToLoad = false,
}: InstagramProfileEmbedProps) {
  const [loaded, setLoaded] = useState(!embedClickToLoad);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaded) return;
    window.instgrm?.Embeds?.process();
  }, [permalink, loaded]);

  /** Instagram injects the iframe without a title; set it for screen readers. */
  useEffect(() => {
    if (!loaded || !containerRef.current) return;
    const root = containerRef.current;
    const iframeTitle = "The Lakes Las Vegas on Instagram";
    const patch = () => {
      root.querySelectorAll('iframe.instagram-media, iframe[id^="instagram-embed"]').forEach(
        (node) => {
          if (node instanceof HTMLIFrameElement && !node.title.trim()) {
            node.title = iframeTitle;
          }
        },
      );
    };
    patch();
    const observer = new MutationObserver(patch);
    observer.observe(root, { childList: true, subtree: true });
    const intervalId = window.setInterval(patch, 400);
    const clearIntervalTimer = window.setTimeout(() => window.clearInterval(intervalId), 20_000);
    return () => {
      observer.disconnect();
      window.clearInterval(intervalId);
      window.clearTimeout(clearIntervalTimer);
    };
  }, [loaded]);

  if (!loaded) {
    return (
      <div
        className={`mx-auto max-w-[540px] rounded-lg border border-slate-200 bg-slate-50 p-8 text-center shadow-sm ${className}`}
      >
        <p className="mb-4 text-sm text-slate-600">
          Load the Instagram widget to see @thelakesinlasvegas here. Third-party cookies may apply
          after you load it.
        </p>
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="rounded-md bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
        >
          Load Instagram feed
        </button>
        <p className="mt-4 text-xs text-slate-500">
          Or{" "}
          <a
            href={permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 underline hover:text-blue-700"
          >
            open the profile on Instagram
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <blockquote
        className="instagram-media m-px mx-auto max-w-[540px] min-w-[326px] w-[calc(100%-2px)] rounded-sm border-0 bg-white p-0 shadow-[0_0_1px_0_rgba(0,0,0,0.5),0_1px_10px_0_rgba(0,0,0,0.15)]"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
      >
        <a
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="sr-only"
        >
          View @thelakesinlasvegas on Instagram
        </a>
      </blockquote>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          window.instgrm?.Embeds?.process();
        }}
      />
    </div>
  );
}
