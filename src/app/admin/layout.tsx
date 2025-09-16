import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "J StaR Admin - System Management",
  description: "Administrative dashboard for J StaR Films platform management and diagnostics.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
