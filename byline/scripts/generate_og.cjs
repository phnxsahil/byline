const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 }
  });

  const bgPath = path.resolve('public/cta_scene_bg.png').replace(/\\/g, '/');
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 0;
          width: 1200px;
          height: 630px;
          background: #0d1117;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: url('file://${bgPath}');
          background-size: cover;
          background-position: center;
        }
      </style>
    </head>
    <body>
      <div class="bg"></div>
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Wait for fonts to load
  await page.screenshot({ path: 'public/og-image.png' });
  await browser.close();
  console.log('OG image generated at public/og-image.png');
})();
