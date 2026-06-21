export interface PropFirm {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  description?: string;
  shortDescription?: string;
  websiteUrl: string;
  affiliateUrl?: string;
  rating: number;
  trustScore: number;
  reviewCount: number;
  viewCount: number;
  clickCount: number;
  isFeatured: boolean;
  isTrending: boolean;
  isVerified: boolean;
  country?: string;
  founded?: string;
  maxFunding?: number;
  minFunding?: number;
  profitSplit?: number;
  maxProfitSplit?: number;
  maxDrawdown?: number;
  dailyDrawdown?: number;
  evaluationType?: EvaluationType;
  instantFunding: boolean;
  payoutFrequency?: string;
  scalingPlan: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  broker?: Broker;
  platforms?: { platform: Platform }[];
  programs?: FundingProgram[];
  offers?: Offer[];
  faqs?: FAQ[];
  rules?: TradingRule[];
  reviews?: Review[];
}

export type EvaluationType = 'ONE_STEP' | 'TWO_STEP' | 'THREE_STEP' | 'INSTANT_FUNDING';

export interface Broker {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  description?: string;
  websiteUrl: string;
  regulation?: string;
  rating: number;
  firms?: PropFirm[];
}

export interface Platform {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface FundingProgram {
  id: string;
  name: string;
  accountSize: number;
  price: number;
  profitSplit: number;
  maxDrawdown: number;
  dailyDrawdown?: number;
  profitTarget?: number;
  minTradingDays?: number;
  maxTradingDays?: number;
  refundable: boolean;
  evaluationType: EvaluationType;
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  discount?: number;
  couponCode?: string;
  affiliateUrl?: string;
  expiresAt?: string;
  isActive: boolean;
  clicks: number;
  firm?: { name: string; slug: string; logo?: string };
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  body: string;
  proofImage?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerified: boolean;
  createdAt: string;
  user?: { name: string; avatar?: string };
  firm?: { name: string; slug: string };
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface TradingRule {
  id: string;
  category: string;
  rule: string;
  allowed: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  publishedAt?: string;
  authorId: string;
  categories?: { category: { name: string; slug: string } }[];
  tags?: { tag: { name: string; slug: string } }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'EDITOR' | 'SUPER_ADMIN';
  avatar?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
}
