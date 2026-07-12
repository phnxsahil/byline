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
          opacity: 0.5;
        }
        .overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse 100% 100% at 50% 50%, rgba(13,17,23,0.95) 0%, rgba(13,17,23,0.7) 60%, transparent 100%);
        }
        .content {
          position: relative;
          z-index: 10;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .badge {
          font-family: 'IBM Plex Mono', monospace;
          color: #F0A500;
          border: 1px solid #30363D;
          padding: 8px 16px;
          border-radius: 99px;
          font-size: 18px;
          margin-bottom: 24px;
          letter-spacing: 0.05em;
        }
        .title {
          font-family: 'Space Grotesk', sans-serif;
          color: #ffffff;
          font-size: 110px;
          font-weight: 700;
          margin: 0;
          line-height: 1.1;
          letter-spacing: -0.05em;
        }
        .subtitle {
          font-family: 'Space Grotesk', sans-serif;
          color: #F0A500;
          font-size: 110px;
          font-weight: 700;
          margin: 0 0 32px 0;
          line-height: 1.1;
          letter-spacing: -0.05em;
        }
      </style>
    </head>
    <body>
      <div class="bg"></div>
      <div class="overlay"></div>
      <div class="content">
        <div class="badge">/00 BYLINE CONTENT ENGINE</div>
        <h1 class="title">Ship code.</h1>
        <h1 class="subtitle">We'll write the post.</h1>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Wait for fonts to load
  await page.screenshot({ path: 'public/og-image.png' });
  await browser.close();
  console.log('OG image generated at public/og-image.png');
})();
