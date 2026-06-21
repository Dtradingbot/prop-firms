'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, ArrowRight, Flame } from 'lucide-react';
import { firmsApi } from '@/lib/api';
import { PropFirm } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';

export function TrendingSection() {
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firmsApi.getTrending().then(({ data }) => setFirms(data.data)).finally(() => setLoading(false));
  }, []);

  if (!loading && firms.length === 0) return null;

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
          </div>
          <p className="text-muted-foreground">Most visited firms this week</p>
        </div>
        <Link href="/trending" className="flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all">
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />)
        ) : (
          firms.slice(0, 4).map((firm, idx) => (
            <Link key={firm.id} href={`/firms/${firm.slug}`} className="group bg-card border border-border rounded-xl p-4 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-black text-orange-200 dark:text-orange-900">#{idx + 1}</span>
                {firm.logo ? (
                  <Image src={firm.logo} alt={firm.name} width={36} height={36} className="rounded-lg border border-border object-contain bg-white" />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                    {firm.name[0]}
                  </div>
                )}
              </div>
              <h3 className="font-semibold group-hover:text-primary transition-colors mb-1">{firm.name}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 text-orange-500" />
                <span>{formatNumber(firm.clickCount || 0)} visits</span>
              </div>
              {firm.maxFunding && (
                <p className="text-sm font-medium mt-2">Up to {formatCurrency(firm.maxFunding)}</p>
              )}
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
