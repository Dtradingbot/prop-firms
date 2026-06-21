'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';
import { firmsApi } from '@/lib/api';
import { PropFirm } from '@/types';
import { FirmCard } from '@/components/firms/FirmCard';
import { FirmListItem } from '@/components/firms/FirmListItem';
import { FirmsFilter } from '@/components/firms/FirmsFilter';
import { CompareBar } from '@/components/firms/CompareBar';

export default function FirmsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [compared, setCompared] = useState<string[]>([]);

  const filters = {
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'rating',
    evaluationType: searchParams.get('evaluationType') || '',
    instantFunding: searchParams.get('instantFunding') || '',
    broker: searchParams.get('broker') || '',
    platform: searchParams.get('platform') || '',
    minFunding: searchParams.get('minFunding') || '',
    country: searchParams.get('country') || '',
  };

  const fetchFirms = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit: 20 };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await firmsApi.getAll(params);
      setFirms(data.data);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [searchParams, page]);

  useEffect(() => { fetchFirms(); }, [fetchFirms]);

  const toggleCompare = (slug: string) => {
    setCompared(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : prev.length < 4 ? [...prev, slug] : prev);
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'rating').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Prop Firms</h1>
        <p className="text-muted-foreground mt-1">{total} firms found</p>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <select
            value={filters.sort}
            onChange={e => router.push(`?${new URLSearchParams({ ...filters, sort: e.target.value }).toString()}`)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviews</option>
            <option value="trending">Trending</option>
            <option value="newest">Newest</option>
            <option value="funding">Highest Funding</option>
          </select>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {filterOpen && (
          <div className="w-64 shrink-0">
            <FirmsFilter filters={filters} onClose={() => setFilterOpen(false)} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-72 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : firms.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No firms found matching your filters.</p>
              <button onClick={() => router.push('/firms')} className="mt-4 text-primary hover:underline">Clear all filters</button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {firms.map(firm => (
                <FirmCard key={firm.id} firm={firm} onCompare={toggleCompare} isCompared={compared.includes(firm.slug)} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {firms.map(firm => (
                <FirmListItem key={firm.id} firm={firm} onCompare={toggleCompare} isCompared={compared.includes(firm.slug)} />
              ))}
            </div>
          )}

          {total > 20 && (
            <div className="flex justify-center gap-2 mt-10">
              {[...Array(Math.ceil(total / 20))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-accent'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {compared.length > 0 && (
        <CompareBar slugs={compared} onRemove={toggleCompare} onClear={() => setCompared([])} />
      )}
    </div>
  );
}
