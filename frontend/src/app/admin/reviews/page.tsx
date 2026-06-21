'use client';

import { useEffect, useState } from 'react';
import { Check, X, Trash2, Star } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('PENDING');

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getReviews(status || undefined);
      setReviews(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [status]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await adminApi.updateReviewStatus(id, newStatus);
      toast.success(`Review ${newStatus.toLowerCase()}`);
      fetch();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>

      <div className="flex gap-2 mb-6">
        {['PENDING', 'APPROVED', 'REJECTED', ''].map(s => (
          <button key={s} onClick={() => setStatus(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${status === s ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-accent'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No reviews found.</div>
        ) : (
          <div className="divide-y divide-border">
            {reviews.map(review => (
              <div key={review.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-sm">{review.user?.name}</span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-sm text-muted-foreground">{review.firm?.name}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-gold text-gold' : 'text-muted'}`} />)}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${review.status === 'APPROVED' ? 'bg-green-100 text-green-700' : review.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {review.status}
                      </span>
                    </div>
                    {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
                    <p className="text-sm text-muted-foreground line-clamp-2">{review.body}</p>
                    <p className="text-xs text-muted-foreground mt-2">{formatDate(review.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {review.status !== 'APPROVED' && (
                      <button onClick={() => updateStatus(review.id, 'APPROVED')} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {review.status !== 'REJECTED' && (
                      <button onClick={() => updateStatus(review.id, 'REJECTED')} className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
