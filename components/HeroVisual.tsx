"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

/** Initials badge: shown while the 3D scene loads and wherever WebGL isn't available. */
function Initials({ initials }: { initials: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-4xl font-bold text-white shadow-2xl shadow-indigo-500/40 sm:h-44 sm:w-44">
        {initials}
      </div>
    </div>
  );
}

// three.js needs the browser, so the scene is loaded client-side only and kept out of the main bundle.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribe(onChange: () => void) {
  const mq = window.matchMedia(reducedMotionQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export default function HeroVisual({ initials }: { initials: string }) {
  const reducedMotion = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );

  return (
    <div className="relative h-72 w-full cursor-pointer sm:h-80 md:h-96 md:w-96" title="Click me!">
      <div
        aria-hidden
        className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-pink-500/20 blur-3xl"
      />
      <HeroScene reducedMotion={reducedMotion} fallback={<Initials initials={initials} />} />
    </div>
  );
}
