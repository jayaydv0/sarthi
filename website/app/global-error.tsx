"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950 p-6 text-center text-zinc-100 font-sans">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="mb-2 text-2xl font-semibold">A critical error occurred</h2>
        <p className="mb-8 max-w-md text-zinc-400">
          The application crashed. We apologize for the inconvenience.
          <br/>
          <span className="text-sm opacity-50">{error.message}</span>
        </p>
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
        >
          <RefreshCcw size={18} />
          Reload Application
        </button>
      </body>
    </html>
  );
}
