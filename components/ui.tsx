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

<<<<<<< HEAD
/**
 * Five grounds, deliberately far enough apart to be told apart.
 *
 * The previous three (canvas / raised / brand) were two near-identical creams
 * and a near-black, so consecutive bands blurred together and the page read as
 * one long beige scroll. `tint` is the cool mint band that breaks up a run of
 * warm ones, and it is the single biggest reason the page now has rhythm.
 */
export type SectionTone = "canvas" | "raised" | "tint" | "brand" | "wash";

=======
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
export function Section({
  className,
  children,
  tone = "canvas",
  id,
  width,
}: {
  className?: string;
  children: ReactNode;
<<<<<<< HEAD
  tone?: SectionTone;
  id?: string;
  width?: "default" | "narrow" | "wide";
}) {
  const tones: Record<SectionTone, string> = {
    canvas: "bg-canvas",
    raised: "bg-surface-raised",
    tint: "bg-surface-tint",
    brand: "bg-night-900 text-sandal-100 night-wash",
    wash: "festive-wash",
  };
  return (
    <section
      id={id}
      className={cx("scroll-mt-24 py-14 sm:py-20", tones[tone], className)}
    >
=======
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
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
      <Container width={width}>{children}</Container>
    </section>
  );
}

<<<<<<< HEAD
export function Eyebrow({
  children,
  className,
  tone = "accent",
}: {
  children: ReactNode;
  className?: string;
  tone?: "accent" | "brand" | "onbrand";
}) {
  const tones = {
    accent: "text-accent",
    brand: "text-brand",
    onbrand: "text-marigold-300",
  };
  return (
    <p
      className={cx(
        "text-sm font-semibold tracking-[0.16em] uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </p>
  );
}

=======
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "start",
<<<<<<< HEAD
  onBrand,
=======
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "start" | "center";
<<<<<<< HEAD
  /** Set on the indigo bands, where heading and muted colours have to flip. */
  onBrand?: boolean;
=======
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
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
<<<<<<< HEAD
          <Eyebrow tone={onBrand ? "onbrand" : "accent"} className="mb-2">
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h2 className={cx("text-3xl sm:text-4xl", onBrand && "text-sandal-50")}>{title}</h2>
        {description ? (
          <p className={cx("mt-3 text-lg", onBrand ? "text-sandal-200" : "text-muted")}>
            {description}
          </p>
        ) : null}
=======
          <p className="mb-2 text-sm font-semibold tracking-[0.14em] text-accent uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl sm:text-4xl">{title}</h2>
        {description ? <p className="mt-3 text-lg text-muted">{description}</p> : null}
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ----------------------------------------------------------------- button */

<<<<<<< HEAD
type ButtonVariant = "primary" | "secondary" | "ghost" | "onbrand" | "accent" | "outline";
=======
type ButtonVariant = "primary" | "secondary" | "ghost" | "onbrand";
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
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
<<<<<<< HEAD
  "inline-flex items-center justify-center gap-2 rounded-full text-center leading-snug font-semibold transition-all duration-150 [&>svg]:shrink-0 disabled:cursor-not-allowed disabled:opacity-55";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-saffron-600 text-sandal-50 shadow-soft hover:-translate-y-px hover:bg-saffron-700 hover:shadow-lift active:translate-y-0 active:bg-saffron-800",
  accent:
    "bg-peacock-700 text-sandal-50 shadow-soft hover:-translate-y-px hover:bg-peacock-800 hover:shadow-lift active:translate-y-0",
  secondary:
    "border border-hairline-strong bg-surface text-heading hover:border-saffron-400 hover:bg-surface-raised",
  outline:
    "border border-sandal-400/40 bg-transparent text-sandal-50 hover:border-marigold-300 hover:bg-night-700",
=======
  "inline-flex items-center justify-center gap-2 rounded-full text-center leading-snug font-semibold transition-colors duration-150 [&>svg]:shrink-0 disabled:cursor-not-allowed disabled:opacity-55";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-saffron-600 text-sandal-50 hover:bg-saffron-700 active:bg-saffron-800",
  secondary:
    "border border-hairline bg-surface text-heading hover:border-saffron-400 hover:bg-surface-raised",
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
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
<<<<<<< HEAD
  tone = "surface",
=======
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
}: {
  className?: string;
  children: ReactNode;
  as?: "div" | "article" | "li";
  interactive?: boolean;
  /** Set when the card is a link target, so `scroll-mt-*` can offset it under the sticky header. */
  id?: string;
<<<<<<< HEAD
  tone?: "surface" | "gold" | "night";
}) {
  const tones = {
    surface: "border-hairline bg-surface",
    gold: "border-gold-400/60 bg-gradient-to-br from-marigold-50 to-sandal-100",
    night: "border-night-600 bg-night-800 text-sandal-100",
  };
=======
}) {
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
  return (
    <As
      id={id}
      className={cx(
<<<<<<< HEAD
        "rounded-card border shadow-soft",
        tones[tone],
        interactive &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-saffron-300 hover:shadow-lift",
        id && "scroll-mt-28",
=======
        "rounded-card border border-hairline bg-surface shadow-soft",
        interactive && "transition-shadow duration-200 hover:shadow-lift",
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
        className,
      )}
    >
      {children}
    </As>
  );
}

