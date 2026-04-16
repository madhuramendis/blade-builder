import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import AppRoot from "@/app/components/AppRoot";

export const metadata: Metadata = {
  title: "WSO2 Blade Builder — PMM Edition",
  description: "Compose and preview WSO2 platform pages using predefined blade layouts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AppRoot>{children}</AppRoot>
      </body>
    </html>
  );
}
