/**
 * Captures README screenshots from the running dev server.
 *
 * Usage:
 *   npm run dev            # in one terminal (http://localhost:5173)
 *   node scripts/screenshot.mjs
 *
 * Requires Playwright:  npm i -D playwright && npx playwright install chromium
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE_URL || 'http://localhost:5173'
const OUT = 'docs/screenshots'
const VIEWPORT = { width: 1280, height: 900 }

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()

async function shot(name, { path, country, before } = {}) {
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 })
  if (country) {
    await context.addInitScript((c) => {
      localStorage.setItem('shopkart.country', c)
    }, country)
  }
  const page = await context.newPage()
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  if (before) await before(page)
  // Let images + any machine translations settle.
  await page.waitForSelector('.card, .detail__title', { timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(country && country !== 'US' ? 3500 : 1200)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log(`✓ ${name}.png`)
  await context.close()
}

await shot('listing', { path: '/' })
await shot('detail', { path: '/product/1' })
await shot('filters', { path: '/?category=smartphones&sort=price-desc' })
await shot('i18n-arabic', { path: '/', country: 'SA' })

await browser.close()
console.log('Done.')
