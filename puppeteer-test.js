import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
      console.log(`BROWSER CONSOLE: ${msg.type().toUpperCase()} - ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      console.log(`BROWSER PAGE ERROR: ${error.message}`);
    });

    await page.goto('http://localhost:3002/admin/meetings', { waitUntil: 'domcontentloaded' });
    
    await new Promise(r => setTimeout(r, 2000)); // wait 2 seconds
    
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log("HTML_LENGTH:", bodyHTML.length);
    const textContent = await page.evaluate(() => document.body.innerText);
    console.log("PAGE_TEXT:", textContent);

    await browser.close();
  } catch(e) {
    console.error('Puppeteer Script Error:', e);
    process.exit(1);
  }
})();
