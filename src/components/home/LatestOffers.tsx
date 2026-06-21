'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tag, Copy, ExternalLink, ArrowRight } from 'lucide-react';
import { offersApi } from '@/lib/api';
import { Offer } from '@/types';
import toast from 'react-hot-toast';

export function LatestOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    offersApi.getAll().then(({ data }) => setOffers(data.data)).finally(() => setLoading(false));
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code "${code}" copied!`);
  };

  const handleClick = async (offer: Offer) => {
    const { data } = await offersApi.click(offer.id);
    if (data.url) window.open(data.url, '_blank');
  };

  if (!loading && offers.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl md:text-3xl font-bold">Latest Offers & Discounts</h2>
            </div>
            <p className="text-muted-foreground">Exclusive discount codes for prop traders</p>
          </div>
          <Link href="/offers" className="flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all">
            All offers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [...Array(6)].map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)
          ) : (
            offers.slice(0, 6).map(offer => (
              <div key={offer.id} className="bg-card border border-border rounded-xl p-4 hover:border-green-300 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    {offer.firm && <p className="text-xs text-muted-foreground font-medium">{offer.firm.name}</p>}
                    <h3 className="font-semibold mt-0.5 text-sm">{offer.title}</h3>
                  </div>
                  {offer.discount && (
                    <span className="shrink-0 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold rounded-full">
                      {offer.discount}% OFF
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {offer.couponCode && (
                    <button
                      onClick={() => copyCode(offer.couponCode!)}
                      className="flex items-center gap-1.5 flex-1 px-3 py-2 bg-muted border border-dashed border-border rounded-lg text-sm font-mono hover:bg-accent transition-colors"
                    >
                      <span className="flex-1 text-left">{offer.couponCode}</span>
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  )}
                  <button
                    onClick={() => handleClick(offer)}
                    className="flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                  >
                    Claim <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
