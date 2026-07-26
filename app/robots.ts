import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/signup'],
      disallow: ['/dashboard/', '/api/', '/onboarding'],
    },
    sitemap: 'https://projectpilot.ai/sitemap.xml',
  };
}
