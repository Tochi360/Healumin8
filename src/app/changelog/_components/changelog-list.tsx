"use client";
import * as React from "react";
import { BaseHubImage } from "basehub/next-image";
import clsx from "clsx";

import { ButtonLink } from "@/common/button";
import { formatDate } from "@/utils/dates";

import { type ChangelogListFragment } from "./changelog.fragment";

export function ChangelogList({ changelogPosts }: { changelogPosts: ChangelogListFragment[] }) {
  const [activePostId, setActivePostId] = React.useState(changelogPosts[0]?._id ?? "");
  const [prevPostId, setPrevPostId] = React.useState(changelogPosts[0]?._id ?? "");
  const prevPostIdRef = React.useRef(activePostId);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const postId = entry.target.getAttribute("data-post-id");

            if (postId) {
              setActivePostId(postId);
            }
          }
        });
      },
      {
        threshold: 1,
      },
    );

    document.querySelectorAll("[data-post-id]").forEach((el) => observer.observe(el));

    return () => observer.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changelogPosts]);

  React.useEffect(() => {
    setPrevPostId(prevPostIdRef.current);
    prevPostIdRef.current = activePostId;
  }, [activePostId]);

  const activeIdx = changelogPosts.findIndex((post) => post._id === activePostId);
  const prevPostIdx = changelogPosts.findIndex((post) => post._id === prevPostId);

  return (
    <div className="flex w-full flex-col">
      {/* Horizontal timeline with horizontal scroll on all viewports */}
      <div className="relative flex w-full flex-row flex-nowrap gap-6 overflow-x-auto border-b border-border pb-8 dark:border-dark-border md:gap-8 md:pb-1">
        {/* Horizontal line (desktop only; mobile scrolls so line omitted) */}
        <div
          className="absolute left-0 right-0 top-14 hidden h-px w-full border-t border-border dark:border-dark-border md:block"
          style={{ top: "calc(1rem + 3.5rem - 0.25rem)" }}
          aria-hidden
        />
        {changelogPosts.map((post, idx) => (
          <div
            key={post._id}
            className="group relative flex min-w-[280px] max-w-[400px] flex-shrink-0 flex-col items-center rounded-lg border border-border bg-surface-secondary/50 p-4 dark:border-dark-border dark:bg-dark-surface-secondary/50 md:border-0 md:bg-transparent md:p-0 md:pt-4"
            data-post-id={post._id}
          >
            {/* Date + dot */}
            <div className="relative z-10 flex h-14 w-full flex-col items-center justify-end gap-1.5 md:w-auto">
              <p
                className={clsx(
                  "text-center text-sm text-text-tertiary dark:text-dark-text-tertiary",
                  post._id === activePostId && "text-accent-500!",
                  prevPostIdx === activeIdx - 1 && "delay-500",
                )}
              >
                {formatDate(post.publishedAt)}
              </p>
              <div
                className={clsx(
                  "size-2 shrink-0 rounded-full bg-grayscale-400 shadow-neon shadow-grayscale-400/10 dark:bg-grayscale-600 dark:shadow-grayscale-600/20",
                  {
                    "bg-accent-500! shadow-accent-500/10!": activeIdx === idx,
                    "delay-500": prevPostIdx === activeIdx - 1,
                  },
                )}
              />
            </div>
            <article className="mt-4 flex w-full min-w-0 max-w-full flex-col gap-3 md:mt-6 md:max-w-[400px] md:gap-4">
              <BaseHubImage
                alt={post._title}
                blurDataURL={post.image.blurDataURL}
                className="h-40 w-full max-w-full rounded-lg border border-border object-cover dark:border-dark-border md:h-[280px] md:max-w-[400px]"
                height={280}
                placeholder="blur"
                priority={idx === 0}
                src={post.image.url}
                width={400}
              />
              <div className="flex min-w-0 flex-col gap-1">
                <ButtonLink unstyled href={`/changelog/${post._slug}`}>
                  <h2 className="text-base font-medium md:text-lg">{post._title}</h2>
                </ButtonLink>
                <p className="line-clamp-2 text-sm text-text-secondary dark:text-dark-text-secondary md:text-base">
                  {post.excerpt}
                </p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}
