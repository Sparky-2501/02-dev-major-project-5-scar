import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categories = [
  { dir: 'men', count: 8, prefix: "Men Urban & Tailored", dept: "Men" },
  { dir: 'women', count: 8, prefix: "Women Designer & Chic", dept: "Women" },
  { dir: 'kids', count: 8, prefix: "Kids & Junior Active", dept: "Kids" },
  { dir: 'footwear', count: 8, prefix: "Footwear & Running Performance", dept: "Footwear" },
  { dir: 'electronics', count: 8, prefix: "Smart Audio & Electronics", dept: "Electronics" },
  { dir: 'accessories', count: 8, prefix: "Chronograph & Leather Accessories", dept: "Accessories" },
  { dir: 'home', count: 8, prefix: "Home Studio & Minimal Decor", dept: "Home" },
];

const colors = [
  ['#1e293b', '#0f172a', '#ff5a1f'],
  ['#0284c7', '#0369a1', '#38bdf8'],
  ['#059669', '#047857', '#34d399'],
  ['#7c3aed', '#6d28d9', '#a78bfa'],
  ['#db2777', '#be185d', '#f472b6'],
  ['#d97706', '#b45309', '#fbbf24'],
  ['#334155', '#1e293b', '#94a3b8'],
  ['#475569', '#334155', '#e2e8f0'],
];

let totalGenerated = 0;
const targetBase = path.resolve(__dirname, '../public/images/products');

categories.forEach((cat) => {
  const catDir = path.join(targetBase, cat.dir);
  if (!fs.existsSync(catDir)) {
    fs.mkdirSync(catDir, { recursive: true });
  }

  for (let i = 1; i <= cat.count; i++) {
    const cPair = colors[(i - 1) % colors.length];
    const fileName = `${cat.dir}_${i}.svg`;
    const filePath = path.join(catDir, fileName);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="grad_${cat.dir}_${i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${cPair[0]}" />
      <stop offset="100%" stop-color="${cPair[1]}" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-opacity="0.3" />
    </filter>
  </defs>
  <rect width="800" height="800" fill="url(#grad_${cat.dir}_${i})" />
  <circle cx="400" cy="380" r="220" fill="#ffffff" opacity="0.04" />
  <rect x="200" y="200" width="400" height="360" rx="24" fill="#ffffff" opacity="0.12" filter="url(#shadow)" />
  <circle cx="400" cy="310" r="44" fill="${cPair[2]}" opacity="0.9" />
  <text x="400" y="318" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="800" text-anchor="middle">S</text>
  <text x="400" y="400" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" text-anchor="middle" letter-spacing="1">SCAR STUDIO</text>
  <text x="400" y="440" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="500" opacity="0.9" text-anchor="middle">${cat.prefix} ${i}</text>
  <rect x="340" y="480" width="120" height="32" rx="16" fill="#ffffff" opacity="0.2" />
  <text x="400" y="502" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1">CURATED ITEM</text>
  <text x="400" y="730" fill="#ffffff" opacity="0.4" font-family="system-ui, -apple-system, sans-serif" font-size="14" text-anchor="middle">OFFICIAL SCAR RETAIL ASSET</text>
</svg>`;

    fs.writeFileSync(filePath, svg, 'utf8');
    totalGenerated++;
  }
});

console.log(`Successfully generated ${totalGenerated} legally clean high-resolution product assets in public/images/products!`);
