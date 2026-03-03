import { ThemeProvider } from "next-themes";

import { BaseHubThemeProvider } from "@/context/basehub-theme-provider";
import { TooltipProvider } from "@/common/tooltip";
import { Healumin8AccentOverride } from "./healumin8-accent-override";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem attribute="class" defaultTheme="system">
      <BaseHubThemeProvider />
      <Healumin8AccentOverride />
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
