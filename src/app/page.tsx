import Image from "next/image";
import Link from "next/link";
import {
  getCategoryCounts,
  getDataset,
  getDatasetInsights,
  getFeaturedSite,
  getPreviewSites,
  getSeasonalAccess,
  getTopAudiences,
  getSiteScore,
  getTopTags,
  getRegions,
  formatLocation,
  formatLabel,
  slugifyValue
} from "@/lib/heritage-data";
import { HeritageSite } from "@/lib/heritage-schema";
import { SiteCard } from "@/components/heritage/SiteCard";

const dataset = getDataset();
const featuredSite = getFeaturedSite();
const previewSites = getPreviewSites(6);
const categoryCounts = getCategoryCounts().slice(0, 6);
const regions = getRegions().slice(0, 8);
const topTags = getTopTags(6);
const topAudiences = getTopAudiences(6);
const insights = getDatasetInsights();
const seasonal = getSeasonalAccess().slice(0, 3);

const harpPath =
  "M145.6 32C127.4 50.2 112 76.1 102.4 108.1C93.1 138.9 88 173.8 88 211.6c0 176.4 114.6 319.7 256 319.7c19.8 0 38.6-3 56-8.3c15.2-4.7 24.6-20.9 20-36.1s-20.9-24.6-36.1-20c-12.8 3.9-26.5 6.1-41.1 6.1c-106 0-192-107.5-192-239.8c0-31.9 5.2-61 14-86.8c8.5-24.9 21.7-46 38.6-60.2C219.1 70.7 246.2 64 276 64c6.6 0 13.1 .3 19.5 1c28.3 3.1 54.6 12.3 77.9 26.1c14 8.3 32.2 3.7 40.5-10.3s3.7-32.2-10.3-40.5C370.4 20.6 328.7 6.7 284.3 1.5C281.5 1.2 278.8 1 276 1c-38.4 0-73.9 9.2-104.4 23.8c-8.7 4.1-17.3 8.5-26 13.2zM392.6 115.9c-13.8-8.1-31.9-3.4-40 10.5s-3.4 31.9 10.5 40c18.7 10.9 33.6 26.4 43.8 44.4c9.1 16.1 15 34.1 17.4 52.7c1.8 13.8 13.5 24.5 27.4 24.5c1.9 0 3.8-.2 5.6-.6c15.9-3.7 25.8-19.7 22-35.6c-3.4-14.2-8.4-27.7-14.9-40.2c-1.8-3.5-3.8-6.9-5.9-10.2C446.9 172 425 134.8 392.6 115.9zM428.9 315c-15.9 2.9-26.8 18.2-23.9 34.1c3.6 19.7 5.5 40.3 5.5 61.4c0 13.9-1 27.5-3 40.6c-2.4 15.9 8.6 30.7 24.4 33.1s30.7-8.6 33.1-24.4c2.7-17.4 4.1-35.6 4.1-54.3c0-28-2.6-55.2-7.4-81.4C458.8 308.3 444.8 297.6 428.9 315zM344 128c-17.7 0-32 14.3-32 32V329.4c0 31.1-25.2 56.4-56.3 56.4c-8 0-15.6-1.7-22.5-4.6c-16.4-7-28-23.3-28-42.4c0-8.8 7.2-16 16-16h40c8.8 0 16-7.2 16-16V160c0-17.7-14.3-32-32-32c-3.8 0-7.4 .7-10.8 1.9c-34 12.5-58.2 44.9-58.2 82.9c0 38.5 24.6 71.2 59.2 83.3c9.6 3.4 19.8 5.2 30.6 5.2c48.8 0 88.3-39.6 88.3-88.3V160c0-17.7-14.3-32-32-32zm-48 64v91.4c-5.4 6.1-13.3 10-22.2 10c-6.4 0-12.2-2-17.1-5.5c-5.2-3.7-8.7-9.8-8.7-16.8V203.9c4.1-6.1 11-10.2 18.8-10.2c4.5 0 8.8 1.3 12.4 3.7C288 203.3 296 215.3 296 229.5v5.6c0-7.1 1.7-13.9 4.9-20.1c-5.5-7.6-8.8-16.8-8.8-26.9c0-14.1 6.4-26.6 16.5-35.2c-7.7-4.4-16.6-6.9-26.1-6.9c-5.2 0-10.1 .8-14.8 2.2C274.3 155.5 282.3 168.8 288 183.9V192z";

const SearchIcon = ({ color = "currentColor", className }: { color?: string; className?: string }) => (
  <svg className={className ?? "icon"} viewBox="0 0 24 24" aria-hidden>
    <path
      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"
      fill={color}
    />
  </svg>
);

const CalendarIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden>
    <path
      d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15H5V10h14v9zm0-11H5V6h14v2z"
      fill="var(--color-gold)"
    />
  </svg>
);

const SparkleIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden>
    <path
      d="M9 2l1.5 4.5L15 8l-4.5 1.5L9 14l-1.5-4.5L3 8l4.5-1.5L9 2zm7 6l.8 2.2L19 11l-2.2.8L16 14l-.8-2.2L13 11l2.2-.8L16 8zm-11 7l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15z"
      fill="var(--color-gold)"
    />
  </svg>
);

const TagIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden>
    <path
      d="M20.59 13.41l-8-8A2 2 0 0 0 11.17 5H4c-1.1 0-2 .9-2 2v7.17a2 2 0 0 0 .59 1.41l8 8c.78.78 2.05.78 2.83 0l7.17-7.17c.78-.78.78-2.05 0-2.83zM6.5 9A1.5 1.5 0 1 1 8 7.5 1.5 1.5 0 0 1 6.5 9z"
      fill="var(--color-gold)"
    />
  </svg>
);

const buildStories = (sourceSites: HeritageSite[], count = 3) =>
  sourceSites.slice(0, count).map((site, idx) => {
    const score = getSiteScore(site);
    const monthsAgo = Math.max(1, Math.min(24, Math.round(score / 2) + idx));
    const dateLabel = monthsAgo === 1 ? "1 month ago" : `${monthsAgo} months ago`;
    const image =
      site.images?.gallery?.[0]?.url ?? site.images?.heroImage?.url ?? site.images?.gallery?.[1]?.url;
    const description =
      site.description?.history ??
      site.description?.significance ??
      site.description?.short ??
      site.description?.full?.slice(0, 160);

    const title = site.tagline ? `${site.name}: ${site.tagline}` : site.name;
    return {
      title,
      description,
      image,
      dateLabel
    };
  });

const blogStories = buildStories(previewSites, 3);
const sidebarStories = buildStories(previewSites.slice(3).concat(previewSites), 3);

const computeHeroSubtitle = () => {
  if (featuredSite?.tagline) return featuredSite.tagline;
  if (featuredSite?.description?.short) return featuredSite.description.short;
  return "Ireland's heritage sites directory.";
};

