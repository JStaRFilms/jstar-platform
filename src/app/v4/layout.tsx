import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "J StaR — Creative Technology Studio | Films · Labs · Intelligence",
  description: "We build things worth watching. Cinematic media, bespoke digital products, and intelligent creative systems by John Oluleke-Oke.",
  openGraph: {
    title: "J StaR — Creative Technology Studio",
    description: "Cinematic media, digital products, and AI-powered experiences.",
  },
};

export default function V4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#001514] text-[#FBFFFE] antialiased selection:bg-[#B5E619] selection:text-[#001514] font-sans">
      {children}
    </div>
  );
}
