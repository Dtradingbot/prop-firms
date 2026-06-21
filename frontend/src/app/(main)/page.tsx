import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedFirms } from '@/components/home/FeaturedFirms';
import { TopRatedSection } from '@/components/home/TopRatedSection';
import { TrendingSection } from '@/components/home/TrendingSection';
import { LatestOffers } from '@/components/home/LatestOffers';
import { ComparisonCTA } from '@/components/home/ComparisonCTA';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { StatsBar } from '@/components/home/StatsBar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PropFirmHub - #1 Prop Trading Firm Directory & Comparison',
  description: 'Compare 100+ prop trading firms. Find the best profit splits, funding sizes, and exclusive discount codes. Start your funded trading journey today.',
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <StatsBar />
      <FeaturedFirms />
      <TopRatedSection />
      <ComparisonCTA />
      <TrendingSection />
      <LatestOffers />
      <NewsletterSection />
    </>
  );
}
