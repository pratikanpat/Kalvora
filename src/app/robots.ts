import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/dashboard', '/create', '/edit', '/invoice', '/profile', '/admin', '/api'],
            },
        ],
        sitemap: 'https://kalvora.kaliprlabs.in/sitemap.xml',
    };
}
