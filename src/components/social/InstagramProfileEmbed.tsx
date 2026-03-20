"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

type InstagramProfileEmbedProps = {
  /** Full permalink URL (Instagram recommends utm_source=ig_embed for profiles) */
  permalink: string;
  className?: string;
};

/**
 * Official Instagram embed: loads embed.js once and hydrates the blockquote.
 * @see https://developers.facebook.com/docs/instagram/oembed
 */
export default function InstagramProfileEmbed({
  permalink,
  className = "",
}: InstagramProfileEmbedProps) {
  useEffect(() => {
    window.instgrm?.Embeds?.process();
  }, [permalink]);

  return (
    <div className={className}>
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
