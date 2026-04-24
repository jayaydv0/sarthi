"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Caught in error boundary:", error);
    toast.error("An unexpected error occurred.", {
      description: error.message || "Please try again.",
    });
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-surface p-6 text-center text-on-surface">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error mb-6">
        <AlertCircle size={32} />
      </div>
      <h2 className="mb-2 text-2xl font-semibold">Something went wrong</h2>
      <p className="mb-8 max-w-md text-on-surface-variant">
        We encountered an unexpected problem. Our team has been notified.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-on-primary transition-transform hover:scale-105 active:scale-95"
      >
        <RefreshCcw size={18} />
        Try again
      </button>
    </div>
  );
}
