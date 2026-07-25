"use client";

import Link from "next/link";
import { grownPets, type AquariumPet } from "@/data/sea";
import { useBookshelf } from "@/context/BookshelfContext";

function FishArt({ pet, className }: { pet: AquariumPet; className?: string }) {
  const { body, fin, accent } = pet.colors;
  if (pet.kind === "school") {
    return (
      <g className={className}>
        {[0, 14, 28].map((dx) => (
          <g key={dx} transform={`translate(${dx}, ${dx * 0.2})`}>
            <ellipse cx="8" cy="6" rx="8" ry="4" fill={body} />
            <polygon points="0,6 -4,2 -4,10" fill={fin} />
            <circle cx="12" cy="5" r="1" fill="#333" />
          </g>
        ))}
      </g>
    );
  }
  if (pet.kind === "octopus") {
    return (
      <g className={className}>
        <ellipse cx="16" cy="12" rx="12" ry="10" fill={body} />
        <path d="M6 18 Q4 28 8 30 M12 20 Q10 30 14 32 M20 20 Q22 30 18 32 M26 18 Q28 28 24 30" stroke={fin} strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="12" cy="10" r="1.5" fill="#333" />
        <circle cx="20" cy="10" r="1.5" fill="#333" />
      </g>
    );
  }
  if (pet.kind === "angelfish") {
    return (
      <g className={className}>
        <ellipse cx="14" cy="16" rx="8" ry="14" fill={body} />
        <rect x="10" y="4" width="3" height="24" fill={fin} opacity="0.5" />
        <rect x="15" y="6" width="2" height="20" fill={accent} opacity="0.6" />
        <polygon points="22,16 30,8 30,24" fill={fin} />
        <circle cx="10" cy="14" r="1.2" fill="#333" />
      </g>
    );
  }
  if (pet.kind === "discus") {
    return (
      <g className={className}>
        <circle cx="14" cy="14" r="12" fill={body} />
        <path d="M6 8 Q14 14 6 20" stroke={fin} strokeWidth="2" fill="none" />
        <path d="M10 6 Q14 14 10 22" stroke={accent} strokeWidth="1.5" fill="none" />
        <polygon points="24,14 32,8 32,20" fill={fin} />
        <circle cx="9" cy="12" r="1.2" fill="#333" />
      </g>
    );
  }
  // goldfish / shark / turtle / jellyfish fallback shape
  return (
    <g className={className}>
      <ellipse cx="16" cy="12" rx="12" ry="7" fill={body} />
      <polygon points="4,12 -2,6 -2,18" fill={fin} />
      <ellipse cx="20" cy="6" rx="5" ry="3" fill={fin} opacity="0.9" />
      <ellipse cx="20" cy="18" rx="5" ry="3" fill={fin} opacity="0.9" />
      <circle cx="22" cy="10" r="1.3" fill="#333" />
      <circle cx="22.5" cy="9.7" r="0.4" fill={accent} />
    </g>
  );
}

export function FishBowl({
  compact = false,
  draggable,
  onDragStart,
}: {
  compact?: boolean;
  draggable?: boolean;
  onDragStart?: () => void;
}) {
  const { settings } = useBookshelf();
  const pets = grownPets(settings.seaCollection);
  const swimmers = pets.slice(0, 6);

  const bowl = (
    <div
      className={`aquarium ${compact ? "aquarium-compact" : ""}`}
      aria-label="Aquarium collection"
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <div className="aquarium-glass">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/aquarium-bowl.svg" alt="" className="aquarium-bg" draggable={false} />
        <svg className="aquarium-fish-layer" viewBox="0 0 200 200" aria-hidden>
          {swimmers.length === 0 ? null : (
            swimmers.map((pet, i) => (
              <g key={pet.id} className={`aquarium-swimmer swim-${(i % 4) + 1}`}>
                <FishArt pet={pet} />
              </g>
            ))
          )}
        </svg>
        {swimmers.length === 0 && (
          <p className="aquarium-empty">Grow pets in Progress to fill the bowl</p>
        )}
      </div>
      <p className="aquarium-label">Aquarium</p>
    </div>
  );

  if (compact) {
    return (
      <Link href="/collection" className="inline-flex flex-col items-center" draggable={false}>
        {bowl}
      </Link>
    );
  }

  return bowl;
}

/** Shelf version: click opens collection; can be dragged when handlers provided. */
export function ShelfAquarium({
  onDragStart,
}: {
  onDragStart?: () => void;
}) {
  const { settings } = useBookshelf();
  const pets = grownPets(settings.seaCollection);
  const swimmers = pets.slice(0, 5);

  return (
    <Link
      href="/collection"
      className="shelf-aquarium"
      draggable={Boolean(onDragStart)}
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart?.();
      }}
    >
      <div className="aquarium aquarium-compact">
        <div className="aquarium-glass">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/aquarium-bowl.svg" alt="" className="aquarium-bg" draggable={false} />
          <svg className="aquarium-fish-layer" viewBox="0 0 200 200" aria-hidden>
            {swimmers.map((pet, i) => (
              <g key={pet.id} className={`aquarium-swimmer swim-${(i % 4) + 1}`}>
                <FishArt pet={pet} />
              </g>
            ))}
          </svg>
        </div>
        <p className="aquarium-label">Aquarium</p>
      </div>
    </Link>
  );
}