<<<<<<< HEAD
/**
 * A card with a coloured spine down its leading edge.
 *
 * Used where a grid of cards would otherwise be a grid of identical white
 * rectangles — the spine colour is what lets you scan the grid.
 */
export function SpinedCard({
  spine = "saffron",
  className,
  children,
  as,
  interactive,
  id,
}: {
  spine?: "saffron" | "peacock" | "kumkum" | "marigold" | "tulsi";
  className?: string;
  children: ReactNode;
  as?: "div" | "article" | "li";
  interactive?: boolean;
  id?: string;
}) {
  const spines = {
    saffron: "before:bg-saffron-500",
    peacock: "before:bg-peacock-500",
    kumkum: "before:bg-kumkum-500",
    marigold: "before:bg-marigold-400",
    tulsi: "before:bg-tulsi-500",
  };
  return (
    <Card
      as={as}
      id={id}
      interactive={interactive}
      className={cx(
        "relative overflow-hidden pl-1.5",
        "before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:content-['']",
        spines[spine],
        className,
      )}
    >
      {children}
    </Card>
  );
}

/* ------------------------------------------------------------------ badge */

type BadgeTone =
  | "neutral"
  | "accent"
  | "brand"
  | "success"
  | "warning"
  | "live"
  | "gold"
  | "onbrand";
=======
/* ------------------------------------------------------------------ badge */

type BadgeTone = "neutral" | "accent" | "brand" | "success" | "warning" | "live";
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f

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
<<<<<<< HEAD
    accent: "bg-peacock-50 text-peacock-700 border-peacock-200",
    brand: "bg-saffron-50 text-saffron-700 border-saffron-200",
    success: "bg-tulsi-50 text-tulsi-700 border-tulsi-100",
    warning: "bg-marigold-100 text-marigold-800 border-marigold-200",
    live: "bg-saffron-600 text-sandal-50 border-saffron-700",
    gold: "bg-marigold-50 text-gold-600 border-gold-400/60",
    onbrand: "bg-night-700 text-marigold-200 border-night-600",
=======
    accent: "bg-accent-soft text-accent border-marigold-200",
    brand: "bg-brand-soft text-brand border-kumkum-200",
    success: "bg-tulsi-50 text-tulsi-700 border-tulsi-100",
    warning: "bg-marigold-100 text-marigold-800 border-marigold-200",
    live: "bg-saffron-600 text-sandal-50 border-kumkum-700",
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
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
<<<<<<< HEAD
    <div className="rounded-card border border-dashed border-gold-400 bg-marigold-50 p-6">
      <p className="flex items-center gap-2 font-semibold text-heading">
        <Icon.Info className="h-5 w-5 shrink-0 text-gold-600" />
