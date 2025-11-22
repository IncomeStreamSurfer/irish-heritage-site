import Link from "next/link";
import { Breadcrumbs } from "@/components/heritage/Breadcrumbs";
import { SiteCard } from "@/components/heritage/SiteCard";
import { getAllTags, getPreviewSites } from "@/lib/heritage-data";

const tags = getAllTags();
const spotlightSites = getPreviewSites(3);

export const metadata = {
  title: "Tags | Éire Heritage",
  description: "Browse heritage sites by tag."
};

export default function TagsIndexPage() {
  return (
    <div className="container" style={{ padding: "28px 20px 50px" }}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tags" }]} />
      <div className="content-section">
        <h1 className="section-title">Explore by tag</h1>
        <p className="sub-text">
          Browse every tag across the collection. Select a tag to jump straight to its dedicated page and sites.
        </p>
        <div className="chips">
          {tags.map((tag) => (
            <Link key={tag.slug} href={`/tags/${tag.slug}`} className="chip-link">
              #{tag.tag} ({tag.count})
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
