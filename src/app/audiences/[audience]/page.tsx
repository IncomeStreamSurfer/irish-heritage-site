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

  if (!aud) {
    return {
      title: "Audiences | Éire Heritage",
      description: "Find Irish heritage sites by visitor type"
    };
  }

  const audienceLabel = formatLabel(aud.audience);
  const title = `${audienceLabel}: Best Irish Heritage Sites (${aud.count} Perfect ${aud.count === 1 ? 'Spot' : 'Spots'}) | Ireland Travel Guide`;
  const description = `Planning a trip to Ireland? Find ${aud.count} amazing heritage ${aud.count === 1 ? 'site' : 'sites'} perfect for ${aud.audience}. Complete visitor guides with tickets, hours & family-friendly tips.`;

  return { title, description };
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
