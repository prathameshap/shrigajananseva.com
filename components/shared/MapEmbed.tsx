import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/ui";
import { site } from "@/lib/content";
import { getDictionary, type Locale } from "@/lib/i18n";

/**
 * Location map — new to the site; the old contact page had none.
 *
 * Uses OpenStreetMap rather than Google Maps for one reason: no third-party
 * tracking cookie, which is what lets the whole site run without a cookie
 * consent banner.
 */
export function MapEmbed({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { latitude, longitude, mapQuery } = site.address;
  const delta = 0.006;
  const bbox = [longitude - delta, latitude - delta / 2, longitude + delta, latitude + delta / 2]
    .map((value) => value.toFixed(5))
    .join(",");

  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-card border border-hairline bg-surface-raised shadow-soft">
        <iframe
          src={embedUrl}
          title={dict.visit.mapLabel}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full border-0 sm:h-96"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={directionsUrl} external variant="primary">
          <Icon.MapPin className="h-4 w-4" />
          {dict.visit.getDirections}
        </ButtonLink>
        <ButtonLink href={osmUrl} external variant="secondary">
          View larger map
        </ButtonLink>
      </div>
    </div>
  );
}
