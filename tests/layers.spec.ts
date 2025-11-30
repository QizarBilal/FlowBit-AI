import { test, expect } from '@playwright/test';

test.describe('Layer Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should toggle WMS layer visibility', async ({ page }) => {
    const wmsToggle = page.locator('button:has-text("WMS")');

    await expect(wmsToggle).toBeVisible();

    await wmsToggle.click();
    await page.waitForTimeout(300);

    const layerState = await page.evaluate(() => {
      return localStorage.getItem('layerState');
    });

    expect(layerState).toBeTruthy();

    await wmsToggle.click();
    await page.waitForTimeout(300);
  });

  test('should toggle AOI layer visibility', async ({ page }) => {
    await page.click('button:has-text("Point")');

    await page.waitForTimeout(1000);

    const map = page.locator('.leaflet-container');
    const bbox = await map.boundingBox();

    if (bbox) {
      await page.mouse.click(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
    }

    await page.waitForTimeout(1500);

    const aoiToggle = page.locator('button:has-text("AOI")');
    await aoiToggle.click();
    await page.waitForTimeout(500);

    await aoiToggle.click();
    await page.waitForTimeout(500);
  });

  test('should persist layer visibility after reload', async ({ page }) => {
    const wmsToggle = page.locator('button:has-text("WMS")');
    await wmsToggle.click();
    await page.waitForTimeout(500);

    const layerStateBefore = await page.evaluate(() => {
      return localStorage.getItem('layerState');
    });

    await page.reload();
    await page.waitForTimeout(1000);

    const layerStateAfter = await page.evaluate(() => {
      return localStorage.getItem('layerState');
    });

    expect(layerStateAfter).toBe(layerStateBefore);
  });
});
