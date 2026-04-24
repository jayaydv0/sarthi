"use client";

import useSWR from "swr";
import { getProjects } from "@/actions/projects";

// Fetcher wrapper since Server Actions return Promises
const fetcher = async () => {
  const data = await getProjects();
  return data;
};

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR("projects-list", fetcher, {
    // Poll every 10 seconds to keep data verified and synced time-to-time
    refreshInterval: 10000, 
    revalidateOnFocus: true,
  });

  return {
    projects: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
