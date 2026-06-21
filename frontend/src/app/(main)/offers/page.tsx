'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tag, Copy, ExternalLink, Clock } from 'lucide-react';
import { offersApi } from '@/lib/api';
import { Offer } from '@/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    offersApi.getAll().then(({ data }) => setOffers(data.data)).finally(() => setLoading(false));
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code "${code}" copied!`);
  };

  const handleClaim = async (offer: Offer) => {
    const { data } = await offersApi.click(offer.id);
    if (data.url) window.open(data.url, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Tag className="w-7 h-7 text-green-500" />
        <h1 className="text-3xl font-bold">Prop Firm Offers & Discounts</h1>
      </div>
      <p className="text-muted-foreground mb-8">Exclusive coupon codes and limited-time deals from top prop firms.</p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map(offer => (
            <div key={offer.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{offer.firm?.name}</span>
                  {offer.discount && <span className="text-2xl font-black">{offer.discount}% OFF</span>}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold">{offer.title}</h3>
                {offer.description && <p className="text-sm text-muted-foreground">{offer.description}</p>}
                {offer.expiresAt && (
                  <div className="flex items-center gap-1.5 text-xs text-orange-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Expires: {formatDate(offer.expiresAt)}</span>
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  {offer.couponCode && (
                    <button onClick={() => copyCode(offer.couponCode!)} className="flex items-center gap-2 flex-1 px-3 py-2.5 bg-muted border border-dashed border-border rounded-lg text-sm font-mono hover:bg-accent transition-colors">
                      <Tag className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="flex-1 text-left truncate">{offer.couponCode}</span>
                      <Copy className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    </button>
                  )}
                  <button onClick={() => handleClaim(offer)} className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 whitespace-nowrap">
                    Claim <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
