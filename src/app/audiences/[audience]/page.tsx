import { notFound } from "next/navigation";
import { SiteCard } from "@/components/heritage/SiteCard";
import { formatLabel, getAllAudiences, getSitesByAudienceSlug } from "@/lib/heritage-data";
import { Breadcrumbs } from "@/components/heritage/Breadcrumbs";

export function generateStaticParams() {
  return getAllAudiences().map((aud) => ({ audience: aud.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ audience: string }> }) {
  const { audience } = await params;
  const aud = getAllAudiences().find((a) => a.slug === audience);
  const title = aud
    ? `${formatLabel(aud.audience)} | ${aud.count} sites | Éire Heritage`
    : "Audiences | Éire Heritage";
  return {
    title,
    description: aud ? `Discover ${aud.count} site(s) suitable for ${aud.audience}.` : "Sites by audience suitability"
  };
}

export default async function AudiencePage({ params }: { params: Promise<{ audience: string }> }) {
  const { audience } = await params;
  const audienceMeta = getAllAudiences().find((a) => a.slug === audience);
  const sites = getSitesByAudienceSlug(audience);

  if (!audienceMeta || !sites.length) return notFound();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Audiences", href: "/audiences" },
    { label: formatLabel(audienceMeta.audience) }
  ];

  return (
    <div className="container" style={{ padding: "28px 20px 50px" }}>
      <Breadcrumbs items={breadcrumbs} />
      <div className="content-section">
        <h1 className="section-title">
          {formatLabel(audienceMeta.audience)} ({audienceMeta.count})
        </h1>
        <p className="sub-text">Experiences that suit this audience segment.</p>
      </div>

      <div className="sites-grid">
        {sites.map((site, idx) => (
          <SiteCard key={site.id} site={site} featured={idx < 1} />
        ))}
      </div>
    </div>
  );
}
