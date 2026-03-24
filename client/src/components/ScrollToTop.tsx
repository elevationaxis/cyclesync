import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * ScrollToTop — fires window.scrollTo(0, 0) on every route change.
 * Drop this inside the Router (App.tsx) once, and every navigation
 * will land at the top of the destination page.
 */
export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  return null;
}
