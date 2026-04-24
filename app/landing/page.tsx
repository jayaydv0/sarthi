import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "ArchitectOS — Project Management & Code Backup",
  description:
    "Your personal cloud for code. Auto-sync local projects and access them anywhere.",
};

export default function LandingRoutePage() {
  return <LandingPage />;
}
     