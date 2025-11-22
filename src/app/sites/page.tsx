import Link from "next/link";
import { Breadcrumbs } from "@/components/heritage/Breadcrumbs";
import { SiteCard } from "@/components/heritage/SiteCard";
import {
  formatLabel,
  getAllAudiences,
  getAllTags,
  getRegions,
  getSites,
  slugifyValue
} from "@/lib/heritage-data";

type SearchParams = {
  q?: string;
  region?: string;
  tag?: string;
  audience?: string;
};

const matchesQuery = (value: string | undefined, q: string) =>
  value?.toLowerCase().includes(q.toLowerCase()) ?? false;

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { q, region, tag, audience } = await searchParams;
  const filters = [q && `query: ${q}`, region && `region: ${region}`, tag && `tag: ${tag}`, audience && `audience: ${audience}`]
    .filter(Boolean)
    .join(" · ");

  return {
    title: `Sites | ${filters || "All"} | Éire Heritage`,
    description: `Browse heritage sites${filters ? ` filtered by ${filters}` : ""}.`
  };
}

export default async function SitesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { q, region, tag, audience } = await searchParams;
  const allSites = getSites();
  const regionSlug = region ? slugifyValue(region) : null;
  const tagSlug = tag ? slugifyValue(tag) : null;
  const audienceSlug = audience ? slugifyValue(audience) : null;
  const regionLabel = regionSlug
    ? getRegions().find((r) => slugifyValue(r) === regionSlug) ?? region
    : region;

  const filtered = allSites.filter((site) => {
    const matchesQ =
      !q ||
      matchesQuery(site.name, q) ||
      matchesQuery(site.tagline, q) ||
      matchesQuery(site.description?.short, q) ||
      matchesQuery(site.description?.full, q) ||
      site.tags?.some((t) => matchesQuery(t, q)) ||
      site.categories?.some((c) => matchesQuery(c, q));

    const matchesRegion =
      !regionSlug ||
      slugifyValue(site.location?.address?.county ?? "") === regionSlug ||
      slugifyValue(site.location?.address?.region ?? "") === regionSlug;

    const matchesTag = !tagSlug || site.tags?.some((t) => slugifyValue(t) === tagSlug);
    const matchesAudience = !audienceSlug || site.suitableFor?.some((a) => slugifyValue(a) === audienceSlug);

    return matchesQ && matchesRegion && matchesTag && matchesAudience;
  });

  const tagList = getAllTags().slice(0, 8);
  const audienceList = getAllAudiences().slice(0, 8);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Sites" },
    ...(regionLabel ? [{ label: `Region: ${regionLabel}` }] : []),
    ...(tag ? [{ label: `Tag: ${tag}` }] : []),
    ...(audience ? [{ label: `Audience: ${audience}` }] : [])
  ];

  return (
    <div className="container" style={{ padding: "28px 20px 50px" }}>
      <Breadcrumbs items={breadcrumbs} />
      <div className="content-section">
        <h1 className="section-title">
          All sites ({filtered.length}/{allSites.length})
        </h1>
        <p className="sub-text">
          Filtered by {region ? `region: ${region} · ` : ""}
          {tag ? `tag: ${tag} · ` : ""}
          {audience ? `audience: ${audience} · ` : ""}
          {q ? `query: ${q}` : "no filters applied"}
        </p>
        <div className="chips" style={{ marginBottom: 12 }}>
          {tagList.map((t) => (
            <Link key={t.slug} className="chip-link" href={`/sites?tag=${t.slug}`}>
              #{t.tag}
            </Link>
          ))}
        </div>
        <div className="chips">
          {audienceList.map((a) => (
            <Link key={a.slug} className="chip-link" href={`/sites?audience=${a.slug}`}>
              {formatLabel(a.audience)}
            </Link>
          ))}
        </div>
      </div>

      <div className="sites-grid">
        {filtered.map((site, idx) => (
          <SiteCard key={site.id} site={site} featured={idx < 1} />
        ))}
      </div>
    </div>
  );
}
