import Image from "next/image";
import { ButtonLink } from "@/common/button";
import { ThemeSwitcher } from "./theme-switcher";

const NAV_LINKS = [
  { label: "About", href: "/#problem" },
  { label: "Solutions", href: "/#solution" },
  { label: "Security", href: "/#security" },
  { label: "Contact", href: "/#contact" },
];

export function StaticHeader() {
  return (
    <header className="sticky left-0 top-0 z-100 flex w-full flex-col border-b border-border bg-surface-primary dark:border-dark-border dark:bg-dark-surface-primary">
      <div className="flex h-(--header-height) bg-surface-primary dark:bg-dark-surface-primary">
        <div className="container mx-auto grid w-full grid-cols-header place-items-center content-center items-center px-6 *:first:justify-self-start">
          <ButtonLink unstyled className="flex items-center ring-offset-2" href="/">
            <Image
              src="/healumin8-logo.png"
              alt="Healumin8"
              width={120}
              height={28}
              className="h-6 w-auto max-w-[200px] object-contain"
              priority
            />
          </ButtonLink>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map(({ label, href }) => (
              <ButtonLink
                key={label}
                unstyled
                className="hover:bg-surface-tertiary dark:hover:bg-dark-surface-tertiary inline-flex h-7 items-center justify-center rounded-full px-3 pb-px text-sm tracking-tight text-text-primary dark:text-dark-text-primary"
                href={href}
              >
                {label}
              </ButtonLink>
            ))}
          </nav>
          <div className="flex items-center justify-end gap-3">
            <span className="text-text-tertiary dark:text-dark-text-tertiary hidden text-sm sm:block">
              Appearance
            </span>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
