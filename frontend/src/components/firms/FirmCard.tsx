'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Shield, Zap, ExternalLink, GitCompare, Tag } from 'lucide-react';
import { PropFirm } from '@/types';
import { cn, formatCurrency, getAffiliateUrl } from '@/lib/utils';

interface FirmCardProps {
  firm: PropFirm;
  onCompare?: (slug: string) => void;
  isCompared?: boolean;
}

const evalLabels: Record<string, string> = {
  ONE_STEP: '1-Step',
  TWO_STEP: '2-Step',
  THREE_STEP: '3-Step',
  INSTANT_FUNDING: 'Instant',
};

export function FirmCard({ firm, onCompare, isCompared }: FirmCardProps) {
  const offer = (firm.offers as any)?.[0];

  return (
    <div className={cn('bg-card border border-border rounded-xl p-5 card-hover flex flex-col gap-4', isCompared && 'ring-2 ring-primary')}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {firm.logo ? (
            <Image src={firm.logo} alt={firm.name} width={48} height={48} className="rounded-lg object-contain border border-border bg-white" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {firm.name[0]}
            </div>
          )}
          <div>
            <Link href={`/firms/${firm.slug}`} className="font-semibold hover:text-primary transition-colors line-clamp-1">
              {firm.name}
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5">
              {firm.isVerified && <Shield className="w-3 h-3 text-blue-500" />}
              {firm.instantFunding && <Zap className="w-3 h-3 text-yellow-500" />}
              {firm.evaluationType && (
                <span className="text-xs px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                  {evalLabels[firm.evaluationType]}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 justify-end">
            <Star className="w-4 h-4 fill-gold text-gold" />
            <span className="font-semibold text-sm">{firm.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">({firm.reviewCount})</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-muted rounded-lg p-2.5">
          <p className="text-xs text-muted-foreground">Max Funding</p>
          <p className="font-semibold text-sm">{firm.maxFunding ? formatCurrency(firm.maxFunding) : 'N/A'}</p>
        </div>
        <div className="bg-muted rounded-lg p-2.5">
          <p className="text-xs text-muted-foreground">Profit Split</p>
          <p className="font-semibold text-sm text-green-600">
            {firm.profitSplit ? `${firm.profitSplit}%` : 'N/A'}
            {firm.maxProfitSplit && firm.maxProfitSplit !== firm.profitSplit ? ` – ${firm.maxProfitSplit}%` : ''}
          </p>
        </div>
        <div className="bg-muted rounded-lg p-2.5">
          <p className="text-xs text-muted-foreground">Max Drawdown</p>
          <p className="font-semibold text-sm text-red-500">{firm.maxDrawdown ? `${firm.maxDrawdown}%` : 'N/A'}</p>
        </div>
        <div className="bg-muted rounded-lg p-2.5">
          <p className="text-xs text-muted-foreground">Trust Score</p>
          <p className="font-semibold text-sm">{firm.trustScore.toFixed(1)}/10</p>
        </div>
      </div>

      {/* Broker & Platform */}
      {firm.broker && (
        <div className="text-xs text-muted-foreground">
          Broker: <span className="font-medium text-foreground">{firm.broker.name}</span>
        </div>
      )}

      {/* Offer Badge */}
      {offer && (
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
          <Tag className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs text-green-700 dark:text-green-400 font-medium">
            {offer.discount && `${offer.discount}% OFF`} {offer.couponCode && `• Code: ${offer.couponCode}`}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        <Link href={getAffiliateUrl(firm.slug)} target="_blank" className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          Visit Firm <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        {onCompare && (
          <button
            onClick={() => onCompare(firm.slug)}
            className={cn('px-3 py-2 rounded-lg border text-sm font-medium transition-colors', isCompared ? 'bg-primary/10 border-primary text-primary' : 'border-border hover:bg-accent')}
          >
            <GitCompare className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
