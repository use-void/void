"use client";

import { Button } from "@repo/ui";
import { ShieldAlert, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isAuthError = error.message === "AUTH_UNAUTHORIZED";

  return (
    <div className="flex h-[calc(100vh-160px)] w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center max-w-[400px] text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 mb-6">
          <ShieldAlert className="h-6 w-6 text-zinc-400" />
        </div>
        
        <h1 className="text-xl font-light text-white mb-2">
          {isAuthError ? "Permission Required" : "Something went wrong"}
        </h1>
        
        <p className="text-sm text-zinc-500 font-light leading-relaxed mb-8">
          {isAuthError 
            ? "Your account doesn't have the necessary roles to access this information. Please contact support if this is an error."
            : "An unexpected error occurred while loading this page. Our team has been notified."}
        </p>

        <Button 
          onClick={() => reset()} 
          variant="outline" 
          size="sm"
          className="border-zinc-800 hover:bg-zinc-900"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}