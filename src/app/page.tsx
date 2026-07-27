"use client";

import { useCallback, useState } from "react";
import { LoadingScreen } from "@/components/glitter/LoadingScreen";
import { GlitterApp } from "@/components/glitter/GlitterApp";

export default function HomePage() {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  return (
    <>
      {!ready && <LoadingScreen onDone={onDone} />}
      {ready && <GlitterApp />}
    </>
  );
}
