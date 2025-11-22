import Link from "next/link";
import { Breadcrumbs } from "@/components/heritage/Breadcrumbs";
import { SiteCard } from "@/components/heritage/SiteCard";
import { getAllAudiences, getPreviewSites } from "@/lib/heritage-data";

const audiences = getAllAudiences();
const spotlightSites = getPreviewSites(3);

export const metadata = {
  title: "Find Irish Heritage Sites Perfect for You | Family, Couples & Group Travel",
  description: "Planning an Ireland trip? Discover heritage sites tailored for families, couples, history enthusiasts, photographers & more. Get personalized recommendations with tickets & visitor tips."
};

export default function AudiencesIndexPage() {
  return (
    <div className="container" style={{ padding: "28px 20px 50px" }}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Audiences" }]} />
        <div className="content-section">
        <h1 className="section-title">Browse by audience</h1>
        <p className="sub-text">
          Pick an audience segment to view the most relevant heritage experiences.
        </p>
        <div className="chips">
          {audiences.map((item) => (
            <Link key={item.slug} href={`/audiences/${item.slug}`} className="chip-link">
              {item.audience} ({item.count})
            </Link>
          ))}
        </div>
      </div>

      <div className="content-section">
        <h2 className="section-title">Spotlight</h2>
        <div className="sites-grid">
          {spotlightSites.map((site, idx) => (
            <SiteCard key={site.id} site={site} featured={idx === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
