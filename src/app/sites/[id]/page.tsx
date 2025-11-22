import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatLabel,
  formatLocation,
  getSites,
  getSiteById,
  slugifyValue
} from "@/lib/heritage-data";
import { HeritageSite } from "@/lib/heritage-schema";
import { Breadcrumbs } from "@/components/heritage/Breadcrumbs";

type Params = { id: string };

export function generateStaticParams() {
  return getSites().map((site) => ({ id: site.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const site = getSiteById(id);
  if (!site) return {};

  const location = formatLocation(site);
  const siteType = site.type ? formatLabel(site.type) : "Heritage Site";

  const title = `${site.name}: ${siteType} in ${location} | Tickets, Hours & Visitor Guide`;

  let description = "";
  if (site.tagline && site.description?.short) {
    description = `${site.tagline}. ${site.description.short.slice(0, 120)}`;
  } else if (site.tagline) {
    description = site.tagline;
  } else if (site.description?.short) {
    description = site.description.short;
  } else if (site.description?.full) {
    description = site.description.full.slice(0, 155);
  }

  description = description.length > 155 ? description.slice(0, 152) + "..." : description;

  return { title, description };
}

const InfoRow = ({ label, value }: { label: string; value?: string | number | boolean }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="table-row">
      <strong>{label}</strong>
      <span className="muted">{String(value)}</span>
    </div>
  );
};

const collectPriceEntries = (
  obj: Record<string, unknown>,
  prefix = ""
): { label: string; value: string }[] => {
  const rows: { label: string; value: string }[] = [];
  Object.entries(obj ?? {}).forEach(([key, val]) => {
    const label = prefix ? `${prefix} · ${formatLabel(key)}` : formatLabel(key);
    if (val === null || val === undefined) return;
    if (typeof val === "object" && !Array.isArray(val)) {
      rows.push(...collectPriceEntries(val as Record<string, unknown>, label));
    } else if (Array.isArray(val)) {
      rows.push({ label, value: val.map(String).join(", ") });
    } else if (typeof val === "number") {
      rows.push({ label, value: `€${val.toFixed(2)}` });
    } else if (typeof val === "boolean") {
      rows.push({ label, value: val ? "Available" : "Not available" });
    } else {
      rows.push({ label, value: String(val) });
    }
  });
  return rows;
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="section-title" style={{ marginBottom: 12 }}>
    {children}
  </h2>
);

export default async function SitePage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const site = getSiteById(id);
  if (!site) return notFound();

  const hero =
    site.images?.heroImage?.url ?? site.images?.gallery?.[0]?.url ?? "https://placehold.co/1400x500";

  const address = site.location?.address;
  const coords = site.location?.coordinates;
  const resourceEntries = site.resources ? Object.entries(site.resources) : [];
  const priceRows = site.visitingInformation?.admissionPrices
    ? collectPriceEntries(site.visitingInformation.admissionPrices as Record<string, unknown>)
    : [];
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Sites", href: "/sites" },
    { label: site.name }
  ];

  return (
    <div className="container" style={{ padding: "28px 20px 50px" }}>
      <Breadcrumbs items={breadcrumbs} />
      <div
        className="detail-hero"
        style={{
          background: `url('${hero}') center/cover no-repeat`
        }}
      >
        <div className="detail-hero-content">
          <p className="meta-pill">
            {site.type ? formatLabel(site.type) : "Heritage site"} · {formatLocation(site)}
          </p>
          <h1 style={{ margin: 0, fontSize: "2.4rem", lineHeight: 1.2 }}>{site.name}</h1>
          {site.tagline ? <p style={{ fontSize: "1.05rem", margin: 0 }}>{site.tagline}</p> : null}
          <div className="meta-grid">
            {site.categories?.slice(0, 3).map((cat) => (
              <span key={cat} className="pill">
                {formatLabel(cat)}
              </span>
            ))}
            {site.unescoWorldHeritageSite ? <span className="pill">UNESCO World Heritage</span> : null}
            {site.unescoTentativeList ? <span className="pill">UNESCO Tentative List</span> : null}
          </div>
        </div>
      </div>

      <div className="content-section">
        <SectionTitle>At a glance</SectionTitle>
        <div className="fact-grid">
          <div className="fact-tile">
            <span className="fact-label">Type</span>
            <span className="fact-value">{site.type ? formatLabel(site.type) : "Heritage Site"}</span>
          </div>
          <div className="fact-tile">
            <span className="fact-label">Era</span>
            <span className="fact-value">{site.era ?? "Varied"}</span>
          </div>
          <div className="fact-tile">
            <span className="fact-label">Built</span>
            <span className="fact-value">{site.dateBuilt ?? "—"}</span>
          </div>
          <div className="fact-tile">
            <span className="fact-label">Managed by</span>
            <span className="fact-value">{site.managedBy ?? "Not specified"}</span>
          </div>
        </div>
      </div>

      <div className="content-section two-column">
        <div>
          <SectionTitle>Story</SectionTitle>
          <p className="sub-text" style={{ marginTop: 0 }}>
            {site.description?.short}
          </p>
          {site.description?.full ? <p>{site.description.full}</p> : null}
          {site.description?.history ? (
            <p>
              <strong>History:</strong> {site.description.history}
            </p>
          ) : null}
          {site.description?.significance ? (
            <p>
              <strong>Significance:</strong> {site.description.significance}
            </p>
          ) : null}
          {site.interestingFacts?.length ? (
            <div className="content-section" style={{ marginTop: 14 }}>
              <h3 className="widget-title">Interesting facts</h3>
              <ul className="list-grid">
                {site.interestingFacts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <aside className="aside-card">
          <h3 className="widget-title" style={{ marginBottom: 12 }}>
            Visitor snapshot
          </h3>
          <div className="table-list">
            <InfoRow label="Opening status" value={site.visitingInformation?.openingTimes?.currentStatus} />
            <InfoRow label="Average visit" value={site.visitingInformation?.averageVisitDuration} />
            <InfoRow label="Busy periods" value={site.visitingInformation?.busyPeriods?.join(", ")} />
            <InfoRow label="Weather dependent" value={site.weatherDependent ? "Yes" : "No"} />
            <InfoRow label="Indoor" value={site.indoorActivities ? "Yes" : "No"} />
            <InfoRow label="Outdoor" value={site.outdoorActivities ? "Yes" : "No"} />
          </div>
          {site.visitingInformation?.adviceForVisitors ? (
            <p style={{ marginTop: 12 }}>{site.visitingInformation.adviceForVisitors}</p>
          ) : null}
          {site.visitingInformation?.openingTimes?.seasonal?.length ? (
            <div style={{ marginTop: 12 }}>
              <strong>Seasonal hours</strong>
              <ul className="list-grid" style={{ marginTop: 8 }}>
                {site.visitingInformation.openingTimes.seasonal.map((season) => (
                  <li key={`${season.season}-${season.hours}`}>
                    <div style={{ fontWeight: 700 }}>{season.season}</div>
                    <div className="muted">{season.days}</div>
                    <div className="muted">{season.hours}</div>
                    {season.lastAdmission ? <div className="muted">Last entry: {season.lastAdmission}</div> : null}
                    {season.lastGuidedTour ? (
                      <div className="muted">Last tour: {season.lastGuidedTour}</div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>

      <div className="content-section">
        <SectionTitle>Highlights & Facilities</SectionTitle>
        <div className="two-column">
          <div>
            <h3 className="widget-title">Highlights</h3>
            {site.features?.highlights?.length ? (
              <ul className="list-grid">
                {site.features.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">No highlights listed yet.</p>
            )}
          </div>
          <div>
            <h3 className="widget-title">Facilities</h3>
            {site.features?.facilities?.length ? (
              <ul className="list-grid">
                {site.features.facilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">Facilities information coming soon.</p>
            )}
          </div>
        </div>
        {site.features?.accessibility ? (
          <div className="content-section">
            <h3 className="widget-title">Accessibility</h3>
            <div className="info-grid">
              <div className="data-card">
                <h4>Level</h4>
                <p>{site.features.accessibility.accessibilityLevel ?? "Not specified"}</p>
              </div>
              <div className="data-card">
                <h4>Wheelchair access</h4>
                <p>{site.features.accessibility.wheelchairAccessible ? "Yes" : "Limited"}</p>
              </div>
            </div>
            {site.features.accessibility.restrictions?.length ? (
              <ul className="list-grid" style={{ marginTop: 12 }}>
                {site.features.accessibility.restrictions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {site.features.accessibility.accessibilityNotes ? (
              <p style={{ marginTop: 10 }} className="muted">
                {site.features.accessibility.accessibilityNotes}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="content-section two-column">
        <div>
          <SectionTitle>Tour options</SectionTitle>
          {site.visitingInformation?.tourOptions?.length ? (
            <div className="info-grid">
              {site.visitingInformation.tourOptions.map((tour) => (
                <div key={`${tour.type}-${tour.duration}`} className="data-card">
                  <h4>{tour.type}</h4>
                  <p className="muted">
                    {tour.duration ? `${tour.duration} · ` : ""}
                    {tour.bookingRequired ? "Booking required" : "Walk-in friendly"}
                  </p>
                  {tour.included?.length ? (
                    <ul className="list-grid" style={{ marginTop: 8 }}>
                      {tour.included.map((inc) => (
                        <li key={inc}>{inc}</li>
                      ))}
                    </ul>
                  ) : null}
                  {tour.seasonal ? <p className="muted">Seasonal: {tour.seasonal}</p> : null}
                  {tour.notes ? <p className="muted">{tour.notes}</p> : null}
                  {tour.admission ? <p className="muted">Admission: {tour.admission}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">Tour information to be added.</p>
          )}
        </div>
        <div>
          <SectionTitle>Admission prices</SectionTitle>
          {priceRows.length ? (
            <div className="table-list">
              {priceRows.map((row) => (
                <InfoRow key={`${row.label}-${row.value}`} label={row.label} value={row.value} />
              ))}
            </div>
          ) : (
            <p className="muted">Pricing will be announced soon.</p>
          )}
        </div>
      </div>

      <div className="content-section two-column">
        <div>
          <SectionTitle>Location</SectionTitle>
          <div className="data-card">
            <h4>{address?.street}</h4>
            <p className="muted">
              {[address?.town, address?.county, address?.country].filter(Boolean).join(", ")}
            </p>
            {address?.postcode ? <p className="muted">Postcode: {address.postcode}</p> : null}
            {site.location?.directions ? (
              <div style={{ marginTop: 8 }}>
                {Object.entries(site.location.directions).map(([key, val]) => (
                  <p key={key} className="muted">
                    <strong>{formatLabel(key)}:</strong> {val}
                  </p>
                ))}
              </div>
            ) : null}
            {coords ? (
              <p className="muted">
                Coordinates: {coords.latitude}, {coords.longitude}
              </p>
            ) : null}
          </div>
        </div>
        <div>
          <SectionTitle>Contact & Booking</SectionTitle>
          <div className="info-grid">
            <div className="data-card">
              <h4>Contact</h4>
              {site.contact?.phone ? <p>Phone: {site.contact.phone}</p> : null}
              {site.contact?.email ? (
                <p>
                  Email: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                </p>
              ) : null}
            </div>
            <div className="data-card">
              <h4>Online</h4>
              {site.contact?.website ? (
                <p>
                  <a href={site.contact.website} target="_blank" rel="noreferrer">
                    Official site
                  </a>
                </p>
              ) : null}
              {site.contact?.bookingUrl ? (
                <p>
                  <a href={site.contact.bookingUrl} target="_blank" rel="noreferrer">
                    Book tickets
                  </a>
                </p>
              ) : null}
              {site.contact?.socialMedia
                ? Object.entries(site.contact.socialMedia).map(([network, url]) => (
                    <p key={network}>
                      <a href={url} target="_blank" rel="noreferrer">
                        {formatLabel(network)}
                      </a>
                    </p>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <SectionTitle>Tags & Experiences</SectionTitle>
        <div className="chips" style={{ marginBottom: 12 }}>
          {site.tags?.map((tag) => (
            <Link key={tag} className="chip-link" href={`/tags/${slugifyValue(tag)}`}>
              #{tag}
            </Link>
          ))}
        </div>
        <div className="chips">
          {site.suitableFor?.map((aud) => (
            <Link key={aud} className="chip-link" href={`/audiences/${slugifyValue(aud)}`}>
              {formatLabel(aud)}
            </Link>
          ))}
        </div>
      </div>

      {site.nearbyAttractions?.length ? (
        <div className="content-section">
          <SectionTitle>Nearby attractions</SectionTitle>
          <ul className="list-grid">
            {site.nearbyAttractions.map((item) => (
              <li key={item.name}>
                <div style={{ fontWeight: 700 }}>{item.name}</div>
                <div className="muted">
                  {item.type ? `${formatLabel(item.type)} · ` : ""}
                  {item.distance ?? ""}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {site.images?.gallery?.length ? (
        <div className="content-section">
          <SectionTitle>Gallery</SectionTitle>
          <div className="gallery-grid">
            {site.images.gallery.map((img) => (
              <div key={img.url} className="gallery-tile">
                <Image src={img.url} alt={img.alt ?? site.name} fill sizes="(max-width:768px) 100vw, 33vw" />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {resourceEntries.length ? (
        <div className="content-section">
          <SectionTitle>Resources</SectionTitle>
          <div className="info-grid">
            {resourceEntries.map(([key, val]) => (
              <div key={key} className="data-card">
                <h4>{formatLabel(key)}</h4>
                {Array.isArray(val)
                  ? val.map((resource, idx) => {
                      if (typeof resource === "string") {
                        return (
                          <p key={`${resource}-${idx}`}>
                            <a href={resource} target="_blank" rel="noreferrer">
                              {resource}
                            </a>
                          </p>
                        );
                      }
                      if (typeof resource === "object" && resource !== null) {
                        const label = (resource as { name?: string; type?: string; language?: string }).name;
                        const typeLabel = (resource as { type?: string; language?: string }).type;
                        const url = (resource as { url?: string }).url;
                        return (
                          <p key={url ?? `${label ?? typeLabel ?? key}-${idx}`}>
                            {label ?? typeLabel ?? "Resource"}{" "}
                            {url ? (
                              <>
                                ·{" "}
                                <a href={url} target="_blank" rel="noreferrer">
                                  View
                                </a>
                              </>
                            ) : null}
                          </p>
                        );
                      }
                      return null;
                    })
                  : typeof val === "string"
                  ? val
                  : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