export default function HomePage() {
  const heroImage =
    featuredSite?.images?.heroImage?.url ??
    featuredSite?.images?.gallery?.[0]?.url ??
    "https://placehold.co/1920x600/2c5e40/ffffff?text=Irish+Landscape";

  const heroPlaceholder =
    topTags.length >= 2
      ? `Search ${topTags[0].tag}, ${topTags[1].tag}, ${topTags[2]?.tag ?? "castles"}`
      : "Search by location, category, or keyword";

  return (
    <>
      <header className="header">
        <div className="container header-content">
          <Link href="/" className="logo" aria-label="Éire Heritage home">
            <svg className="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d={harpPath} />
            </svg>
            Éire Heritage
          </Link>
          <nav>
            <ul className="nav-links">
              <li>
                <Link className="active" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/sites">Explore Sites</Link>
              </li>
              <li>
                <Link href="/tags">Tags</Link>
              </li>
              <li>
                <Link href="/audiences">Audiences</Link>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </nav>
          <div className="header-actions">
            <div className="search-container">
              <input type="text" className="search-input" placeholder="Search..." />
              <SearchIcon color="var(--color-text-grey)" className="search-icon-abs" />
            </div>
            <button className="btn btn-gold">Sign Up/Login</button>
          </div>
        </div>
      </header>

      <section
        className="hero"
        style={{
          background: `url('${heroImage}') center/cover no-repeat`
        }}
      >
        <div className="container hero-content">
          <h1>Discover {insights.totalSites} of Ireland&apos;s timeless treasures</h1>
          <p>{computeHeroSubtitle()}</p>
          <div className="hero-meta">
            <span className="pill">
              <SparkleIcon /> {insights.experienceTypes} experience types
            </span>
            <span className="pill">
              <TagIcon /> Top tags: {topTags.slice(0, 3).map((tag) => tag.tag).join(", ")}
            </span>
            <span className="pill">
              <TagIcon /> Audiences: {topAudiences.slice(0, 2).map((aud) => aud.audience).join(", ")}
            </span>
            <span className="pill">
              <CalendarIcon /> Updated {dataset.metadata?.lastUpdated ?? "recently"}
            </span>
          </div>
          <div className="hero-search-box">
            <input type="text" className="hero-search-input" placeholder={heroPlaceholder} />
            <button className="hero-search-btn" aria-label="Search heritage sites">
              <SearchIcon color="var(--color-white)" />
            </button>
          </div>
        </div>
      </section>

      <div className="container main-layout-grid">
        <main>
          <section>
            <h2 className="section-title">Featured Sites</h2>
            <div className="sites-grid">
              {previewSites.map((site, idx) => (
                <SiteCard key={site.id} site={site} featured={idx < 2} />
              ))}
            </div>
          </section>

          <section className="blog-section-large">
            <h2 className="section-title">Recent Stories from the Sites</h2>
            <span className="sub-text">
              Pulled dynamically from site history, significance, and latest updates.
            </span>
            <div className="blog-grid-large">
              {blogStories.map((story, idx) => (
                <article key={idx} className="blog-card-vert">
                  <div className="blog-vert-img">
                    {story.image ? (
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    ) : null}
                  </div>
                  <div className="blog-vert-body">
                    <h3 className="blog-vert-title">{story.title}</h3>
                    <p className="blog-vert-excerpt">{story.description}</p>
                    <div className="blog-meta-date">{story.dateLabel}</div>
                  </div>
                </article>
              ))}
            </div>
            <div className="blog-read-more-container">
              <button className="btn btn-outline-gold">View all stories</button>
            </div>
          </section>
        </main>

        <aside>
          <div className="sidebar-widget">
            <h3 className="widget-title">Explore by Region</h3>
            <div className="region-grid">
              {regions.map((region) => (
                <Link key={region} className="region-btn" href={`/sites?region=${slugifyValue(region)}`}>
                  {region}
                </Link>
              ))}
            </div>
          </div>

          <div className="sidebar-widget">
            <h3 className="widget-title">Visitor intel</h3>
            <span className="sub-text">
              Opening hours, special closures, and busy periods captured from the dataset.
            </span>
            <div className="sidebar-blog-list">
              {seasonal.length ? (
                seasonal.map((entry) => (
                  <div key={entry.id} className="blog-card-horiz">
                    <div className="blog-horiz-img">
                      {entry.heroImage?.url ? (
                        <Image
                          src={entry.heroImage.url}
                          alt={entry.heroImage.alt ?? entry.name}
                          fill
                          sizes="120px"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "#e5e7eb" }} />
                      )}
                    </div>
                    <div className="blog-horiz-body">
                      <h4 className="blog-horiz-title">{entry.name}</h4>
                      <span className="blog-meta-date">
                        {entry.currentStatus ?? "Seasonal updates"} ·{" "}
                        {entry.specialClosures[0] ?? entry.busyPeriods[0] ?? "Tours available"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="sub-text" style={{ margin: 0 }}>
                  Seasonal details will appear as soon as they are available in the dataset.
                </p>
              )}
            </div>
          </div>

          <div className="sidebar-widget">
            <h3 className="widget-title">Recent Blog Posts</h3>
            <span className="sub-text">
              Auto-generated from site stories to stay on theme.
            </span>
            <div className="sidebar-blog-list">
              {sidebarStories.map((story, idx) => (
                <a key={idx} className="blog-card-horiz">
                  <div className="blog-horiz-img">
                    {story.image ? (
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        sizes="120px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "#e5e7eb" }} />
                    )}
                  </div>
                  <div className="blog-horiz-body">
                    <h4 className="blog-horiz-title">{story.title}</h4>
                    <span className="blog-meta-date">{story.dateLabel}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/sites">Sites</Link>
                </li>
                <li>
                  <Link href="/tags">Tags</Link>
                </li>
                <li>
                  <Link href="/audiences">Audiences</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Popular Categories</h4>
              <ul className="footer-links">
                {categoryCounts.map((cat) => (
                  <li key={cat.category}>
                    <Link href={`/sites?q=${encodeURIComponent(cat.category)}`}>
                      {formatLabel(cat.category)} ({cat.count})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Top Tags</h4>
              <ul className="footer-links">
                {topTags.map((tag) => (
                  <li key={tag.tag}>
                    <Link href={`/tags/${tag.slug}`}>
                      #{tag.tag} ({tag.count})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Newsletter</h4>
              <form>
                <input type="email" placeholder="Enter your email address" className="newsletter-input" />
                <button type="submit" className="btn btn-gold">
                  Sign Up
                </button>
              </form>
              <div className="social-icons">
                {["facebook", "twitter", "instagram", "linkedin"].map((network) => (
                  <a key={network} className="social-icon-link" aria-label={network}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="1.6" />
                      <text
                        x="50%"
                        y="55%"
                        textAnchor="middle"
                        fontSize="10"
                        fill="white"
                        fontFamily="var(--font-inter)"
                      >
                        {network[0].toUpperCase()}
                      </text>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Éire Heritage. Inspired by Ireland&apos;s official data.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
