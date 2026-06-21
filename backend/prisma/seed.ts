import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('Admin@1234', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@propfirmhub.com' },
    update: {},
    create: { email: 'admin@propfirmhub.com', name: 'Super Admin', password: adminPassword, role: 'SUPER_ADMIN' },
  });

  const mt4 = await prisma.platform.upsert({ where: { slug: 'mt4' }, update: {}, create: { name: 'MetaTrader 4', slug: 'mt4' } });
  const mt5 = await prisma.platform.upsert({ where: { slug: 'mt5' }, update: {}, create: { name: 'MetaTrader 5', slug: 'mt5' } });
  const ctrader = await prisma.platform.upsert({ where: { slug: 'ctrader' }, update: {}, create: { name: 'cTrader', slug: 'ctrader' } });

  const ftmoBroker = await prisma.broker.upsert({
    where: { slug: 'dxtrade' },
    update: {},
    create: { name: 'FTMO Broker', slug: 'dxtrade', websiteUrl: 'https://ftmo.com', regulation: 'CySEC', rating: 4.5 },
  });

  const firms = [
    { name: 'FTMO', description: 'FTMO is the world\'s largest prop trading firm offering funding up to $400,000.', websiteUrl: 'https://ftmo.com', affiliateUrl: 'https://ftmo.com/?ref=propfirmhub', maxFunding: 400000, minFunding: 10000, profitSplit: 80, maxProfitSplit: 90, maxDrawdown: 10, dailyDrawdown: 5, evaluationType: 'TWO_STEP', isFeatured: true, rating: 4.8, trustScore: 9.2, reviewCount: 1250, clickCount: 45000 },
    { name: 'MyForexFunds', description: 'MyForexFunds provides rapid funding solutions for traders worldwide.', websiteUrl: 'https://myforexfunds.com', affiliateUrl: 'https://myforexfunds.com/?ref=hub', maxFunding: 300000, minFunding: 5000, profitSplit: 75, maxProfitSplit: 85, maxDrawdown: 12, dailyDrawdown: 5, evaluationType: 'TWO_STEP', isFeatured: true, rating: 4.5, trustScore: 8.8, reviewCount: 980, clickCount: 32000 },
    { name: 'The Funded Trader', description: 'The Funded Trader offers flexible evaluation programs and high profit splits.', websiteUrl: 'https://thefundedtrader.com', affiliateUrl: 'https://thefundedtrader.com/?ref=hub', maxFunding: 600000, minFunding: 25000, profitSplit: 80, maxProfitSplit: 90, maxDrawdown: 12, evaluationType: 'TWO_STEP', isFeatured: false, isTrending: true, rating: 4.6, trustScore: 8.9, reviewCount: 720, clickCount: 28000 },
    { name: 'Apex Trader Funding', description: 'Apex Trader Funding is a futures prop firm with straightforward rules.', websiteUrl: 'https://apextrader.com', affiliateUrl: 'https://apextrader.com/?ref=hub', maxFunding: 250000, minFunding: 25000, profitSplit: 100, maxProfitSplit: 100, maxDrawdown: 6, instantFunding: false, evaluationType: 'ONE_STEP', isTrending: true, rating: 4.7, trustScore: 9.0, reviewCount: 630, clickCount: 25000 },
    { name: 'E8 Funding', description: 'E8 Funding offers scaling plans with competitive profit splits and fair rules.', websiteUrl: 'https://e8funding.com', affiliateUrl: 'https://e8funding.com/?ref=hub', maxFunding: 300000, minFunding: 25000, profitSplit: 80, maxProfitSplit: 80, maxDrawdown: 8, dailyDrawdown: 5, evaluationType: 'TWO_STEP', scalingPlan: true, rating: 4.4, trustScore: 8.5, reviewCount: 410, clickCount: 15000 },
    { name: 'Funder Trading', description: 'Funder Trading specializes in instant funding solutions with no evaluation.', websiteUrl: 'https://fundertrading.com', affiliateUrl: 'https://fundertrading.com/?ref=hub', maxFunding: 200000, minFunding: 10000, profitSplit: 80, maxProfitSplit: 90, maxDrawdown: 10, instantFunding: true, evaluationType: 'INSTANT_FUNDING', rating: 4.2, trustScore: 8.0, reviewCount: 290, clickCount: 10000 },
  ];

  for (const firmData of firms) {
    const slug = slugify(firmData.name, { lower: true, strict: true });
    const firm = await prisma.propFirm.upsert({
      where: { slug },
      update: {},
      create: { ...firmData, slug, brokerId: ftmoBroker.id } as any,
    });

    await prisma.propFirmPlatform.upsert({
      where: { firmId_platformId: { firmId: firm.id, platformId: mt5.id } },
      update: {},
      create: { firmId: firm.id, platformId: mt5.id },
    }).catch(() => {});

    await prisma.offer.create({
      data: {
        firmId: firm.id,
        title: `${firm.name} Special - 10% OFF`,
        discount: 10,
        couponCode: `${firm.name.replace(/\s/g, '').toUpperCase()}10`,
        affiliateUrl: firmData.affiliateUrl,
        isActive: true,
      },
    }).catch(() => {});

    await prisma.review.create({
      data: {
        firmId: firm.id,
        userId: admin.id,
        rating: firmData.rating,
        title: `Great experience with ${firm.name}`,
        body: `I have been trading with ${firm.name} for 6 months and the experience has been excellent. Payouts are consistent and the support team is responsive.`,
        status: 'APPROVED',
      },
    }).catch(() => {});

    await prisma.fundingProgram.create({
      data: {
        firmId: firm.id,
        name: 'Standard',
        accountSize: firmData.minFunding || 10000,
        price: (firmData.minFunding || 10000) * 0.005,
        profitSplit: firmData.profitSplit || 80,
        maxDrawdown: firmData.maxDrawdown || 10,
        dailyDrawdown: firmData.dailyDrawdown || 5,
        profitTarget: 10,
        evaluationType: firmData.evaluationType as any || 'TWO_STEP',
      },
    }).catch(() => {});
  }

  const pages = [
    { slug: 'about', title: 'About PropFirmHub', content: '<h1>About Us</h1><p>PropFirmHub is the #1 directory for prop trading firms. We help traders find the best funded trading opportunities.</p>' },
    { slug: 'contact', title: 'Contact Us', content: '<h1>Contact Us</h1><p>Email us at contact@propfirmhub.com</p>' },
    { slug: 'privacy-policy', title: 'Privacy Policy', content: '<h1>Privacy Policy</h1><p>Your privacy is important to us...</p>' },
    { slug: 'terms', title: 'Terms of Service', content: '<h1>Terms of Service</h1><p>By using PropFirmHub, you agree to these terms...</p>' },
    { slug: 'disclaimer', title: 'Disclaimer', content: '<h1>Disclaimer</h1><p>Trading involves significant risk of loss...</p>' },
  ];

  for (const page of pages) {
    await prisma.page.upsert({ where: { slug: page.slug }, update: {}, create: page });
  }

  await prisma.menu.upsert({
    where: { location: 'header' },
    update: {},
    create: {
      location: 'header',
      items: [
        { label: 'Prop Firms', href: '/firms' },
        { label: 'Brokers', href: '/brokers' },
        { label: 'Compare', href: '/compare' },
        { label: 'Offers', href: '/offers' },
        { label: 'Top Rated', href: '/top-rated' },
        { label: 'Trending', href: '/trending' },
        { label: 'Blog', href: '/blog' },
      ],
    },
  });

  await prisma.setting.upsert({ where: { key: 'site_name' }, update: {}, create: { key: 'site_name', value: 'PropFirmHub' } });
  await prisma.setting.upsert({ where: { key: 'site_description' }, update: {}, create: { key: 'site_description', value: 'The #1 Prop Trading Firm Directory & Comparison Site' } });

  console.log('Seeding complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
