import fs from 'fs';
import sharp from 'sharp';

// 1. Generate Favicon
const faviconSvg = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0B1259" rx="20" />
  <g transform="translate(20, 20) scale(0.6)">
    <polygon points="7,0 50,0 50,50" fill="white" />
    <polygon points="7,100 50,100 50,50" fill="white" />
    <circle cx="20" cy="50" r="15.5" fill="white" />
    <polygon points="53,0 100,0 100,50" fill="white" />
    <polygon points="53,100 100,100 100,50" fill="white" />
  </g>
</svg>`;
fs.writeFileSync('public/favicon.svg', faviconSvg);
fs.writeFileSync('public/favicon.ico', faviconSvg); // Just so a file exists, we'll link to .svg in HTML

// 2. Generate OG Image (1200x630)
const ogSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0B1259" />
  <g transform="translate(100, 240)">
    <g transform="scale(1.5)">
      <polygon points="7,0 50,0 50,50" fill="white" />
      <polygon points="7,100 50,100 50,50" fill="white" />
      <circle cx="20" cy="50" r="15.5" fill="white" />
      <polygon points="53,0 100,0 100,50" fill="white" />
      <polygon points="53,100 100,100 100,50" fill="white" />
    </g>
    <text x="180" y="30" font-family="sans-serif" font-weight="600" font-size="24" fill="rgba(255,255,255,0.8)" letter-spacing="4">ENTERPRISECEO</text>
    <text x="180" y="80" font-family="sans-serif" font-weight="bold" font-size="48" fill="white">Media Owners &amp; Executives</text>
    <text x="180" y="140" font-family="sans-serif" font-weight="bold" font-size="56" fill="#F4941D">Masterclass</text>
  </g>
  <rect x="0" y="614" width="1200" height="16" fill="#F4941D" />
</svg>`;

sharp(Buffer.from(ogSvg))
  .png()
  .toFile('public/og-image.png')
  .then(() => console.log('Assets generated'))
  .catch(err => console.error(err));
