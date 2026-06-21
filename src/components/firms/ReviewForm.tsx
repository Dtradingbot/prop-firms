'use client';

import { useState } from 'react';
import { reviewsApi } from '@/lib/api';
import { StarRating } from '@/components/ui/StarRating';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  firmId: string;
  onSuccess: () => void;
}

export function ReviewForm({ firmId, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="bg-muted rounded-xl p-6 text-center">
        <p className="text-muted-foreground mb-4">You must be logged in to leave a review.</p>
        <Link href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Login to Review</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a rating'); return; }
    if (body.length < 10) { toast.error('Review must be at least 10 characters'); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('firmId', firmId);
      fd.append('rating', String(rating));
      fd.append('title', title);
      fd.append('body', body);
      if (proofImage) fd.append('proofImage', proofImage);

      await reviewsApi.create(fd);
      toast.success('Review submitted! It will appear after approval.');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
      <h3 className="font-semibold">Write Your Review</h3>
      <div>
        <label className="text-sm font-medium block mb-2">Rating *</label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1.5">Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Summary of your experience" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1.5">Review *</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="Share your experience with this prop firm..." className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
        <p className="text-xs text-muted-foreground mt-1">{body.length}/1000 characters</p>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1.5">Proof Image (optional)</label>
        <input type="file" accept="image/*" onChange={e => setProofImage(e.target.files?.[0] || null)} className="text-sm text-muted-foreground" />
      </div>
      <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
