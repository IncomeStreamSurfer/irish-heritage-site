import type { MetadataRoute } from "next";
import { getAllAudiences, getAllTags, getDataset, getSites } from "@/lib/heritage-data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const { metadata } = getDataset();
  const lastUpdated = metadata?.lastUpdated ?? new Date().toISOString().split("T")[0];

  const entries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: lastUpdated },
    { url: `${baseUrl}/sites`, lastModified: lastUpdated },
    { url: `${baseUrl}/tags`, lastModified: lastUpdated },
    { url: `${baseUrl}/audiences`, lastModified: lastUpdated }
  ];

  getSites().forEach((site) => {
    entries.push({
      url: `${baseUrl}/sites/${site.id}`,
      lastModified: lastUpdated
    });
  });

  getAllTags().forEach((tag) => {
    entries.push({
      url: `${baseUrl}/tags/${tag.slug}`,
      lastModified: lastUpdated
    });
  });

  getAllAudiences().forEach((aud) => {
    entries.push({
      url: `${baseUrl}/audiences/${aud.slug}`,
      lastModified: lastUpdated
    });
  });

  return entries;
}
