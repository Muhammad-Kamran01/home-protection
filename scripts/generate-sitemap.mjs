import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteUrl, sitemapEntries } from '../sitemap.config.js';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const outputPath = path.join(projectRoot, 'public', 'sitemap.xml');
const today = new Date().toISOString().slice(0, 10);

const normalizeBaseUrl = (value) => value.replace(/\/+$/, '');
const normalizePath = (value) => (value.startsWith('/') ? value : `/${value}`);
const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const baseUrl = normalizeBaseUrl(process.env.SITE_URL || siteUrl);
const urls = sitemapEntries
  .map(({ path: entryPath, changeFreq, priority }) => {
    const loc = `${baseUrl}${normalizePath(entryPath)}`;
    return [
      '  <url>',
      `    <loc>${escapeXml(loc)}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <changefreq>${changeFreq}</changefreq>`,
      `    <priority>${priority.toFixed(1)}</priority>`,
      '  </url>',
    ].join('\n');
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, sitemap, 'utf8');

console.log(`Sitemap written to ${outputPath}`);