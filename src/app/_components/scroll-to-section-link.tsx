"use client";

import { usePathname } from "next/navigation";
import { sendEvent } from "basehub/events";
import { $button } from "@/common/button";
import type { GeneralEvents } from "@/../basehub-types";

export function ScrollToSectionLink({
  href,
  children,
  intent = "secondary",
  className,
  analyticsKey,
  name = "secondary_cta_click",
  ...props
}: {
  href: string;
  children: React.ReactNode;
  intent?: "primary" | "secondary" | "tertiary";
  className?: string;
  analyticsKey?: GeneralEvents["ingestKey"];
  name?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const pathname = usePathname();
  const hash = href.includes("#") ? href.split("#")[1] : null;
  const pathWithoutHash = href.replace(/#.*/, "") || "/";
  const isSamePage = pathname === pathWithoutHash || pathname === "/";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hash && isSamePage) {
      e.preventDefault();
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      if (analyticsKey) {
        sendEvent(analyticsKey, { eventType: name });
      }
    }
  };

  return (
    <a
      href={href}
      className={$button({
        intent,
        className,
        size: "md",
      })}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}
