'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, Star, Tag, MousePointerClick, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatNumber } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.dashboard().then(({ data }) => setStats(data.data)).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Firms', value: stats.totalFirms, icon: Building2, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/50', href: '/admin/firms' },
    { label: 'Total Reviews', value: stats.totalReviews, icon: Star, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/50', href: '/admin/reviews' },
    { label: 'Active Offers', value: stats.totalOffers, icon: Tag, color: 'text-green-500 bg-green-50 dark:bg-green-950/50', href: '/admin/offers' },
    { label: 'Total Clicks', value: formatNumber(stats.totalClicks), icon: MousePointerClick, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50', href: '/admin/firms' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: Clock, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/50', href: '/admin/reviews?status=PENDING' },
    { label: 'Clicks (30d)', value: formatNumber(stats.recentClicks), icon: TrendingUp, color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/50', href: '/admin/firms' },
  ] : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
            {cards.map(card => (
              <Link key={card.label} href={card.href} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{card.label}</p>
              </Link>
            ))}
          </div>

          {stats?.topFirms?.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold mb-4">Top Firms by Clicks</h2>
              <div className="space-y-3">
                {stats.topFirms.map((firm: any, idx: number) => (
                  <div key={firm.slug} className="flex items-center gap-3">
                    <span className="w-6 text-center text-sm font-bold text-muted-foreground">#{idx + 1}</span>
                    <Link href={`/admin/firms`} className="flex-1 font-medium text-sm hover:text-primary">{firm.name}</Link>
                    <div className="text-right">
                      <span className="text-sm font-semibold">{formatNumber(firm.clickCount)} clicks</span>
                      <span className="text-xs text-muted-foreground ml-2">★ {firm.rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
