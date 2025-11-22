import Image from "next/image";
import Link from "next/link";
import { formatLocation, getSiteScore } from "@/lib/heritage-data";
import { HeritageSite } from "@/lib/heritage-schema";

type Props = {
  site: HeritageSite;
  featured?: boolean;
};

const StarIcon = ({ muted = false }: { muted?: boolean }) => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden>
    <path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      fill={muted ? "rgba(191,160,83,0.3)" : "var(--color-gold)"}
    />
  </svg>
);

const MapPinIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden>
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
      fill="var(--color-text-grey)"
    />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden>
    <path
      d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
      fill="var(--color-gold)"
    />
  </svg>
);

export function SiteCard({ site, featured }: Props) {
  const hero = site.images?.heroImage?.url ?? site.images?.gallery?.[0]?.url;
  const ratingScore = Math.max(3, Math.min(5, Math.round(getSiteScore(site) / 6)));
  const county = formatLocation(site);

  return (
    <Link href={`/sites/${site.id}`} className="card site-card">
      <div className="card-img-wrap">
        {hero ? (
          <Image
            src={hero}
            alt={site.images?.heroImage?.alt ?? site.name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        ) : null}
        <div className="heart-btn" aria-hidden>
          <svg className="icon icon-grey" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-title">{site.name}</h3>
        <p className="sub-text" style={{ marginBottom: 0 }}>
          {site.tagline ?? site.description?.short ?? site.description?.significance}
        </p>
        <div className="card-rating" aria-label={`${ratingScore} out of 5`}>
          <div className="stars">
            {Array.from({ length: 5 }).map((_, starIdx) => (
              <StarIcon key={starIdx} muted={starIdx + 1 > ratingScore} />
            ))}
          </div>
          <span>{site.features?.highlights?.length ?? 0} highlights</span>
        </div>
        <div className="card-footer">
          {featured ? (
            <span className="badge-featured">
              <ShieldCheckIcon /> Featured site
            </span>
          ) : (
            <span />
          )}
          <span className="location-meta">
            <MapPinIcon />
            {county}
          </span>
        </div>
      </div>
    </Link>
  );
}
