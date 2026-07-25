"use client";

import { AuthProvider } from "@/context/AuthContext";
import { BookshelfProvider } from "@/context/BookshelfContext";
import { AuthGate } from "@/components/scrapbook/AuthGate";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BookshelfProvider>
        <AuthGate>{children}</AuthGate>
      </BookshelfProvider>
    </AuthProvider>
  );
}
