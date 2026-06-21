'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { firmsApi } from '@/lib/api';
import { PropFirm } from '@/types';
import { FirmCard } from '@/components/firms/FirmCard';

export function FeaturedFirms() {
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firmsApi.getFeatured().then(({ data }) => setFirms(data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Featured Prop Firms</h2>
          <p className="text-muted-foreground mt-1">Hand-picked top-tier trading firms</p>
        </div>
        <Link href="/firms" className="flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all">
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 h-72 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {firms.map(firm => <FirmCard key={firm.id} firm={firm} />)}
        </div>
      )}
    </section>
  );
}
