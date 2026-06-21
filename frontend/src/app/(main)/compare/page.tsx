'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, X, CheckCircle, XCircle } from 'lucide-react';
import { firmsApi } from '@/lib/api';
import { PropFirm } from '@/types';
import { formatCurrency } from '@/lib/utils';

const compareFields = [
  { key: 'maxFunding', label: 'Max Funding', format: (v: any) => v ? formatCurrency(v) : 'N/A', color: (v: any, all: any[]) => v === Math.max(...all.filter(Boolean)) ? 'text-green-600 font-bold' : '' },
  { key: 'profitSplit', label: 'Profit Split (%)', format: (v: any) => v ? `${v}%` : 'N/A', color: (v: any, all: any[]) => v === Math.max(...all.filter(Boolean)) ? 'text-green-600 font-bold' : '' },
  { key: 'maxDrawdown', label: 'Max Drawdown (%)', format: (v: any) => v ? `${v}%` : 'N/A', color: (v: any, all: any[]) => v === Math.min(...all.filter(Boolean)) ? 'text-green-600 font-bold' : '' },
  { key: 'dailyDrawdown', label: 'Daily Drawdown (%)', format: (v: any) => v ? `${v}%` : 'N/A', color: () => '' },
  { key: 'rating', label: 'Rating', format: (v: any) => v ? v.toFixed(1) : 'N/A', color: (v: any, all: any[]) => v === Math.max(...all.filter(Boolean)) ? 'text-green-600 font-bold' : '' },
  { key: 'trustScore', label: 'Trust Score', format: (v: any) => v ? `${v}/10` : 'N/A', color: () => '' },
  { key: 'evaluationType', label: 'Evaluation Type', format: (v: any) => v ? v.replace(/_/g, ' ') : 'N/A', color: () => '' },
  { key: 'instantFunding', label: 'Instant Funding', format: (v: any) => v ? '✓' : '✗', color: (v: any) => v ? 'text-green-600' : 'text-red-500' },
  { key: 'scalingPlan', label: 'Scaling Plan', format: (v: any) => v ? '✓' : '✗', color: (v: any) => v ? 'text-green-600' : 'text-red-500' },
  { key: 'payoutFrequency', label: 'Payout Frequency', format: (v: any) => v || 'N/A', color: () => '' },
];

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [firms, setFirms] = useState<(PropFirm | null)[]>([null, null, null, null]);
  const [loadedFirms, setLoadedFirms] = useState<PropFirm[]>([]);
  const [slugInput, setSlugInput] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const slugs = searchParams.get('slugs')?.split(',').filter(Boolean) || [];
    if (slugs.length > 0) loadFirms(slugs);
  }, [searchParams]);

  const loadFirms = async (slugs: string[]) => {
    const results = await Promise.all(slugs.slice(0, 4).map(slug => firmsApi.getBySlug(slug).then(r => r.data.data).catch(() => null)));
    setLoadedFirms(results.filter(Boolean) as PropFirm[]);
  };

  const addFirm = async () => {
    if (!slugInput) return;
    setSearching(true);
    try {
      const { data } = await firmsApi.getBySlug(slugInput.trim());
      if (data.data) setLoadedFirms(prev => [...prev, data.data].slice(0, 4));
    } catch { }
    setSlugInput('');
    setSearching(false);
  };

  const removeFirm = (idx: number) => {
    setLoadedFirms(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Compare Prop Firms</h1>
      <p className="text-muted-foreground mb-8">Select up to 4 prop firms to compare side by side.</p>

      {/* Add Firm */}
      <div className="flex gap-3 mb-8 max-w-lg">
        <input
          value={slugInput}
          onChange={e => setSlugInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addFirm()}
          placeholder="Enter firm slug (e.g. ftmo)..."
          className="flex-1 px-4 py-2.5 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
        <button onClick={addFirm} disabled={searching || loadedFirms.length >= 4} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {loadedFirms.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>Add firms above to start comparing.</p>
          <p className="mt-2 text-sm">Or <Link href="/firms" className="text-primary hover:underline">browse all firms</Link> and use the compare button.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 bg-muted rounded-tl-xl text-sm font-semibold w-48">Criteria</th>
                {loadedFirms.map((firm, idx) => (
                  <th key={firm.id} className="py-3 px-4 bg-muted text-center text-sm font-semibold">
                    <div className="flex items-center justify-between gap-2">
                      <Link href={`/firms/${firm.slug}`} className="hover:text-primary">{firm.name}</Link>
                      <button onClick={() => removeFirm(idx)} className="p-0.5 hover:bg-destructive/10 rounded"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    </div>
                  </th>
                ))}
                {loadedFirms.length < 4 && (
                  <th className="py-3 px-4 bg-muted text-center text-muted-foreground text-sm rounded-tr-xl">
                    + Add Firm
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {compareFields.map(field => {
                const values = loadedFirms.map(f => (f as any)[field.key]);
                return (
                  <tr key={field.key} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-muted-foreground">{field.label}</td>
                    {values.map((val, idx) => (
                      <td key={idx} className={`py-3 px-4 text-sm text-center ${field.color(val, values)}`}>
                        {field.format(val)}
                      </td>
                    ))}
                    {loadedFirms.length < 4 && <td />}
                  </tr>
                );
              })}
              <tr className="bg-muted/20">
                <td className="py-3 px-4 text-sm font-medium">Broker</td>
                {loadedFirms.map(firm => (
                  <td key={firm.id} className="py-3 px-4 text-sm text-center">{firm.broker?.name || 'N/A'}</td>
                ))}
                {loadedFirms.length < 4 && <td />}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium">Platforms</td>
                {loadedFirms.map(firm => (
                  <td key={firm.id} className="py-3 px-4 text-sm text-center">
                    {firm.platforms?.map(p => p.platform.name).join(', ') || 'N/A'}
                  </td>
                ))}
                {loadedFirms.length < 4 && <td />}
              </tr>
              <tr>
                <td className="py-3 px-4 rounded-bl-xl" />
                {loadedFirms.map(firm => (
                  <td key={firm.id} className="py-4 px-4 text-center">
                    <Link href={`/go/${firm.slug}`} target="_blank" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                      Visit Firm
                    </Link>
                  </td>
                ))}
                {loadedFirms.length < 4 && <td className="rounded-br-xl" />}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
