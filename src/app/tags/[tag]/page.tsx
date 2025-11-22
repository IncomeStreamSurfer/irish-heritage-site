import { notFound } from "next/navigation";
import { SiteCard } from "@/components/heritage/SiteCard";
import { formatLabel, getAllTags, getSitesByTagSlug } from "@/lib/heritage-data";
import { Breadcrumbs } from "@/components/heritage/Breadcrumbs";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: tagParam } = await params;
  const tag = getAllTags().find((t) => t.slug === tagParam);

  if (!tag) {
    return {
      title: "Tags | Éire Heritage",
      description: "Browse Irish heritage sites by tag"
    };
  }

  const tagLabel = formatLabel(tag.tag);
  const title = `Best ${tagLabel} Sites in Ireland (${tag.count} ${tag.count === 1 ? 'Location' : 'Locations'}) | Irish Heritage Guide`;
  const description = `Discover ${tag.count} incredible ${tagLabel.toLowerCase()} heritage ${tag.count === 1 ? 'site' : 'sites'} across Ireland. Explore historic ${tagLabel.toLowerCase()} locations with visitor info, opening times & admission prices.`;

  return { title, description };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const tagMeta = getAllTags().find((t) => t.slug === tag);
  const sites = getSitesByTagSlug(tag);

  if (!tagMeta || !sites.length) return notFound();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Tags", href: "/tags" },
    { label: tagMeta.tag }
  ];

  return (
    <div className="container" style={{ padding: "28px 20px 50px" }}>
      <Breadcrumbs items={breadcrumbs} />
      <div className="content-section">
        <h1 className="section-title">
          #{tagMeta.tag} ({tagMeta.count})
        </h1>
        <p className="sub-text">All heritage sites that match this tag.</p>
      </div>

      <div className="sites-grid">
        {sites.map((site, idx) => (
          <SiteCard key={site.id} site={site} featured={idx < 1} />
        ))}
      </div>
    </div>
  );
}
