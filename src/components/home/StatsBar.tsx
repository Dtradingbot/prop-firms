'use client';

import { Building2, Star, Tag, Users } from 'lucide-react';

const stats = [
  { icon: Building2, value: '100+', label: 'Prop Firms' },
  { icon: Star, value: '10,000+', label: 'Verified Reviews' },
  { icon: Tag, value: '200+', label: 'Active Offers' },
  { icon: Users, value: '50,000+', label: 'Monthly Traders' },
];

export function StatsBar() {
  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-xl leading-none">{value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
