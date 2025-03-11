const puppeteer = require('puppeteer');
const { getLCP, getFID, getCLS } = require('web-vitals');
const fs = require('fs');

async function collectWebVitals() {
  // Launch Puppeteer with --no-sandbox option
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://developing.conectafapes.leds.dev.br');

  // Collect LCP (Largest Contentful Paint)
  await page.evaluate(async () => {
    const { getLCP } = window.webVitals;
    const lcp = await getLCP();
    window.lcp = lcp;
  });

  const lcpMetric = await page.evaluate(() => window.lcp);

  if (lcpMetric) {
    log.info(lcpMetric);
    fs.writeFileSync('lcp_metric.json', JSON.stringify(lcpMetric, null, 2));
  } else {
    console.error('Failed to collect LCP metric');
  }

  // Close the browser after metrics are collected
  await browser.close();
}

collectWebVitals().catch(console.error);
