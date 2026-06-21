'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface FirmsFilterProps {
  filters: Record<string, string>;
  onClose: () => void;
}

export function FirmsFilter({ filters, onClose }: FirmsFilterProps) {
  const router = useRouter();

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(filters);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <button onClick={onClose} className="p-1 hover:bg-accent rounded-md"><X className="w-4 h-4" /></button>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Search</label>
        <input
          value={filters.search}
          onChange={e => update('search', e.target.value)}
          placeholder="Firm name..."
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Evaluation Type</label>
        <div className="space-y-2">
          {[['', 'All Types'], ['ONE_STEP', '1-Step'], ['TWO_STEP', '2-Step'], ['INSTANT_FUNDING', 'Instant Funding']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="evalType" value={val} checked={filters.evaluationType === val} onChange={e => update('evaluationType', e.target.value)} className="accent-primary" />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Instant Funding</label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={filters.instantFunding === 'true'} onChange={e => update('instantFunding', e.target.checked ? 'true' : '')} className="accent-primary" />
          <span className="text-sm">Instant Funding Only</span>
        </label>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Min Funding ($)</label>
        <select
          value={filters.minFunding}
          onChange={e => update('minFunding', e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none"
        >
          <option value="">Any</option>
          <option value="10000">$10K+</option>
          <option value="50000">$50K+</option>
          <option value="100000">$100K+</option>
          <option value="200000">$200K+</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Country</label>
        <input
          value={filters.country}
          onChange={e => update('country', e.target.value)}
          placeholder="e.g. UK, US..."
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        onClick={() => router.push('/firms')}
        className="w-full py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
