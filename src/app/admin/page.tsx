import type { Metadata } from "next";
import AdminDashboard from "@/features/AdminDashboard/AdminDashboard";

export const metadata: Metadata = {
  title: "J StaR Admin Dashboard",
  description: "Administrative dashboard for J StaR Films platform management.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
