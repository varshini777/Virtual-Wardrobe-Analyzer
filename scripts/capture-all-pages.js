import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\VARSHINI\\.gemini\\antigravity\\brain\\0f281cae-1c13-48d8-9d98-c0a2f027f7e0';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function captureScreenshots() {
  console.log('🚀 Launching Chrome for complete page capture...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: {
      width: 1440,
      height: 960,
      deviceScaleFactor: 1.5
    },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1440,960'
    ]
  });

  const page = await browser.newPage();

  // Helper to save screenshot
  const DOCS_DIR = path.resolve('docs/screenshots');
  if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

  const saveShot = async (filename, fullPage = false) => {
    const artifactPath = path.join(ARTIFACT_DIR, filename);
    const docsPath = path.join(DOCS_DIR, filename);
    await page.screenshot({ path: artifactPath, fullPage });
    fs.copyFileSync(artifactPath, docsPath);
    console.log(`📸 Saved: ${filename}`);
    return artifactPath;
  };

  try {
    // -------------------------------------------------------------
    // 1. LOGIN PAGE (Unauthenticated)
    // -------------------------------------------------------------
    console.log('👉 Capturing 1: Login Page...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    // Clear storage to ensure unauthenticated login view
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await saveShot('page_01_login.png');

    // -------------------------------------------------------------
    // 2. REGISTRATION PAGE
    // -------------------------------------------------------------
    console.log('👉 Capturing 2: Registration Page...');
    // Click on "Create account" or "Register here"
    const registerLink = await page.$('button::-p-text(Create Account), a::-p-text(Create an account), button::-p-text(Register here), button::-p-text(Sign up), a::-p-text(Sign up)');
    if (registerLink) {
      await registerLink.click();
    } else {
      // Find button that switches to register
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, a'));
        const reg = buttons.find(b => b.textContent.includes('Create an account') || b.textContent.includes('Register') || b.textContent.includes('Sign up'));
        if (reg) reg.click();
      });
    }
    await new Promise(r => setTimeout(r, 1000));
    await saveShot('page_02_register.png');

    // -------------------------------------------------------------
    // 3. AUTHENTICATE AS DEMO USER
    // -------------------------------------------------------------
    console.log('👉 Logging in as demo user...');
    // Log in via API to get real token
    const loginData = await page.evaluate(async () => {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'demo', password: 'demo123' })
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('wardrobe_auth_token', data.token);
        localStorage.setItem('wardrobe_auth_user', JSON.stringify(data.user));
        return data;
      }
      return null;
    });

    if (!loginData) {
      throw new Error('Failed to authenticate as demo user');
    }

    // -------------------------------------------------------------
    // 4. DASHBOARD PAGE (Full view)
    // -------------------------------------------------------------
    console.log('👉 Capturing 3: Dashboard Page...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    await saveShot('page_03_dashboard.png');

    // -------------------------------------------------------------
    // 5. DIGITAL WARDROBE PAGE (All 144 items)
    // -------------------------------------------------------------
    console.log('👉 Capturing 4: Digital Wardrobe Page...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      const wardrobeBtn = navButtons.find(b => b.textContent.includes('Digital Closet') || b.textContent.includes('Wardrobe'));
      if (wardrobeBtn) wardrobeBtn.click();
    });
    await new Promise(r => setTimeout(r, 1500));
    await saveShot('page_04_wardrobe.png');

    // -------------------------------------------------------------
    // 6. ADD / EDIT CLOTHING MODAL
    // -------------------------------------------------------------
    console.log('👉 Capturing 5: Add Clothing Item Modal...');
    await page.evaluate(() => {
      const addBtns = Array.from(document.querySelectorAll('button'));
      const addBtn = addBtns.find(b => b.textContent.includes('Add Clothing Item') || b.textContent.includes('Add Item'));
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await saveShot('page_05_wardrobe_modal.png');

    // Close modal
    await page.evaluate(() => {
      const closeBtns = Array.from(document.querySelectorAll('button'));
      const cancelBtn = closeBtns.find(b => b.textContent.includes('Cancel') || b.getAttribute('aria-label') === 'Close');
      if (cancelBtn) cancelBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // -------------------------------------------------------------
    // 7. RECOMMENDATIONS PAGE (Interactive Controls)
    // -------------------------------------------------------------
    console.log('👉 Capturing 6: Style Generator Controls Page...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      const recBtn = navButtons.find(b => b.textContent.includes('Style Generator') || b.textContent.includes('Recommendations'));
      if (recBtn) recBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await saveShot('page_06_recommendations_form.png');

    // -------------------------------------------------------------
    // 8. RECOMMENDATIONS RESULTS (Generated Outfits)
    // -------------------------------------------------------------
    console.log('👉 Generating outfits & Capturing 7: Recommendations Results...');
    await page.evaluate(() => {
      const genBtn = document.querySelector('button[type="submit"]');
      if (genBtn) genBtn.click();
    });
    await new Promise(r => setTimeout(r, 2500));
    await saveShot('page_07_recommendations_results.png');

    // Also bookmark / save the top outfit for the Saved Outfits page
    await page.evaluate(() => {
      const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Save Outfit'));
      if (saveBtn) saveBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // -------------------------------------------------------------
    // 9. SAVED OUTFITS PAGE
    // -------------------------------------------------------------
    console.log('👉 Capturing 8: Saved Outfits Page...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      const savedBtn = navButtons.find(b => b.textContent.includes('Saved Looks') || b.textContent.includes('Saved Outfits') || b.textContent.includes('Saved'));
      if (savedBtn) savedBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await saveShot('page_08_saved_outfits.png');

    // -------------------------------------------------------------
    // 10. PREFERENCES PAGE
    // -------------------------------------------------------------
    console.log('👉 Capturing 9: Style & Color Preferences Page...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      const prefBtn = navButtons.find(b => b.textContent.includes('Preferences'));
      if (prefBtn) prefBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await saveShot('page_09_preferences.png');

    console.log('🎉 All 9 screenshots captured successfully!');
  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