=======
    <div className="rounded-card border border-dashed border-gold-400 bg-accent-soft/50 p-6">
      <p className="flex items-center gap-2 font-semibold text-heading">
        <Icon.Info className="h-5 w-5 shrink-0 text-accent" />
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
        {title}
      </p>
      {children ? <div className="mt-2 text-muted">{children}</div> : null}
      {contact ? (
        <p className="mt-3 text-sm text-muted">
          For this information in the meantime, contact{" "}
<<<<<<< HEAD
          <a
            className="font-semibold text-accent underline underline-offset-2"
            href={`mailto:${contact}`}
          >
=======
          <a className="font-semibold text-accent underline underline-offset-2" href={`mailto:${contact}`}>
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
            {contact}
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}

<<<<<<< HEAD
/* ------------------------------------------------------------------ alert */

export function Alert({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "success" | "error";
  title?: ReactNode;
  children?: ReactNode;
}) {
  const tones = {
    info: { box: "border-peacock-200 bg-peacock-50", icon: "text-peacock-600" },
    warning: { box: "border-marigold-300 bg-marigold-50", icon: "text-marigold-700" },
    success: { box: "border-tulsi-100 bg-tulsi-50", icon: "text-tulsi-600" },
    error: { box: "border-kumkum-200 bg-kumkum-50", icon: "text-kumkum-600" },
  };
  const Glyph = tone === "success" ? Icon.Check : Icon.Info;
  return (
    <div className={cx("rounded-card border p-5", tones[tone].box)} role="status">
      <div className="flex gap-3">
        <Glyph className={cx("mt-0.5 h-5 w-5 shrink-0", tones[tone].icon)} />
        <div>
          {title ? <p className="font-semibold text-heading">{title}</p> : null}
          {children ? (
            <div className={cx(Boolean(title) && "mt-1", "text-body")}>{children}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

=======
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
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
<<<<<<< HEAD
      <p className="font-display text-4xl text-gold-foil sm:text-5xl">{value}</p>
=======
      <p className="font-display text-4xl text-heading sm:text-5xl">{value}</p>
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
      <p className="mt-1 font-semibold text-body">{label}</p>
      {note ? <p className="mt-0.5 text-sm text-muted">{note}</p> : null}
    </div>
  );
}

<<<<<<< HEAD
/** A numbered step, as used by the first-visit guide. */
export function NumberedStep({
  index,
  title,
  children,
}: {
  index: number;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Card as="li" className="flex gap-5 p-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-saffron-500 to-kumkum-600 font-display text-lg text-sandal-50">
        {index}
      </span>
      <span>
        <span className="block font-semibold text-heading">{title}</span>
        {children ? <span className="mt-1 block text-muted">{children}</span> : null}
      </span>
    </Card>
  );
}

=======
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
/** Body copy rendered from a Markdown string that has already been sanitised. */
export function Prose({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cx("prose-sgs max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
<<<<<<< HEAD

/* ------------------------------------------------------------ form fields */

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: ReactNode;
  htmlFor: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-semibold text-heading">
        {label}
        {required ? (
          <span className="ml-1 text-kumkum-600" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={`${htmlFor}-hint`} className="mt-0.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-sm font-semibold text-kumkum-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlClass =
  "w-full rounded-xl border border-hairline-strong bg-surface px-4 py-2.5 text-body " +
  "placeholder:text-ink-400 focus:border-peacock-500 focus:outline-none " +
  "focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-accent " +
  "disabled:opacity-60 aria-[invalid=true]:border-kumkum-500";

export function Input({ className, ...rest }: ComponentProps<"input">) {
  return <input className={cx(controlClass, "min-h-11", className)} {...rest} />;
}

export function Textarea({ className, ...rest }: ComponentProps<"textarea">) {
  return <textarea className={cx(controlClass, "min-h-32 resize-y", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: ComponentProps<"select">) {
  return (
    <select className={cx(controlClass, "min-h-11 pr-10", className)} {...rest}>
      {children}
    </select>
  );
}

export function Checkbox({
  label,
  id,
  className,
  ...rest
}: ComponentProps<"input"> & { label: ReactNode; id: string }) {
  return (
    <div className="flex gap-3">
      <input
        id={id}
        type="checkbox"
        className={cx(
          "mt-1 h-5 w-5 shrink-0 rounded border-hairline-strong accent-saffron-600",
          className,
        )}
        {...rest}
      />
      <label htmlFor={id} className="text-body">
        {label}
      </label>
    </div>
  );
}

/**
 * The honeypot.
 *
 * Hidden from people the accessible way — off-screen and `aria-hidden` and
 * `tabIndex={-1}` — rather than with `display:none`, which some bots detect.
 * `lib/validate.ts` rejects any submission that fills it in.
 */
export function Honeypot({ label }: { label: string }) {
  return (
    <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor="company">{label}</label>
      <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
=======
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
