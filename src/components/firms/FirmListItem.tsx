'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Shield, Zap, ExternalLink, GitCompare } from 'lucide-react';
import { PropFirm } from '@/types';
import { cn, formatCurrency, getAffiliateUrl } from '@/lib/utils';

interface FirmListItemProps {
  firm: PropFirm;
  onCompare?: (slug: string) => void;
  isCompared?: boolean;
}

export function FirmListItem({ firm, onCompare, isCompared }: FirmListItemProps) {
  return (
    <div className={cn('bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all flex items-center gap-4', isCompared && 'ring-2 ring-primary')}>
      {firm.logo ? (
        <Image src={firm.logo} alt={firm.name} width={52} height={52} className="rounded-lg border border-border object-contain bg-white shrink-0" />
      ) : (
        <div className="w-13 h-13 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-xl shrink-0 w-[52px] h-[52px]">
          {firm.name[0]}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/firms/${firm.slug}`} className="font-semibold hover:text-primary transition-colors">{firm.name}</Link>
          {firm.isVerified && <Shield className="w-3.5 h-3.5 text-blue-500" />}
          {firm.instantFunding && <Zap className="w-3.5 h-3.5 text-yellow-500" />}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{firm.shortDescription}</p>
      </div>

      <div className="hidden md:flex items-center gap-6 text-sm shrink-0">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Max Funding</p>
          <p className="font-semibold">{firm.maxFunding ? formatCurrency(firm.maxFunding) : 'N/A'}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Split</p>
          <p className="font-semibold text-green-600">{firm.profitSplit || 'N/A'}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Drawdown</p>
          <p className="font-semibold text-red-500">{firm.maxDrawdown || 'N/A'}%</p>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-gold text-gold" />
          <span className="font-semibold">{firm.rating.toFixed(1)}</span>
          <span className="text-muted-foreground text-xs">({firm.reviewCount})</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onCompare && (
          <button onClick={() => onCompare(firm.slug)} className={cn('p-2 rounded-lg border transition-colors', isCompared ? 'bg-primary/10 border-primary' : 'border-border hover:bg-accent')}>
            <GitCompare className="w-4 h-4" />
          </button>
        )}
        <Link href={getAffiliateUrl(firm.slug)} target="_blank" className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          Visit <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
