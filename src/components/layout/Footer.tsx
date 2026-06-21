import Link from 'next/link';
import { TrendingUp, Twitter, Youtube, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
              <TrendingUp className="w-6 h-6" />
              <span>PropFirmHub</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              The #1 prop trading firm directory. Compare firms, find the best profit splits, and start your funded trading journey.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"><Youtube className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[['All Prop Firms', '/firms'], ['Top Rated', '/top-rated'], ['Trending', '/trending'], ['Compare', '/compare'], ['Offers', '/offers']].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-foreground transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[['Blog', '/blog'], ['Brokers', '/brokers'], ['Reviews', '/firms']].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-foreground transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[['About', '/about'], ['Contact', '/contact'], ['Privacy Policy', '/privacy-policy'], ['Terms', '/terms'], ['Disclaimer', '/disclaimer']].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-foreground transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PropFirmHub. All rights reserved.</p>
          <p className="text-xs text-center">
            Trading involves significant risk. Past performance does not guarantee future results.
            <Link href="/disclaimer" className="underline ml-1">Disclaimer</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
