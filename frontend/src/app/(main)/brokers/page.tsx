import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Shield, ExternalLink } from 'lucide-react';

export const metadata: Metadata = { title: 'Prop Trading Brokers Directory' };

async function getBrokers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/brokers`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default async function BrokersPage() {
  const brokers = await getBrokers();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Prop Trading Brokers</h1>
      <p className="text-muted-foreground mb-8">Regulated brokers used by top prop trading firms.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {brokers.map((broker: any) => (
          <div key={broker.id} className="bg-card border border-border rounded-xl p-5 card-hover">
            <div className="flex items-start gap-4 mb-4">
              {broker.logo ? (
                <Image src={broker.logo} alt={broker.name} width={48} height={48} className="rounded-lg border border-border bg-white object-contain" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">{broker.name[0]}</div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{broker.name}</h3>
                {broker.regulation && (
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-xs text-green-600">{broker.regulation}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-gold text-gold" />
                <span className="font-semibold text-sm">{broker.rating?.toFixed(1)}</span>
              </div>
            </div>
            {broker.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{broker.description}</p>}
            {broker.firms?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Used by {broker.firms.length} prop firms</p>
                <div className="flex flex-wrap gap-1">
                  {broker.firms.slice(0, 4).map((f: any) => (
                    <Link key={f.slug} href={`/firms/${f.slug}`} className="text-xs px-2 py-0.5 bg-muted rounded-full hover:bg-accent transition-colors">{f.name}</Link>
                  ))}
                </div>
              </div>
            )}
            <Link href={broker.websiteUrl} target="_blank" className="flex items-center justify-center gap-1.5 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
              Visit Website <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
