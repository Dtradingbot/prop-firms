'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Shield, Star, TrendingUp } from 'lucide-react';

export function HeroBanner() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search) router.push(`/firms?search=${encodeURIComponent(search)}`);
  };

  return (
    <section className="gradient-hero text-white py-20 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            <span>Trusted by 50,000+ traders worldwide</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Find Your Perfect
            <span className="block text-blue-200">Prop Trading Firm</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed">
            Compare 100+ prop trading firms side by side. Compare profit splits, funding sizes,
            rules, and reviews — all in one place.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto mb-10">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search prop firms, brokers..."
                className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
              />
            </div>
            <button type="submit" className="px-6 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg whitespace-nowrap">
              Search
            </button>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-blue-200">Popular:</span>
            {['FTMO', 'MyForexFunds', 'Apex Trader', 'E8 Funding', 'Instant Funding'].map(term => (
              <Link
                key={term}
                href={`/firms?search=${encodeURIComponent(term)}`}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-8 mt-12 text-blue-100">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Verified Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-blue-200 text-blue-200" />
              <span className="text-sm">Unbiased Ratings</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Real-time Data</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
