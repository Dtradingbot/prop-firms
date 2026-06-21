import Image from 'next/image';
import { Shield } from 'lucide-react';
import { Review } from '@/types';
import { StarRating } from '@/components/ui/StarRating';
import { formatDate, getInitials } from '@/lib/utils';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {review.user?.avatar ? (
            <Image src={review.user.avatar} alt={review.user.name || ''} width={40} height={40} className="rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {getInitials(review.user?.name || 'U')}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm">{review.user?.name || 'Anonymous'}</span>
              {review.isVerified && <Shield className="w-3.5 h-3.5 text-blue-500" title="Verified Trader" />}
            </div>
            <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating value={Math.round(review.rating)} readonly size="sm" />
      </div>
      {review.title && <h4 className="font-semibold mb-2">{review.title}</h4>}
      <p className="text-sm text-muted-foreground leading-relaxed">{review.body}</p>
      {review.proofImage && (
        <div className="mt-3">
          <Image src={review.proofImage} alt="Proof" width={200} height={120} className="rounded-lg border border-border object-cover" />
        </div>
      )}
    </div>
  );
}
