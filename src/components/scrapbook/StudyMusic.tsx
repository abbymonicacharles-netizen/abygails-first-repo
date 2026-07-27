"use client";

import { useEffect, useRef } from "react";
import { useBookshelf } from "@/context/BookshelfContext";

/**
 * Soft purple-room study pad via Web Audio (no audio files).
 * Gentle overlapping sine tones — quiet enough for background focus.
 */
export function StudyMusic() {
  const { settings } = useBookshelf();
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const masterRef = useRef<GainNode | null>(null);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (!settings.musicOn) {
      fadeOutAndStop();
      return;
    }

    let cancelled = false;

    async function start() {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;

      const ctx = ctxRef.current && ctxRef.current.state !== "closed" ? ctxRef.current : new AC();
      ctxRef.current = ctx;
      if (ctx.state === "suspended") {
        try {
          await ctx.resume();
        } catch {
          return;
        }
      }
      if (cancelled) return;

      hardStop(false);

      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      masterRef.current = master;

      // Quiet A-minor-ish pad: A3, C4, E4, A4
      const freqs = [220, 261.63, 329.63, 440];
      const oscillators: OscillatorNode[] = [];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i % 2 === 0 ? "sine" : "triangle";
        osc.frequency.value = freq;
        gain.gain.value = i === 0 ? 0.04 : 0.025;
        osc.connect(gain);
        gain.connect(master);
        osc.start();
        oscillators.push(osc);
        nodesRef.current.push(osc, gain);
      });

      const now = ctx.currentTime;
      master.gain.linearRampToValueAtTime(0.5, now + 1.4);
      nodesRef.current.push(master);
    }

    void start();

    return () => {
      cancelled = true;
      fadeOutAndStop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.musicOn]);

  function hardStop(close: boolean) {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
    for (const node of nodesRef.current) {
      try {
        if ("stop" in node && typeof (node as OscillatorNode).stop === "function") {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        /* ignore */
      }
    }
    nodesRef.current = [];
    masterRef.current = null;
    if (close && ctxRef.current) {
      void ctxRef.current.close().catch(() => undefined);
      ctxRef.current = null;
    }
  }

  function fadeOutAndStop() {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (master && ctx && ctx.state !== "closed") {
      try {
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(master.gain.value, now);
        master.gain.linearRampToValueAtTime(0, now + 0.3);
      } catch {
        /* ignore */
      }
      const t = window.setTimeout(() => hardStop(true), 350);
      timersRef.current.push(t);
      return;
    }
    hardStop(true);
  }

  return null;
}
