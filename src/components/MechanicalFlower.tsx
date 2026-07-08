"use client";

import dynamic from "next/dynamic";

const FlowerScene = dynamic(
  () => import("./FlowerScene").then((mod) => mod.FlowerScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full border-2 border-blush border-t-transparent" />
      </div>
    ),
  }
);

export function MechanicalFlower({ className = "h-72 w-60 sm:h-80 sm:w-64" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      <FlowerScene />
    </div>
  );
}
