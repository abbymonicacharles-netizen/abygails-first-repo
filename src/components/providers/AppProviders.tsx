"use client";

import { AuthProvider } from "@/context/AuthContext";
import { BookshelfProvider } from "@/context/BookshelfContext";
import { AuthGate } from "@/components/scrapbook/AuthGate";
import { StudyMusic } from "@/components/scrapbook/StudyMusic";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BookshelfProvider>
        <StudyMusic />
        <AuthGate>{children}</AuthGate>
      </BookshelfProvider>
    </AuthProvider>
  );
}
