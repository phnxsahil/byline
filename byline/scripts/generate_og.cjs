const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 }
  });
  const bgBuffer = fs.readFileSync(path.resolve('public/cta_scene_bg.webp'));
  const bgBase64 = bgBuffer.toString('base64');
  const bgDataUri = `data:image/webp;base64,${bgBase64}`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
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
          background-image: url('${bgDataUri}');
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
