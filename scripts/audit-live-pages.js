import puppeteer from 'puppeteer-core';

async function auditLivePages() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960 });

  // 1. Login
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.evaluate(async () => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'demo', password: 'demo123' })
    });
    const d = await res.json();
    if (d.token) {
      localStorage.setItem('wardrobe_auth_token', d.token);
      localStorage.setItem('wardrobe_auth_user', JSON.stringify(d.user));
    }
  });

  const checkPageImages = async (pageName, url) => {
    await page.goto(url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    const result = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const broken = imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
      return { total: imgs.length, brokenCount: broken.length, brokenUrls: broken };
    });
    console.log(`Page ${pageName}: total=${result.total}, broken=${result.brokenCount}`);
    if (result.brokenCount > 0) console.error('Broken URLs on ' + pageName, result.brokenUrls);
  };

  await checkPageImages('Dashboard', 'http://localhost:5173');
  await checkPageImages('Wardrobe', 'http://localhost:5173/wardrobe');
  await checkPageImages('Recommendations Form', 'http://localhost:5173/recommendations');

  // Trigger Recommendations Generation
  await page.evaluate(() => {
    const genBtn = document.querySelector('button[type="submit"]');
    if (genBtn) genBtn.click();
  });
  await new Promise(r => setTimeout(r, 2500));
  const recResults = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const broken = imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
    return { total: imgs.length, brokenCount: broken.length, brokenUrls: broken };
  });
  console.log(`Recommendations Results: total=${recResults.total}, broken=${recResults.brokenCount}`);

  await checkPageImages('Saved Outfits', 'http://localhost:5173/saved-outfits');
  await checkPageImages('Preferences', 'http://localhost:5173/preferences');

  await browser.close();
}

auditLivePages().catch(err => {
  console.error('Audit live pages failed:', err);
  process.exit(1);
});
