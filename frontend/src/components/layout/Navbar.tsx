'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Search, Menu, X, ChevronDown, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { searchApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Prop Firms', href: '/firms' },
  { label: 'Compare', href: '/compare' },
  { label: 'Offers', href: '/offers' },
  {
    label: 'Rankings', href: '#',
    children: [
      { label: 'Top Rated', href: '/top-rated' },
      { label: 'Trending', href: '/trending' },
      { label: 'Instant Funding', href: '/firms?evaluationType=INSTANT_FUNDING' },
    ],
  },
  { label: 'Brokers', href: '/brokers' },
  { label: 'Blog', href: '/blog' },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults(null); return; }
    const timer = setTimeout(async () => {
      const { data } = await searchApi.search(searchQuery);
      setSearchResults(data.data);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <nav className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled ? 'bg-background/95 backdrop-blur shadow-md' : 'bg-background',
      'border-b border-border'
    )}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary shrink-0">
          <TrendingUp className="w-7 h-7" />
          <span>PropFirmHub</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors">
                  {link.label} <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {link.children.map(child => (
                    <Link key={child.href} href={child.href} className="block px-4 py-2 text-sm hover:bg-accent first:rounded-t-lg last:rounded-b-lg">
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={link.href} href={link.href} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors">
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-md hover:bg-accent transition-colors">
              <Search className="w-5 h-5" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl">
                <div className="p-3">
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search firms, brokers, offers..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {searchResults && (
                  <div className="border-t border-border pb-2">
                    {searchResults.firms?.length > 0 && (
                      <div>
                        <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase">Prop Firms</p>
                        {searchResults.firms.map((f: any) => (
                          <Link key={f.slug} href={`/firms/${f.slug}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-accent text-sm">
                            <span className="font-medium">{f.name}</span>
                            <span className="ml-auto text-muted-foreground text-xs">★ {f.rating}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.brokers?.length > 0 && (
                      <div>
                        <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase">Brokers</p>
                        {searchResults.brokers.map((b: any) => (
                          <Link key={b.slug} href={`/brokers/${b.slug}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-accent text-sm">
                            <span className="font-medium">{b.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.firms?.length === 0 && searchResults.brokers?.length === 0 && (
                      <p className="px-3 py-4 text-sm text-muted-foreground text-center">No results found</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-md hover:bg-accent transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Auth */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                {user.name.split(' ')[0]}
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {(user.role === 'EDITOR' || user.role === 'SUPER_ADMIN') && (
                  <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-accent rounded-t-lg">Admin Panel</Link>
                )}
                <button onClick={logout} className="w-full text-left px-4 py-2 text-sm hover:bg-accent text-destructive rounded-b-lg">
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login" className="px-3 py-1.5 text-sm font-medium hover:bg-accent rounded-lg transition-colors">Login</Link>
              <Link href="/register" className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-md hover:bg-accent">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navLinks.map(link =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-sm font-semibold text-muted-foreground">{link.label}</p>
                  {link.children.map(child => (
                    <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)} className="block pl-6 pr-3 py-2 text-sm hover:bg-accent rounded-lg">
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg">
                  {link.label}
                </Link>
              )
            )}
            {!user && (
              <div className="pt-2 border-t border-border flex gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 py-2 text-center text-sm font-medium border border-border rounded-lg hover:bg-accent">Login</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 py-2 text-center text-sm font-medium bg-primary text-primary-foreground rounded-lg">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
