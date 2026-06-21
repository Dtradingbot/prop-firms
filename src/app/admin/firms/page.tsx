'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminFirmsPage() {
  const [firms, setFirms] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editFirm, setEditFirm] = useState<any>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getFirms({ page, limit: 20, search });
      setFirms(data.data);
      setTotal(data.total);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page, search]);

  const deleteFirm = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This is permanent.`)) return;
    try {
      await adminApi.deleteFirm(id);
      toast.success('Firm deleted');
      fetch();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Prop Firms</h1>
        <Link href="/admin/firms/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Firm
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search firms..." className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm w-full bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30 text-left"><th className="px-4 py-3">Firm</th><th className="px-4 py-3">Funding</th><th className="px-4 py-3">Split</th><th className="px-4 py-3">Rating</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody className="divide-y divide-border">
              {firms.map(firm => (
                <tr key={firm.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {firm.logo && <Image src={firm.logo} alt={firm.name} width={32} height={32} className="rounded border border-border bg-white object-contain" />}
                      <div>
                        <p className="font-medium">{firm.name}</p>
                        <p className="text-xs text-muted-foreground">{firm.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{firm.maxFunding ? formatCurrency(firm.maxFunding) : '—'}</td>
                  <td className="px-4 py-3">{firm.profitSplit ? `${firm.profitSplit}%` : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                      <span>{firm.rating?.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${firm.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {firm.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {firm.isFeatured && <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Featured</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/firms/${firm.id}/edit`} className="p-1.5 hover:bg-accent rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => deleteFirm(firm.id, firm.name)} className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {total > 20 && (
          <div className="flex justify-between items-center p-4 border-t border-border text-sm">
            <span className="text-muted-foreground">Showing {firms.length} of {total}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-border rounded-lg hover:bg-accent disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} className="px-3 py-1.5 border border-border rounded-lg hover:bg-accent disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
