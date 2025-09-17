import type { Metadata } from "next";
import HeroSlidesManagement from "@/features/HeroSlidesManagement/HeroSlidesManagement";

export const metadata: Metadata = {
  title: "Hero Slides Management - J StaR Admin",
  description: "Manage homepage hero slides for J StaR Films platform.",
};

export default function HeroSlidesPage() {
  return <HeroSlidesManagement />;
}
