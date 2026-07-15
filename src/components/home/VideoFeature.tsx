"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  // autoplay + mute + loop：进入视口即自动静音循环播放
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;

  // IntersectionObserver：视频区域进入视口时自动加载并播放
  useEffect(() => {
    const node = containerRef.current;
    if (!node || active) return;

    // 不支持 IntersectionObserver 时直接加载（后备）
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35, rootMargin: "100px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="group relative w-full overflow-hidden rounded-lg border border-border bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {active ? (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          // 后备：点击播放按钮手动加载
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Play ${title}`}
            className="absolute inset-0 flex h-full w-full items-center justify-center"
          >
            <span
              className="absolute inset-0 bg-[hsl(var(--nav-theme)/0.25)] opacity-90 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
            <span
              className="relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] text-white shadow-lg shadow-[hsl(var(--nav-theme)/0.4)] transition-transform group-hover:scale-110"
              aria-hidden="true"
            >
              <Play className="ml-1 h-7 w-7" fill="currentColor" />
            </span>
            <span className="absolute bottom-4 left-4 right-4 z-10 line-clamp-2 text-center text-sm font-medium text-white/90 md:text-base">
              {title}
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
