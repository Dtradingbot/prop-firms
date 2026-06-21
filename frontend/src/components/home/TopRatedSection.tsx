'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight, Trophy } from 'lucide-react';
import { firmsApi } from '@/lib/api';
import { PropFirm } from '@/types';
import { formatCurrency } from '@/lib/utils';

export function TopRatedSection() {
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firmsApi.getTopRated().then(({ data }) => setFirms(data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-6 h-6 text-gold" />
              <h2 className="text-2xl md:text-3xl font-bold">Top Rated Firms</h2>
            </div>
            <p className="text-muted-foreground">Based on verified trader reviews</p>
          </div>
          <Link href="/top-rated" className="flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {firms.slice(0, 8).map((firm, idx) => (
                <div key={firm.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                  <span className={`w-8 text-center font-bold text-lg ${idx < 3 ? 'text-gold' : 'text-muted-foreground'}`}>
                    #{idx + 1}
                  </span>
                  {firm.logo ? (
                    <Image src={firm.logo} alt={firm.name} width={40} height={40} className="rounded-lg border border-border bg-white object-contain" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {firm.name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link href={`/firms/${firm.slug}`} className="font-semibold hover:text-primary transition-colors">
                      {firm.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{firm.reviewCount} reviews</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Funding</p>
                      <p className="font-medium">{firm.maxFunding ? formatCurrency(firm.maxFunding) : 'N/A'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Split</p>
                      <p className="font-medium text-green-600">{firm.profitSplit}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gold/10 rounded-lg px-2.5 py-1.5">
                    <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                    <span className="font-bold text-sm">{firm.rating?.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
