/**
 * Shared presentational primitives.
 *
 * All server components — none of these need interactivity. Anything that does
 * lives in its own file marked "use client", so the JS shipped to a devotee on
 * a slow connection stays close to nothing.
 */

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "@/components/icons";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------- container */

export function Container({
  className,
  children,
  width = "default",
}: {
  className?: string;
  children: ReactNode;
  width?: "default" | "narrow" | "wide";
}) {
  const widths = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  };
  return (
    <div className={cx("mx-auto w-full px-5 sm:px-6 lg:px-8", widths[width], className)}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- section */

export function Section({
  className,
  children,
  tone = "canvas",
  id,
  width,
}: {
  className?: string;
  children: ReactNode;
  tone?: "canvas" | "raised" | "brand" | "wash";
  id?: string;
  width?: "default" | "narrow" | "wide";
}) {
  const tones = {
    canvas: "bg-canvas",
    raised: "bg-surface-raised",
    brand: "bg-night-900 text-sandal-100",
    wash: "festive-wash",
  };
  return (
    <section id={id} className={cx("py-14 sm:py-20", tones[tone], className)}>
      <Container width={width}>{children}</Container>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "start",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "start" | "center";
}) {
  return (
    <div
      className={cx(
        "mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
      )}
    >
      <div className={cx("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className="mb-2 text-sm font-semibold tracking-[0.14em] text-accent uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl sm:text-4xl">{title}</h2>
        {description ? <p className="mt-3 text-lg text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ----------------------------------------------------------------- button */

type ButtonVariant = "primary" | "secondary" | "ghost" | "onbrand";
type ButtonSize = "sm" | "md" | "lg";

/**
 * Alignment rules, all three of which were wrong before:
 *
 * `min-h-*` per size — buttons in a row now share an exact height whether or
 *   not they contain an icon, and whatever icon size a caller passes. Height
 *   still grows if a label wraps, so `w-full` buttons in narrow cards are fine.
 * `leading-snug` — the global 1.7 body line-height made a button's text box
 *   taller than its icon, so icon and text sat on different centres.
 * `[&>svg]:shrink-0` — icons were being squeezed when a long label competed
 *   for width, which pulled the label off-centre.
 *
 * The min-heights double as comfortable touch targets (44px at `md`).
 */
const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full text-center leading-snug font-semibold transition-colors duration-150 [&>svg]:shrink-0 disabled:cursor-not-allowed disabled:opacity-55";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-saffron-600 text-sandal-50 hover:bg-saffron-700 active:bg-saffron-800",
  secondary:
    "border border-hairline bg-surface text-heading hover:border-saffron-400 hover:bg-surface-raised",
  ghost: "text-accent hover:bg-accent-soft",
  onbrand: "bg-marigold-400 text-ink-900 hover:bg-marigold-300",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-4 py-2 text-sm",
  md: "min-h-11 px-5 py-2.5",
  lg: "min-h-13 px-7 py-3 text-lg",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md") {
  return cx(buttonBase, buttonVariants[variant], buttonSizes[size]);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={cx(buttonClass(variant, size), className)} {...rest} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  external,
  children,
  ...rest
}: ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  external?: boolean;
}) {
  // `external` controls target/rel only. It used to append an external-link
  // icon too, which gave buttons that already led with an icon two of them —
  // one each side of the label, which read as a misalignment. Callers that
  // want the glyph now pass <Icon.External /> themselves.
  const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Link href={href} className={cx(buttonClass(variant, size), className)} {...props} {...rest}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------- card */

export function Card({
  className,
  children,
  as: As = "div",
  interactive,
  id,
}: {
  className?: string;
  children: ReactNode;
  as?: "div" | "article" | "li";
  interactive?: boolean;
  /** Set when the card is a link target, so `scroll-mt-*` can offset it under the sticky header. */
  id?: string;
}) {
  return (
    <As
      id={id}
      className={cx(
        "rounded-card border border-hairline bg-surface shadow-soft",
        interactive && "transition-shadow duration-200 hover:shadow-lift",
        className,
      )}
    >
      {children}
    </As>
  );
}

/* ------------------------------------------------------------------ badge */

type BadgeTone = "neutral" | "accent" | "brand" | "success" | "warning" | "live";

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  const tones: Record<BadgeTone, string> = {
    neutral: "bg-surface-raised text-muted border-hairline",
    accent: "bg-accent-soft text-accent border-marigold-200",
    brand: "bg-brand-soft text-brand border-kumkum-200",
    success: "bg-tulsi-50 text-tulsi-700 border-tulsi-100",
    warning: "bg-marigold-100 text-marigold-800 border-marigold-200",
    live: "bg-saffron-600 text-sandal-50 border-kumkum-700",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A quietly pulsing dot for the "live now" state. Respects reduced motion. */
export function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-marigold-300 opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-marigold-400" />
    </span>
  );
}

/* ------------------------------------------------------------ placeholder */

/**
 * Shown where the trustees have not yet supplied content.
 *
 * Deliberately honest rather than lorem ipsum: a devotee reading this should
 * understand that the information is genuinely not published yet, and know who
 * to ask. Fill the underlying field in `content/data/` and this disappears.
 */
export function Placeholder({
  title,
  children,
  contact,
}: {
  title: string;
  children?: ReactNode;
  contact?: string;
}) {
  return (
    <div className="rounded-card border border-dashed border-gold-400 bg-accent-soft/50 p-6">
      <p className="flex items-center gap-2 font-semibold text-heading">
        <Icon.Info className="h-5 w-5 shrink-0 text-accent" />
        {title}
      </p>
      {children ? <div className="mt-2 text-muted">{children}</div> : null}
      {contact ? (
        <p className="mt-3 text-sm text-muted">
          For this information in the meantime, contact{" "}
          <a className="font-semibold text-accent underline underline-offset-2" href={`mailto:${contact}`}>
            {contact}
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------- misc */

export function GoldRule({ className }: { className?: string }) {
  return <div className={cx("rule-gold", className)} role="presentation" />;
}

export function Torana({ className }: { className?: string }) {
  return <div className={cx("torana", className)} role="presentation" />;
}

export function DefinitionRow({ term, children }: { term: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-hairline py-3 last:border-0 sm:flex-row sm:gap-6">
      <dt className="w-48 shrink-0 font-semibold text-heading">{term}</dt>
      <dd className="text-muted">{children}</dd>
    </div>
  );
}

export function Stat({
  value,
  label,
  note,
}: {
  value: ReactNode;
  label: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div className="text-center">
      <p className="font-display text-4xl text-heading sm:text-5xl">{value}</p>
      <p className="mt-1 font-semibold text-body">{label}</p>
      {note ? <p className="mt-0.5 text-sm text-muted">{note}</p> : null}
    </div>
  );
}

/** Body copy rendered from a Markdown string that has already been sanitised. */
export function Prose({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cx("prose-sgs max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
