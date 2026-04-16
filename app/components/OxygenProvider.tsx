"use client";
import { OxygenUIThemeProvider } from "@wso2/oxygen-ui";

export default function OxygenProvider({ children }: { children: React.ReactNode }) {
  return <OxygenUIThemeProvider>{children}</OxygenUIThemeProvider>;
}
