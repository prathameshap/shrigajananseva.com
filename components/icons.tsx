/**
 * Inline icon set.
 *
 * Deliberately hand-rolled rather than pulled from a library: the whole set is
 * under 4 KB, it inherits `currentColor` so it works in both themes, and it
 * means no icon font to download on a slow connection.
 *
 * Every icon is decorative by default (`aria-hidden`). Pass a `title` only
 * when the icon is the sole content of a control.
 */

type IconProps = {
  className?: string;
  title?: string;
};

function Svg({
  className = "h-5 w-5",
  title,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const Icon = {
  Menu: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  ),
  Close: (p: IconProps) => (
    <Svg {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  ),
  ChevronDown: (p: IconProps) => (
    <Svg {...p}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  ),
  ChevronRight: (p: IconProps) => (
    <Svg {...p}>
      <path d="M9 6l6 6-6 6" />
    </Svg>
  ),
  ArrowRight: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </Svg>
  ),
  Clock: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  ),
  Calendar: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </Svg>
  ),
  MapPin: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </Svg>
  ),
  Phone: (p: IconProps) => (
    <Svg {...p}>
      <path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />
    </Svg>
  ),
  Mail: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Svg>
  ),
  Video: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="m16 10 5-3v10l-5-3" />
    </Svg>
  ),
  Play: (p: IconProps) => (
    <Svg {...p}>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </Svg>
  ),
  Document: (p: IconProps) => (
    <Svg {...p}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </Svg>
  ),
  Download: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 3v12M7 11l5 5 5-5M4 20h16" />
    </Svg>
  ),
  Audio: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" />
    </Svg>
  ),
  News: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="5" width="14" height="14" rx="2" />
      <path d="M17 9h3a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2M7 9h6M7 13h6M7 16h4" />
    </Svg>
  ),
  Heart: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 20s-7-4.5-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5c0 5-7 9.5-7 9.5Z" />
    </Svg>
  ),
  Users: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0M16.5 5.3a3.2 3.2 0 0 1 0 5.4M18 20a6 6 0 0 0-2.5-4.9" />
    </Svg>
  ),
  Check: (p: IconProps) => (
    <Svg {...p}>
      <path d="m5 13 4.5 4.5L19 7" />
    </Svg>
  ),
  Info: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </Svg>
  ),
  Shield: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 3l7 3v5.5c0 4.4-3 7.7-7 9.5-4-1.8-7-5.1-7-9.5V6l7-3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </Svg>
  ),
  Globe: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
    </Svg>
  ),
  Sun: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Svg>
  ),
  Moon: (p: IconProps) => (
    <Svg {...p}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </Svg>
  ),
  External: (p: IconProps) => (
    <Svg {...p}>
      <path d="M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </Svg>
  ),
  Ticket: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z" />
      <path d="M13 6v12" strokeDasharray="2 2" />
    </Svg>
  ),
  Sparkle: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
    </Svg>
  ),
  Lotus: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 20c-4 0-7.5-2.4-9-6 2.2-.6 4.1-.3 5.7.6" />
      <path d="M12 20c4 0 7.5-2.4 9-6-2.2-.6-4.1-.3-5.7.6" />
      <path d="M12 20c-2.6-2.3-4-5.2-4-8.3 0-3 1.4-5.8 4-7.7 2.6 1.9 4 4.7 4 7.7 0 3.1-1.4 6-4 8.3Z" />
    </Svg>
  ),
  Whatsapp: (p: IconProps) => (
    <Svg {...p}>
      <path d="M3.5 20.5 5 16.4A8 8 0 1 1 8.2 19.4l-4.7 1.1Z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.5 1-1l-1.6-.8-1 1a6 6 0 0 1-2.6-2.6l1-1L10.5 9c-.5 0-1.5 0-1.5.5Z" />
    </Svg>
  ),
  Youtube: (p: IconProps) => (
    <Svg {...p}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="m10.5 9.5 5 2.5-5 2.5v-5Z" />
    </Svg>
  ),
  Facebook: (p: IconProps) => (
    <Svg {...p}>
      <path d="M14.5 21v-8h2.7l.5-3h-3.2V8.2c0-.9.3-1.5 1.6-1.5h1.7V4c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.2V10H8.5v3h2.7v8Z" />
    </Svg>
  ),
  Instagram: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </Svg>
  ),
};

export type IconName = keyof typeof Icon;

/** Map a social channel id from site.json onto an icon. */
export function socialIcon(id: string) {
  if (id.startsWith("whatsapp")) return Icon.Whatsapp;
  if (id === "youtube") return Icon.Youtube;
  if (id === "facebook") return Icon.Facebook;
  if (id === "instagram") return Icon.Instagram;
  return Icon.External;
}
