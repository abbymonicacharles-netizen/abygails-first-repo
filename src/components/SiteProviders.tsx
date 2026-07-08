"use client";

import { SettingsProvider } from "@/context/SettingsContext";
import { SettingsBar } from "@/components/SettingsBar";

export function SiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      {children}
      <SettingsBar />
    </SettingsProvider>
  );
}
