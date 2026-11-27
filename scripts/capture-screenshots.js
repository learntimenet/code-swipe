// Usage: node shoot.js <webDir> <outDir>
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const [webDir, outDir] = process.argv.slice(2);
const VALID = [true, false, false, true, false, false];
const DEVICES = {
  phone: { width: 360, height: 640, deviceScaleFactor: 3 },      // 1080x1920
  'tablet-7': { width: 600, height: 1066, deviceScaleFactor: 2 }, // 1200x2132
  'tablet-10': { width: 810, height: 1440, deviceScaleFactor: 2 },// 1620x2880
};
const LABELS = {
  fr: { play: 'JOUER', works: 'Ça marche', bug: 'Bug', next: 'Suivant', finish: 'Voir le résultat' },
  en: { play: 'PLAY', works: 'It works', bug: 'Bug', next: 'Next', finish: 'See results' },
};
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.png': 'image/png', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(webDir, p);
  if (!f.startsWith(path.resolve(webDir)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(webDir, 'index.html');
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function clickText(page, text) {
  const box = await page.evaluate((t) => {
    const els = [...document.querySelectorAll('div,span,button')].filter((e) => e.innerText && e.innerText.trim().includes(t) && e.innerText.trim().length <= t.length + 3);
    const el = els[els.length - 1];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, text);
  if (!box) throw new Error('not found: ' + text);
  await page.mouse.click(box.x, box.y);
  await sleep(600);
}

(async () => {
  await new Promise((r) => server.listen(0, r));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  for (const [dev, vp] of Object.entries(DEVICES)) {
    for (const lang of ['en', 'fr']) {
      const L = LABELS[lang];
      const dir = path.join(outDir, dev);
      fs.mkdirSync(dir, { recursive: true });
      const page = await browser.newPage();
      await page.setViewport({ ...vp, isMobile: true, hasTouch: false });
      await page.goto(url, { waitUntil: 'networkidle0' });
      await sleep(1200);
      await clickText(page, lang.toUpperCase());
      const shot = (n) => page.screenshot({ path: path.join(dir, `${lang}-${n}.png`) });
      await shot('1-home');
      await clickText(page, L.play);
      await shot('2-card');
      await clickText(page, VALID[0] ? L.works : L.bug);
      await clickText(page, L.next);
      // wrong answer on card 2: card stays on screen with its explanation
      await clickText(page, VALID[1] ? L.bug : L.works);
      await sleep(800);
      await shot('3-feedback');
      for (let i = 2; i < VALID.length; i++) {
        await clickText(page, L.next);
        await clickText(page, VALID[i] ? L.works : L.bug);
      }
      await clickText(page, L.finish);
      await sleep(600);
      await shot('4-result');
      await page.close();
      console.log('done', dev, lang);
    }
  }
  await browser.close();
  server.close();
})().catch((e) => { console.error(e); process.exit(1); });
