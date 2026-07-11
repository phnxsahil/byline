import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  
  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844, isMobile: true }
  ];
  
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile || false
    });
    
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    
    // Wait a bit for JS animations
    await page.waitForTimeout(2000);

    // Grab the sections + footer
    const sections = await page.$$('.ta-grid-wrapper, section, footer');

    for (const theme of ['light', 'dark']) {
      // Set theme
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        if (t === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, theme);
      
      // Wait for theme transition
      await page.waitForTimeout(500);

      let idx = 0;
      for (const section of sections) {
        let id = await section.getAttribute('id') || `section-${idx}`;
        const tagName = await section.evaluate(el => el.tagName.toLowerCase());
        if (tagName === 'footer') {
          id = 'footer';
        }

        // Ensure the section is visible in viewport to trigger scroll animations if any
        await section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);

        const filePath = path.join(screenshotsDir, `${vp.name}-${theme}-${id}.png`);
        
        try {
          // If this is the hero section (idx === 0 and typically no id), include the navbar
          if (idx === 0) {
            // get hero bounding box
            const box = await section.boundingBox();
            // The navbar is at the top of the page, so we capture from y=0 to the bottom of the hero
            await page.evaluate(() => window.scrollTo(0, 0)); // scroll to top
            await page.screenshot({ 
              path: filePath, 
              clip: { x: 0, y: 0, width: box.width, height: box.y + box.height }
            });
          } else {
            await section.screenshot({ path: filePath });
          }
          console.log(`Saved ${filePath}`);
        } catch (e) {
          console.error(`Failed to screenshot ${id}:`, e.message);
        }
        idx++;
      }
    }
    await page.close();
  }

  await browser.close();
  console.log("Done!");
})();
