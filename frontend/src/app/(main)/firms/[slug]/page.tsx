import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FirmDetailClient } from './FirmDetailClient';

async function getFirm(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/firms/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const firm = await getFirm(params.slug);
  if (!firm) return {};
  return {
    title: firm.metaTitle || `${firm.name} Review & Details`,
    description: firm.metaDescription || firm.shortDescription || `Complete review of ${firm.name}. See funding, profit splits, rules and trader reviews.`,
    openGraph: { title: firm.name, description: firm.shortDescription, images: firm.logo ? [firm.logo] : [] },
  };
}

export default async function FirmPage({ params }: { params: { slug: string } }) {
  const firm = await getFirm(params.slug);
  if (!firm) notFound();
  return <FirmDetailClient firm={firm} />;
}
