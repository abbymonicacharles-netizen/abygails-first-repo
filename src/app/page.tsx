"use client";

import { useCallback, useState } from "react";
import { LoadingScreen } from "@/components/glitter/LoadingScreen";
import { GlitterApp } from "@/components/glitter/GlitterApp";

export default function HomePage() {
  const [booted, setBooted] = useState(false);
  const onDone = useCallback(() => setBooted(true), []);

  return (
    <>
      {!booted && <LoadingScreen onDone={onDone} />}
      {booted && <GlitterApp />}
    </>
  );
}
