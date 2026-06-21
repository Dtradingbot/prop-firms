import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Flame, ExternalLink } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

export const metadata: Metadata = { title: 'Trending Prop Firms' };

async function getTrending() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/firms/trending`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default async function TrendingPage() {
  const firms = await getTrending();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <Flame className="w-7 h-7 text-orange-500" />
        <h1 className="text-3xl font-bold">Trending Prop Firms</h1>
      </div>
      <p className="text-muted-foreground mb-8">The most visited and engaged prop firms this week.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {firms.map((firm: any, idx: number) => (
          <div key={firm.id} className="bg-card border border-border rounded-xl p-5 card-hover flex items-center gap-4">
            <div className={`text-3xl font-black w-10 text-center ${idx < 3 ? 'text-orange-400' : 'text-muted'}`}>
              #{idx + 1}
            </div>
            {firm.logo ? (
              <Image src={firm.logo} alt={firm.name} width={48} height={48} className="rounded-lg border border-border bg-white object-contain shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center font-bold text-orange-500 shrink-0">{firm.name[0]}</div>
            )}
            <div className="flex-1 min-w-0">
              <Link href={`/firms/${firm.slug}`} className="font-semibold hover:text-primary transition-colors">{firm.name}</Link>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                  <span>{formatNumber(firm.clickCount || 0)} visits</span>
                </div>
                {firm.maxFunding && <span>Up to {formatCurrency(firm.maxFunding)}</span>}
              </div>
            </div>
            <Link href={`/go/${firm.slug}`} target="_blank" className="flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 shrink-0">
              Visit <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
