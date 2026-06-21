import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Trophy, Shield, ExternalLink } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Top Rated Prop Firms',
  description: 'The highest rated prop trading firms based on verified trader reviews and trust scores.',
};

async function getTopRated() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/firms/top-rated`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default async function TopRatedPage() {
  const firms = await getTopRated();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <Trophy className="w-8 h-8 text-gold" />
        <h1 className="text-3xl font-bold">Top Rated Prop Firms</h1>
      </div>
      <p className="text-muted-foreground mb-8">Rankings based on verified trader reviews and overall trust scores.</p>

      <div className="space-y-3">
        {firms.map((firm: any, idx: number) => (
          <div key={firm.id} className="bg-card border border-border rounded-xl p-5 flex items-center gap-5 hover:shadow-md transition-all">
            <div className={`text-3xl font-black w-12 text-center ${idx < 3 ? 'text-gold' : 'text-muted'}`}>
              #{idx + 1}
            </div>
            {idx < 3 && (
              <Trophy className={`w-6 h-6 ${idx === 0 ? 'text-gold' : idx === 1 ? 'text-gray-400' : 'text-amber-600'}`} />
            )}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {firm.logo ? (
                <Image src={firm.logo} alt={firm.name} width={48} height={48} className="rounded-lg border border-border bg-white object-contain shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">{firm.name[0]}</div>
              )}
              <div>
                <Link href={`/firms/${firm.slug}`} className="font-semibold hover:text-primary transition-colors">{firm.name}</Link>
                <div className="flex items-center gap-2 mt-0.5">
                  {firm.isVerified && <Shield className="w-3.5 h-3.5 text-blue-500" />}
                  <span className="text-xs text-muted-foreground">{firm.reviewCount} reviews</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Funding</p>
                <p className="font-semibold">{firm.maxFunding ? formatCurrency(firm.maxFunding) : 'N/A'}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Split</p>
                <p className="font-semibold text-green-600">{firm.profitSplit}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Trust</p>
                <p className="font-semibold">{firm.trustScore?.toFixed(1)}/10</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 bg-gold/10 rounded-lg px-3 py-1.5">
                <Star className="w-4 h-4 fill-gold text-gold" />
                <span className="font-bold">{firm.rating?.toFixed(1)}</span>
              </div>
              <Link href={`/go/${firm.slug}`} target="_blank" className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                Visit <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
