"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import { BookshelfProvider } from "@/context/BookshelfContext";
import { AuthGate } from "@/components/scrapbook/AuthGate";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <BookshelfProvider>
          <AuthGate>{children}</AuthGate>
        </BookshelfProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
