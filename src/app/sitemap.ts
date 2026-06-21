import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://propfirmhub.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/firms`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/top-rated`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/offers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/brokers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ];

  try {
    const [firmsRes, brokersRes, postsRes] = await Promise.all([
      fetch(`${API_URL}/api/firms?limit=500`).then(r => r.json()),
      fetch(`${API_URL}/api/brokers`).then(r => r.json()),
      fetch(`${API_URL}/api/blog?limit=500`).then(r => r.json()),
    ]);

    const firmPages = firmsRes.data?.map((f: any) => ({ url: `${BASE_URL}/firms/${f.slug}`, lastModified: new Date(f.updatedAt), changeFrequency: 'weekly' as const, priority: 0.7 })) || [];
    const brokerPages = brokersRes.data?.map((b: any) => ({ url: `${BASE_URL}/brokers/${b.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })) || [];
    const blogPages = postsRes.data?.map((p: any) => ({ url: `${BASE_URL}/blog/${p.slug}`, lastModified: new Date(p.publishedAt || p.createdAt), changeFrequency: 'monthly' as const, priority: 0.6 })) || [];

    return [...staticPages, ...firmPages, ...brokerPages, ...blogPages];
  } catch {
    return staticPages;
  }
}
