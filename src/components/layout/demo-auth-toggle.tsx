"use client";

import { UserCheck, UserX } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

/**
 * Dev-only helper to preview both nav states (logged-in / logged-out)
 * without editing code. Remove this component once real auth is wired.
 */
export function DemoAuthToggle() {
  const { isLoggedIn, toggleAuth } = useAuth();
  return (
    <button
      onClick={toggleAuth}
      className="fixed bottom-5 left-5 z-[60] flex items-center gap-2 rounded-full border border-hairline-strong bg-panel/80 px-4 py-2.5 text-xs font-medium text-mist shadow-lg backdrop-blur-xl transition-colors hover:text-cloud"
      title="Preview the other navigation state"
    >
      {isLoggedIn ? (
        <UserCheck className="h-4 w-4 text-violet-bright" />
      ) : (
        <UserX className="h-4 w-4 text-faint" />
      )}
      Demo: {isLoggedIn ? "Logged in" : "Logged out"}
    </button>
  );
}
