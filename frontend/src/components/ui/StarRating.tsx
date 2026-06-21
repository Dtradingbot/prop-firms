'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6' };

export function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn('transition-colors', !readonly && 'cursor-pointer hover:scale-110')}
        >
          <Star className={cn(sizes[size], star <= value ? 'fill-gold text-gold' : 'text-muted-foreground')} />
        </button>
      ))}
    </div>
  );
}
