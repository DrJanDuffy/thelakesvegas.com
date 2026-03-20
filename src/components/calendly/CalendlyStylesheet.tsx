"use client";

import { useEffect } from "react";

const CALENDLY_WIDGET_CSS =
  "https://assets.calendly.com/assets/external/widget.css";

/**
 * Loads Calendly widget CSS after mount so it does not block first paint.
 */
export default function CalendlyStylesheet() {
  useEffect(() => {
    const existing = document.querySelector(
      `link[href="${CALENDLY_WIDGET_CSS}"]`,
    );
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CALENDLY_WIDGET_CSS;
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, []);

  return null;
}
