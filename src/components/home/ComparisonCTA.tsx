import Link from 'next/link';
import { GitCompare, ArrowRight } from 'lucide-react';

export function ComparisonCTA() {
  return (
    <section className="py-12 container mx-auto px-4">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GitCompare className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Compare Prop Firms Side by Side</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Use our powerful comparison tool to evaluate funding, profit splits, drawdown rules, and more across multiple firms at once.
          </p>
          <Link href="/compare" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
            Start Comparing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
