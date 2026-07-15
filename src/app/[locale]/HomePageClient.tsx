"use client";

import { Suspense, lazy } from "react";
import {
  ArrowRight,
  Atom,
  BookOpen,
  Check,
  Clock,
  Compass,
  Dices,
  Gift,
  GitMerge,
  Sparkles,
  Trophy,
  Users,
  Waves,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

// 8 个首页内容模块的 section 锚点，与 Tools Grid 导航卡片一一对应
const NAV_SECTION_IDS = [
  "codes",
  "beginner-guide",
  "anime-tier-list",
  "best-teams",
  "rolling-and-rarities-guide",
  "merge-and-leveling-guide",
  "mutations-guide",
  "waves-checkpoints-and-rewards",
] as const;

// 模块标题旁的装饰图标
function ModuleHeading({
  icon: Icon,
  title,
  intro,
}: {
  icon: React.ElementType;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-8 text-center scroll-reveal md:mb-12">
      <div className="mb-3 flex items-center justify-center gap-3 md:mb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme)/0.15)] text-[hsl(var(--nav-theme-light))] md:h-12 md:w-12">
          <Icon className="h-5 w-5 md:h-6 md:w-6" />
        </span>
        <h2 className="text-3xl font-bold leading-tight md:text-5xl">{title}</h2>
      </div>
      {intro ? (
        <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
          {intro}
        </p>
      ) : null}
    </div>
  );
}

// 分级徽章样式：全部使用主题色，S 最实，依次变淡
function tierBadgeClass(tier: string): string {
  switch (tier) {
    case "S":
      return "bg-[hsl(var(--nav-theme))] text-white";
    case "A":
      return "bg-[hsl(var(--nav-theme)/0.7)] text-white";
    case "B":
      return "bg-[hsl(var(--nav-theme)/0.4)] text-white";
    default:
      return "bg-[hsl(var(--nav-theme)/0.15)] text-[hsl(var(--nav-theme-light))] border border-[hsl(var(--nav-theme)/0.3)]";
  }
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.rollanimetofight.wiki";
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Roll Anime to Fight Wiki",
        description:
          "Complete Roll Anime to Fight Wiki covering codes, unit tier lists, mutations, merging, wave strategies, and beginner guides for the Roblox anime defense game.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Roll Anime to Fight - Roblox Anime Defense Simulator",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Roll Anime to Fight Wiki",
        alternateName: "Roll Anime to Fight",
        url: siteUrl,
        description:
          "Complete Roll Anime to Fight resource hub for codes, units, tier lists, mutations, merge guides, and wave strategies",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://www.roblox.com/games/107653945083776/Roll-Anime-to-Fight",
          "https://www.roblox.com/communities/657759819/Another-Slop",
          "https://www.youtube.com/watch?v=Lofi891d-J0",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Roll Anime to Fight",
        gamePlatform: ["Roblox", "PC", "Mobile"],
        applicationCategory: "Game",
        genre: ["Anime", "Gacha", "Tower Defense", "Strategy"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/107653945083776/Roll-Anime-to-Fight",
        },
      },
      {
        "@type": "VideoObject",
        name: "Roll Anime to Fight! - Roblox Gameplay",
        description:
          "Roll Anime to Fight! Roblox gameplay video — rolling anime fighters, building a team, and surviving endless enemy waves.",
        uploadDate: "2026-06-15",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/Lofi891d-J0",
        url: "https://www.youtube.com/watch?v=Lofi891d-J0",
      },
    ],
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 text-center scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 mb-4 md:mb-6 md:px-4 md:py-2"
            >
              <Sparkles className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium md:text-sm">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold leading-[1.05] sm:text-5xl md:mb-6 md:text-7xl">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--nav-theme))] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[hsl(var(--nav-theme)/0.9)] md:px-8 md:py-4 md:text-lg"
              >
                <BookOpen className="h-5 w-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/107653945083776/Roll-Anime-to-Fight"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3.5 text-base font-semibold transition-colors hover:bg-white/10 md:px-8 md:py-4 md:text-lg"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区域，容器上限 max-w-5xl 避免挤压广告 */}
      <section className="px-4 py-10 md:py-12">
        <div className="container mx-auto max-w-5xl scroll-reveal">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="Lofi891d-J0"
              title="Roll Anime to Fight! - Roblox Gameplay"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 张导航卡片，位于视频区之后、Latest Updates 之前 */}
      <section className="bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = NAV_SECTION_IDS[index];
              return (
                <a
                  key={index}
                  href={`#${sectionId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(sectionId);
                  }}
                  className="group scroll-reveal block cursor-pointer rounded-xl border border-border bg-card p-4 text-left transition-all duration-300 hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] md:p-6"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)] text-[hsl(var(--nav-theme-light))] transition-colors group-hover:bg-[hsl(var(--nav-theme)/0.2)] md:mb-4 md:h-12 md:w-12"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold leading-snug md:text-base">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section - 保留模板模块 */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={Gift}
            title={t.modules.codes.title}
            intro={t.modules.codes.intro}
          />

          {/* 监控状态 + 兑换检查日期 */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3 scroll-reveal md:mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-4 py-1.5 text-sm">
              <Clock className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.codes.checkedOn}
            </span>
          </div>

          {/* Active / Expired 状态卡 */}
          <div className="mb-8 grid grid-cols-1 gap-4 scroll-reveal md:mb-10 md:grid-cols-2">
            {t.modules.codes.statusCards.map((card: any, index: number) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-white/5 p-5 md:p-6"
              >
                <h3 className="mb-2 text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                  {card.group}
                </h3>
                <p className="text-sm text-muted-foreground">{card.message}</p>
              </div>
            ))}
          </div>

          {/* How to Redeem 步骤 */}
          <div className="mb-8 scroll-reveal md:mb-10">
            <h3 className="mb-4 text-center text-xl font-bold md:text-2xl">
              How to Redeem Codes
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              {t.modules.codes.redeemSteps.map((step: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-border bg-white/5 p-4 md:p-5"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* New Code Sources（描述性卡片，不含链接） */}
          <div className="scroll-reveal rounded-xl border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-5 md:p-6">
            <h3 className="mb-4 text-base font-bold md:text-lg">
              Where New Codes Are Announced
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {t.modules.codes.sources.map((source: any, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                  <div>
                    <p className="font-semibold">{source.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {source.purpose}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Beginner Guide */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={Compass}
            title={t.modules["beginner-guide"].title}
            intro={t.modules["beginner-guide"].intro}
          />

          <div className="space-y-3 scroll-reveal md:space-y-4">
            {t.modules["beginner-guide"].steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 rounded-xl border border-border bg-white/5 p-4 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:gap-4 md:p-6"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)] md:h-12 md:w-12">
                  <span className="text-base font-bold text-[hsl(var(--nav-theme-light))] md:text-xl">
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="mb-1.5 text-lg font-bold md:mb-2 md:text-xl">
                    {step.title}
                  </h3>
                  <p className="mb-2 text-sm text-muted-foreground md:text-base">
                    {step.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs">
                    <Check className="h-3.5 w-3.5 text-[hsl(var(--nav-theme-light))]" />
                    {step.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Anime Tier List */}
      <section
        id="anime-tier-list"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={Trophy}
            title={t.modules["anime-tier-list"].title}
            intro={t.modules["anime-tier-list"].intro}
          />

          <div className="space-y-4 scroll-reveal">
            {t.modules["anime-tier-list"].tiers.map((tier: any, index: number) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:flex-row md:items-start md:p-6"
              >
                <div className="flex items-center gap-4 md:w-48 md:flex-shrink-0">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-black ${tierBadgeClass(
                      tier.tier,
                    )}`}
                  >
                    {tier.tier}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Tier {tier.tier}
                    </p>
                    <p className="font-bold leading-tight">{tier.label}</p>
                  </div>
                </div>
                <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-3">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                      Fighter Profile
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tier.profile}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                      Best Use
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tier.bestUse}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                      Merge Rule
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tier.mergeRule}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Best Teams */}
      <section
        id="best-teams"
        className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={Users}
            title={t.modules["best-teams"].title}
            intro={t.modules["best-teams"].intro}
          />

          <div className="mb-8 grid grid-cols-1 gap-4 scroll-reveal md:grid-cols-2">
            {t.modules["best-teams"].teams.map((team: any, index: number) => (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                    {team.name}
                  </h3>
                  <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs">
                    {team.stage}
                  </span>
                </div>
                <ul className="mb-3 space-y-1.5">
                  {team.roles.map((role: string, ri: number) => (
                    <li key={ri} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                      <span className="text-muted-foreground">{role}</span>
                    </li>
                  ))}
                </ul>
                <p className="mb-3 text-sm text-muted-foreground">
                  {team.strategy}
                </p>
                <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-md bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs font-medium">
                  {team.priority}
                </span>
              </div>
            ))}
          </div>

          {/* Team-Building Checklist */}
          <div className="scroll-reveal rounded-xl border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-5 md:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold">
                {t.modules["best-teams"].checklist.title}
              </h3>
              <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs">
                {t.modules["best-teams"].checklist.stage}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {t.modules["best-teams"].checklist.checks.map(
                (check: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                    <span className="text-sm text-muted-foreground">
                      {check}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 广告位 5: 中段移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Rolling and Rarities Guide */}
      <section
        id="rolling-and-rarities-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={Dices}
            title={t.modules["rolling-and-rarities-guide"].title}
            intro={t.modules["rolling-and-rarities-guide"].intro}
          />

          {/* 桌面端表格 */}
          <div className="scroll-reveal hidden overflow-hidden rounded-xl border border-border md:block">
            <div className="grid grid-cols-[1.1fr_1.8fr_1fr_2fr] bg-white/5">
              <div className="border-b border-border p-3 text-sm font-semibold">
                Category
              </div>
              <div className="border-b border-border p-3 text-sm font-semibold">
                Visible Stats
              </div>
              <div className="border-b border-border p-3 text-sm font-semibold">
                Keep Priority
              </div>
              <div className="border-b border-border p-3 text-sm font-semibold">
                Recommended Use
              </div>
            </div>
            {t.modules["rolling-and-rarities-guide"].rows.map(
              (row: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-[1.1fr_1.8fr_1fr_2fr] border-b border-border transition-colors last:border-b-0 hover:bg-white/[0.02]"
                >
                  <div className="p-3 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">
                    {row.category}
                  </div>
                  <div className="p-3 text-sm text-muted-foreground">
                    {row.stats}
                  </div>
                  <div className="p-3 text-sm">{row.keep}</div>
                  <div className="p-3 text-sm text-muted-foreground">
                    {row.use}
                  </div>
                </div>
              ),
            )}
          </div>

          {/* 移动端卡片 */}
          <div className="scroll-reveal space-y-3 md:hidden">
            {t.modules["rolling-and-rarities-guide"].rows.map(
              (row: any, index: number) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-white/5 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-[hsl(var(--nav-theme-light))]">
                      {row.category}
                    </h3>
                    <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2.5 py-0.5 text-xs">
                      {row.keep}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Stats: </span>
                    {row.stats}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Use: </span>
                    {row.use}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Merge and Leveling Guide */}
      <section
        id="merge-and-leveling-guide"
        className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={GitMerge}
            title={t.modules["merge-and-leveling-guide"].title}
            intro={t.modules["merge-and-leveling-guide"].intro}
          />

          <div className="grid grid-cols-1 gap-4 scroll-reveal md:grid-cols-2">
            {t.modules["merge-and-leveling-guide"].steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-1.5 text-lg font-bold">{step.title}</h3>
                    <p className="mb-2 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs">
                      <Check className="h-3.5 w-3.5 text-[hsl(var(--nav-theme-light))]" />
                      {step.priority}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Mutations Guide */}
      <section
        id="mutations-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={Atom}
            title={t.modules["mutations-guide"].title}
            intro={t.modules["mutations-guide"].intro}
          />

          <div className="grid grid-cols-1 gap-4 scroll-reveal md:grid-cols-2">
            {t.modules["mutations-guide"].mutations.map(
              (m: any, index: number) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-black ${tierBadgeClass(
                        m.tier,
                      )}`}
                    >
                      {m.tier}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold leading-tight text-[hsl(var(--nav-theme-light))]">
                        {m.mutation}
                      </h3>
                      <p className="text-xs text-muted-foreground">{m.type}</p>
                    </div>
                  </div>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="font-semibold text-foreground">Best For</dt>
                      <dd className="text-muted-foreground">{m.bestFor}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">
                        Keep Rule
                      </dt>
                      <dd className="text-muted-foreground">{m.keepRule}</dd>
                    </div>
                  </dl>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 8: Waves Checkpoints and Rewards */}
      <section
        id="waves-checkpoints-and-rewards"
        className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={Waves}
            title={t.modules["waves-checkpoints-and-rewards"].title}
            intro={t.modules["waves-checkpoints-and-rewards"].intro}
          />

          <div className="space-y-4 scroll-reveal">
            {t.modules["waves-checkpoints-and-rewards"].stages.map(
              (stage: any, index: number) => (
                <div
                  key={index}
                  className="relative rounded-xl border border-border bg-white/5 p-5 pl-16 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6 md:pl-20"
                >
                  <span className="absolute left-4 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] text-sm font-bold text-white md:left-6 md:top-6 md:h-10 md:w-10">
                    {index + 1}
                  </span>
                  <h3 className="mb-3 text-lg font-bold text-[hsl(var(--nav-theme-light))] md:text-xl">
                    {stage.stage}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                        Objective
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stage.objective}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                        Team Check
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stage.teamCheck}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                        Upgrade Priority
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stage.upgrade}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                        Reward Use
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stage.reward}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner before Footer */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="border-t border-border bg-white/[0.02]">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/games/107653945083776/Roll-Anime-to-Fight"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.robloxGame}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/657759819/Another-Slop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.robloxCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=Lofi891d-J0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={locale === "en" ? "/about" : `/${locale}/about`}
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href={
                      locale === "en"
                        ? "/privacy-policy"
                        : `/${locale}/privacy-policy`
                    }
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href={
                      locale === "en"
                        ? "/terms-of-service"
                        : `/${locale}/terms-of-service`
                    }
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href={locale === "en" ? "/copyright" : `/${locale}/copyright`}
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
