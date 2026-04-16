"use client";
import dynamic from "next/dynamic";

const OxygenProvider = dynamic(() => import("@/app/components/OxygenProvider"), {
  ssr: false,
  loading: () => <div style={{ position: "fixed", inset: 0, background: "#1a1f36" }} />,
});

export default function AppRoot({ children }: { children: React.ReactNode }) {
  return <OxygenProvider>{children}</OxygenProvider>;
}
