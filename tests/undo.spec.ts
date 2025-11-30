import { test, expect } from '@playwright/test';

test.describe('Undo/Redo Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should undo and redo drawing operations', async ({ page }) => {
    await page.click('button:has-text("Point")');
    await page.waitForTimeout(1000);

    const map = page.locator('.leaflet-container');
    const bbox = await map.boundingBox();

    if (bbox) {
      await page.mouse.click(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
    }

    await page.waitForTimeout(1500);

    let aoiListText = await page
      .locator('h2:has-text("AOI List")')
      .textContent();
    expect(aoiListText).toContain('1');

    await page.click('button:has-text("Undo")');
    await page.waitForTimeout(500);

    aoiListText = await page.locator('h2:has-text("AOI List")').textContent();
    expect(aoiListText).toContain('0');

    await page.click('button:has-text("Redo")');
    await page.waitForTimeout(500);

    aoiListText = await page.locator('h2:has-text("AOI List")').textContent();
    expect(aoiListText).toContain('1');
  });

  test('should handle undo/redo with keyboard shortcuts', async ({ page }) => {
    await page.click('button:has-text("Point")');
    await page.waitForTimeout(1000);

    const map = page.locator('.leaflet-container');
    const bbox = await map.boundingBox();

    if (bbox) {
      await page.mouse.click(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
    }

    await page.waitForTimeout(1500);

    let aoiListText = await page
      .locator('h2:has-text("AOI List")')
      .textContent();
    expect(aoiListText).toContain('1');

    await page.keyboard.press('Control+Z');
    await page.waitForTimeout(500);

    aoiListText = await page.locator('h2:has-text("AOI List")').textContent();
    expect(aoiListText).toContain('0');

    await page.keyboard.press('Control+Y');
    await page.waitForTimeout(500);

    aoiListText = await page.locator('h2:has-text("AOI List")').textContent();
    expect(aoiListText).toContain('1');
  });

  test('should undo delete operations', async ({ page }) => {
    await page.click('button:has-text("Point")');
    await page.waitForTimeout(1000);

    const map = page.locator('.leaflet-container');
    const bbox = await map.boundingBox();

    if (bbox) {
      await page.mouse.click(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
    }

    await page.waitForTimeout(1500);

    // Click the AOI to select it
    const aoiButton = page
      .locator('button')
      .filter({ hasText: 'Point' })
      .first();
    await aoiButton.click();
    await page.waitForTimeout(500);

    // Delete the AOI
    await page.click('button:has-text("Delete AOI")');
    await page.waitForTimeout(500);

    let aoiListText = await page
      .locator('h2:has-text("AOI List")')
      .textContent();
    expect(aoiListText).toContain('0');

    await page.click('button:has-text("Undo")');
    await page.waitForTimeout(500);

    aoiListText = await page.locator('h2:has-text("AOI List")').textContent();
    expect(aoiListText).toContain('1');
  });
});
