import { z } from "zod";

const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }
  return value;
}, z.string().max(2000).nullable());

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less"),
  local_path: z
    .string()
    .trim()
    .min(1, "Local path is required")
    .max(500, "Local path must be 500 characters or less"),
  description: optionalTrimmedString,
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less"),
  local_path: z
    .string()
    .trim()
    .min(1, "Local path is required")
    .max(500, "Local path must be 500 characters or less"),
  live_url: z.preprocess((value) => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed === "" ? null : trimmed;
    }
    return value;
  }, z.string().url("Live URL must be a valid URL").nullable()),
  env_secrets: z.preprocess((value) => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed === "" ? null : trimmed;
    }
    return value;
  }, z.string().max(4000, "Environment secrets exceed the maximum length").nullable()),
  notes: optionalTrimmedString,
});

export const deleteProjectSchema = z.object({
  projectId: z.string().uuid("Project ID is invalid"),
});
