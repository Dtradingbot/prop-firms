'use client';

import Link from 'next/link';
import { X, GitCompare } from 'lucide-react';

interface CompareBarProps {
  slugs: string[];
  onRemove: (slug: string) => void;
  onClear: () => void;
}

export function CompareBar({ slugs, onRemove, onClear }: CompareBarProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border shadow-xl">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <GitCompare className="w-5 h-5 text-primary shrink-0" />
          <span className="text-sm font-medium shrink-0">Compare ({slugs.length}/4):</span>
          <div className="flex flex-wrap gap-2">
            {slugs.map(slug => (
              <span key={slug} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                {slug}
                <button onClick={() => onRemove(slug)}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onClear} className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-accent">Clear</button>
          {slugs.length >= 2 && (
            <Link href={`/compare?slugs=${slugs.join(',')}`} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
              Compare Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
