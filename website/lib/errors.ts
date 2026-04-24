export type AppErrorCode =
  | "validation"
  | "save"
  | "auth"
  | "delete"
  | "not_found";

const errorMessages: Record<AppErrorCode, string> = {
  validation: "Please correct the highlighted fields before continuing.",
  save: "We couldn't save your project. Please try again in a moment.",
  auth: "You need to sign in again to continue.",
  delete: "Could not delete the project. Please try again later.",
  not_found: "The requested resource could not be found.",
};

export function getErrorMessage(
  code: string | string[] | undefined,
  fallback?: string,
): string | null {
  if (!code) return null;
  const key = Array.isArray(code) ? code[0] : code;
  return errorMessages[key as AppErrorCode] ?? fallback ?? "Something went wrong. Please try again.";
}

export function buildErrorRedirect(
  path: string,
  code: AppErrorCode,
  message?: string,
) {
  const params = new URLSearchParams({ error: code });
  if (message) params.set("message", message);
  return `${path}?${params.toString()}`;
}
