"use client";

import { useState } from "react";
import { uploadAvatar } from "./actions";

export function AvatarForm() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setMessage(null);
        const formData = new FormData(e.currentTarget);
        const result = await uploadAvatar(formData);
        setPending(false);
        if ("error" in result && result.error) {
          setMessage(result.error);
          return;
        }
        setMessage("Avatar updated.");
        e.currentTarget.reset();
      }}
    >
      <label className="text-xs font-bold uppercase tracking-wider text-outline">
        <span className="sr-only">Avatar image</span>
        <input
          name="avatar"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="max-w-[220px] cursor-pointer text-sm text-on-surface-variant file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-surface-container-high file:px-3 file:py-2 file:text-sm file:font-medium file:text-on-surface"
          disabled={pending}
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-primary px-4 py-2 text-sm font-bold text-on-primary disabled:opacity-50"
      >
        {pending ? "Uploading…" : "Upload avatar"}
      </button>
      {message ? (
        <span
          className={`text-sm ${message.includes("updated") ? "text-secondary" : "text-error"}`}
        >
          {message}
        </span>
      ) : null}
    </form>
  );
}
