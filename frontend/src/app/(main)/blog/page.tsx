import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Prop Trading Blog' };

async function getPosts(page = 1) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/blog?page=${page}`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data;
  } catch { return { data: [], total: 0 }; }
}

export default async function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1;
  const { data: posts, total } = await getPosts(page);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-bold">Prop Trading Blog</h1>
      </div>
      <p className="text-muted-foreground mb-8">News, guides, and reviews for prop traders.</p>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No blog posts yet. Check back soon!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-card border border-border rounded-xl overflow-hidden card-hover">
              {post.featuredImage && (
                <div className="aspect-video relative overflow-hidden">
                  <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-5">
                {post.categories?.length > 0 && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{post.categories[0].category.name}</span>
                )}
                <h2 className="font-semibold mt-2 mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
                {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                {post.publishedAt && (
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
