'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Shield, Zap, ExternalLink, GitCompare, ChevronDown, ChevronUp, Copy, CheckCircle, XCircle } from 'lucide-react';
import { PropFirm } from '@/types';
import { formatCurrency, getAffiliateUrl } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
import { ReviewForm } from '@/components/firms/ReviewForm';
import { ReviewCard } from '@/components/firms/ReviewCard';
import toast from 'react-hot-toast';

interface FirmDetailClientProps {
  firm: PropFirm;
}

export function FirmDetailClient({ firm }: FirmDetailClientProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied: ${code}`);
  };

  const tabs = ['overview', 'programs', 'rules', 'reviews', 'faq'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/firms" className="hover:text-foreground">Prop Firms</Link>
        <span>/</span>
        <span className="text-foreground">{firm.name}</span>
      </div>

      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Logo & Name */}
          <div className="flex items-start gap-4">
            {firm.logo ? (
              <Image src={firm.logo} alt={firm.name} width={80} height={80} className="rounded-xl border border-border object-contain bg-white" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-3xl">
                {firm.name[0]}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">{firm.name}</h1>
                {firm.isVerified && <Shield className="w-5 h-5 text-blue-500" title="Verified" />}
                {firm.instantFunding && <Zap className="w-5 h-5 text-yellow-500" title="Instant Funding" />}
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <StarRating value={Math.round(firm.rating)} readonly size="md" />
                <span className="font-semibold">{firm.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">({firm.reviewCount} reviews)</span>
                {firm.country && <span className="text-sm text-muted-foreground">• {firm.country}</span>}
                {firm.founded && <span className="text-sm text-muted-foreground">• Est. {firm.founded}</span>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="md:ml-auto flex flex-col sm:flex-row gap-3">
            <Link href={`/compare?slugs=${firm.slug}`} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-accent transition-colors">
              <GitCompare className="w-4 h-4" /> Compare
            </Link>
            <Link href={getAffiliateUrl(firm.slug)} target="_blank" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
              Visit Website <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          {[
            { label: 'Max Funding', value: firm.maxFunding ? formatCurrency(firm.maxFunding) : 'N/A', color: 'text-primary' },
            { label: 'Profit Split', value: firm.profitSplit ? `${firm.profitSplit}%${firm.maxProfitSplit && firm.maxProfitSplit !== firm.profitSplit ? ` – ${firm.maxProfitSplit}%` : ''}` : 'N/A', color: 'text-green-600' },
            { label: 'Max Drawdown', value: firm.maxDrawdown ? `${firm.maxDrawdown}%` : 'N/A', color: 'text-red-500' },
            { label: 'Trust Score', value: `${firm.trustScore.toFixed(1)}/10`, color: 'text-orange-500' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Offers */}
      {firm.offers && firm.offers.length > 0 && (
        <div className="mb-6">
          {firm.offers.filter(o => o.isActive).map(offer => (
            <div key={offer.id} className="flex items-center justify-between gap-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <div>
                <p className="font-semibold text-green-800 dark:text-green-300">{offer.title}</p>
                {offer.description && <p className="text-sm text-green-700 dark:text-green-400">{offer.description}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {offer.discount && <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-bold rounded-full">{offer.discount}% OFF</span>}
                {offer.couponCode && (
                  <button onClick={() => copyCode(offer.couponCode!)} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-card border border-green-300 rounded-lg text-sm font-mono hover:bg-green-50">
                    {offer.couponCode} <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
                <Link href={getAffiliateUrl(firm.slug)} target="_blank" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                  Claim Offer
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
          >
            {tab === 'faq' ? 'FAQ' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {firm.description && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-bold text-lg mb-4">About {firm.name}</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: firm.description }} />
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-4">Details</h3>
              <dl className="space-y-3 text-sm">
                {firm.broker && (
                  <div className="flex justify-between"><dt className="text-muted-foreground">Broker</dt><dd className="font-medium">{firm.broker.name}</dd></div>
                )}
                {firm.platforms && firm.platforms.length > 0 && (
                  <div className="flex justify-between"><dt className="text-muted-foreground">Platforms</dt><dd className="font-medium">{firm.platforms.map(p => p.platform.name).join(', ')}</dd></div>
                )}
                {firm.evaluationType && (
                  <div className="flex justify-between"><dt className="text-muted-foreground">Evaluation</dt><dd className="font-medium">{firm.evaluationType.replace(/_/g, ' ')}</dd></div>
                )}
                {firm.payoutFrequency && (
                  <div className="flex justify-between"><dt className="text-muted-foreground">Payout</dt><dd className="font-medium">{firm.payoutFrequency}</dd></div>
                )}
                {firm.dailyDrawdown !== undefined && (
                  <div className="flex justify-between"><dt className="text-muted-foreground">Daily Drawdown</dt><dd className="font-medium text-red-500">{firm.dailyDrawdown}%</dd></div>
                )}
                <div className="flex justify-between"><dt className="text-muted-foreground">Scaling Plan</dt>
                  <dd>{firm.scalingPlan ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-400" />}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'programs' && (
        <div className="space-y-4">
          {firm.programs && firm.programs.length > 0 ? (
            firm.programs.map(prog => (
              <div key={prog.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">{prog.name}</h3>
                  <span className="text-xl font-bold text-primary">{formatCurrency(prog.price)}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Account Size', value: formatCurrency(prog.accountSize) },
                    { label: 'Profit Split', value: `${prog.profitSplit}%`, color: 'text-green-600' },
                    { label: 'Max Drawdown', value: `${prog.maxDrawdown}%`, color: 'text-red-500' },
                    { label: 'Profit Target', value: prog.profitTarget ? `${prog.profitTarget}%` : 'N/A' },
                    { label: 'Daily Drawdown', value: prog.dailyDrawdown ? `${prog.dailyDrawdown}%` : 'N/A', color: 'text-red-400' },
                    { label: 'Min Trading Days', value: prog.minTradingDays ? `${prog.minTradingDays} days` : 'None' },
                    { label: 'Fee Refundable', value: prog.refundable ? 'Yes' : 'No' },
                    { label: 'Type', value: prog.evaluationType.replace(/_/g, ' ') },
                  ].map(stat => (
                    <div key={stat.label} className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className={`font-semibold mt-1 ${stat.color || ''}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-10">No programs listed yet.</p>
          )}
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {firm.rules && firm.rules.length > 0 ? (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50"><th className="text-left px-4 py-3">Category</th><th className="text-left px-4 py-3">Rule</th><th className="px-4 py-3">Allowed</th></tr></thead>
              <tbody className="divide-y divide-border">
                {firm.rules.map(rule => (
                  <tr key={rule.id}>
                    <td className="px-4 py-3 font-medium">{rule.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{rule.rule}</td>
                    <td className="px-4 py-3 text-center">
                      {rule.allowed ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : <XCircle className="w-4 h-4 text-red-500 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted-foreground text-center py-10">No trading rules listed.</p>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl">Trader Reviews ({firm.reviewCount})</h2>
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
              Write Review
            </button>
          </div>
          {showReviewForm && <ReviewForm firmId={firm.id} onSuccess={() => setShowReviewForm(false)} />}
          <div className="space-y-4">
            {firm.reviews && firm.reviews.length > 0 ? (
              firm.reviews.map(review => <ReviewCard key={review.id} review={review} />)
            ) : (
              <p className="text-muted-foreground text-center py-10">No reviews yet. Be the first!</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="space-y-3">
          {firm.faqs && firm.faqs.length > 0 ? (
            firm.faqs.map(faq => <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />)
          ) : (
            <p className="text-muted-foreground text-center py-10">No FAQs yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left font-medium hover:bg-muted/50 transition-colors">
        {question}
        {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>
      {open && <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{answer}</div>}
    </div>
  );
}
