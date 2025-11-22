import fs from "node:fs";
import path from "node:path";
import { HeritageDataset, HeritageSite } from "./heritage-schema";

const sitesDirectory = path.join(process.cwd(), "sites");

type TagWithMeta = { tag: string; slug: string; count: number };
type AudienceWithMeta = { audience: string; slug: string; count: number };

let cachedDataset: HeritageDataset | null = null;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const readSiteFile = (filePath: string): HeritageSite | null => {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(content) as HeritageSite;
    return parsed?.id ? parsed : null;
  } catch (error) {
    console.warn(`Failed to parse site file ${filePath}`, error);
    return null;
  }
};

const loadDataset = (): HeritageDataset => {
  if (cachedDataset) return cachedDataset;

  const files = fs.existsSync(sitesDirectory)
    ? fs.readdirSync(sitesDirectory).filter((file) => file.endsWith(".json"))
    : [];

  const sites: HeritageSite[] = [];
  let latestMtime = 0;

  files.forEach((file) => {
    const fullPath = path.join(sitesDirectory, file);
    const stat = fs.statSync(fullPath);
    latestMtime = Math.max(latestMtime, stat.mtimeMs);
    const site = readSiteFile(fullPath);
    if (site) sites.push(site);
  });

  cachedDataset = {
    sites,
    metadata: {
      totalSites: sites.length,
      lastUpdated: new Date(latestMtime || Date.now()).toISOString().split("T")[0],
      schemaVersion: "sites-directory",
      dataSource: "Local /sites JSON collection"
    }
  };

  return cachedDataset;
};

const scoreSite = (site: HeritageSite) => {
  const heroWeight = site.images?.heroImage ? 8 : 0;
  const highlightScore = site.features?.highlights?.length ?? 0;
  const tagScore = Math.round((site.tags?.length ?? 0) * 0.6);
  const categoryScore = Math.round((site.categories?.length ?? 0) * 0.8);
  const eraScore = site.era ? 1 : 0;
  const taglineScore = site.tagline ? 1 : 0;
  return heroWeight + highlightScore + tagScore + categoryScore + eraScore + taglineScore;
};

const dataset = () => loadDataset();

export const getDataset = () => dataset();

export const getSites = () => dataset().sites;

export const getSiteById = (id: string) => dataset().sites.find((site) => site.id === id);

export const getFeaturedSite = () => [...dataset().sites].sort((a, b) => scoreSite(b) - scoreSite(a)).at(0);

export const getCategoryCounts = () => {
  const counts = new Map<string, number>();

  dataset().sites.forEach((site) => {
    const categories = site.categories?.length ? site.categories : site.type ? [site.type] : [];
    categories.forEach((category) => counts.set(category, (counts.get(category) ?? 0) + 1));
  });

  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
};

export const getTopTags = (limit = 10): TagWithMeta[] => {
  const tags = new Map<string, number>();

  dataset().sites.forEach((site) => {
    site.tags?.forEach((tag) => tags.set(tag, (tags.get(tag) ?? 0) + 1));
  });

  return Array.from(tags.entries())
    .map(([tag, count]) => ({ tag, slug: slugify(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, limit);
};

export const getTopAudiences = (limit = 10): AudienceWithMeta[] => {
  const audiences = new Map<string, number>();
  dataset().sites.forEach((site) => {
    site.suitableFor?.forEach((aud) => audiences.set(aud, (audiences.get(aud) ?? 0) + 1));
  });

  return Array.from(audiences.entries())
    .map(([audience, count]) => ({ audience, slug: slugify(audience), count }))
    .sort((a, b) => b.count - a.count || a.audience.localeCompare(b.audience))
    .slice(0, limit);
};

export const getDatasetInsights = () => {
  const countySet = new Set<string>();
  const eraSet = new Set<string>();
  const managerSet = new Set<string>();
  const suitabilitySet = new Set<string>();
  const types = new Set<string>();

  dataset().sites.forEach((site) => {
    if (site.location?.address?.county) countySet.add(site.location.address.county);
    if (site.era) eraSet.add(site.era);
    if (site.managedBy) managerSet.add(site.managedBy);
    site.suitableFor?.forEach((group) => suitabilitySet.add(group));
    if (site.type) types.add(site.type);
  });

  return {
    totalSites: dataset().metadata?.totalSites ?? dataset().sites.length,
    uniqueCounties: countySet.size,
    erasRepresented: eraSet.size,
    managingBodies: managerSet.size,
    experienceTypes: types.size,
    audienceSegments: suitabilitySet.size
  };
};

export const getSeasonalAccess = () =>
  dataset()
    .sites.map((site) => ({
      id: site.id,
      name: site.name,
      currentStatus: site.visitingInformation?.openingTimes?.currentStatus,
      specialClosures: site.visitingInformation?.openingTimes?.specialClosures ?? [],
      busyPeriods: site.visitingInformation?.busyPeriods ?? [],
      guidedTours:
        site.visitingInformation?.tourOptions?.filter((tour) => tour.bookingRequired)?.length ?? 0,
      heroImage: site.images?.heroImage,
      county: site.location?.address?.county,
      era: site.era
    }))
    .filter((entry) => entry.currentStatus || entry.specialClosures.length || entry.busyPeriods.length);

export const getPreviewSites = (limit = 6) =>
  [...dataset().sites]
    .sort((a, b) => scoreSite(b) - scoreSite(a))
    .slice(0, limit);

export const heritageMetadata = () => dataset().metadata ?? {};

export const getSiteScore = scoreSite;

export const getRegions = () => {
  const regionSet = new Set<string>();
  dataset().sites.forEach((site) => {
    const address = site.location?.address;
    if (address?.region) regionSet.add(address.region);
    if (address?.county) regionSet.add(address.county);
  });
  return Array.from(regionSet).sort((a, b) => a.localeCompare(b));
};

export const getAllTags = (): TagWithMeta[] => getTopTags(Number.MAX_SAFE_INTEGER);

export const getAllAudiences = (): AudienceWithMeta[] => getTopAudiences(Number.MAX_SAFE_INTEGER);

export const getSitesByTagSlug = (tagSlug: string) =>
  dataset().sites.filter((site) => site.tags?.some((tag) => slugify(tag) === tagSlug));

export const getSitesByAudienceSlug = (audienceSlug: string) =>
  dataset().sites.filter((site) => site.suitableFor?.some((aud) => slugify(aud) === audienceSlug));

export const formatLabel = (label: string) =>
  label
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());

export const slugifyValue = slugify;

export const formatLocation = (site: HeritageSite) =>
  site.location?.address?.county ??
  site.location?.address?.region ??
  site.location?.address?.town ??
  "Ireland";
