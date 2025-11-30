import { test, expect } from '@playwright/test';

test.describe('Drawing and Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should draw polygon, save, and persist after reload', async ({
    page,
  }) => {
    // Click polygon button
    await page.click('button:has-text("Polygon")');

    // Wait for drawing mode to activate
    await page.waitForTimeout(1000);

    // Verify polygon button is active
    const polygonBtn = page.locator('button:has-text("Polygon")');
    await expect(polygonBtn).toHaveClass(/bg-blue-600/);

    const map = page.locator('.leaflet-container');
    const bbox = await map.boundingBox();

    if (bbox) {
      // Draw polygon by clicking 5 points (last point closes the polygon)
      await page.mouse.click(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
      await page.waitForTimeout(200);
      await page.mouse.click(
        bbox.x + bbox.width / 2 + 50,
        bbox.y + bbox.height / 2
      );
      await page.waitForTimeout(200);
      await page.mouse.click(
        bbox.x + bbox.width / 2 + 50,
        bbox.y + bbox.height / 2 + 50
      );
      await page.waitForTimeout(200);
      await page.mouse.click(
        bbox.x + bbox.width / 2,
        bbox.y + bbox.height / 2 + 50
      );
      await page.waitForTimeout(200);
      // Double click or click first point to complete polygon
      await page.mouse.click(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
    }

    await page.waitForTimeout(1500);

    // Check AOI count in sidebar
    const aoiListText = await page
      .locator('h2:has-text("AOI List")')
      .textContent();
    expect(aoiListText).toContain('1');

    await page.reload();
    await page.waitForTimeout(1000);

    // Verify AOI persisted after reload
    const aoiListTextAfterReload = await page
      .locator('h2:has-text("AOI List")')
      .textContent();
    expect(aoiListTextAfterReload).toContain('1');
  });

  test('should persist map center and zoom after reload', async ({ page }) => {
    await page.click('button[aria-label="Zoom in"]');
    await page.waitForTimeout(500);
    await page.click('button[aria-label="Zoom in"]');
    await page.waitForTimeout(500);

    const mapState = await page.evaluate(() => {
      return localStorage.getItem('mapState');
    });

    expect(mapState).toBeTruthy();

    await page.reload();
    await page.waitForTimeout(1000);

    const mapStateAfterReload = await page.evaluate(() => {
      return localStorage.getItem('mapState');
    });

    expect(mapStateAfterReload).toBe(mapState);
  });

  test('should draw circle with edit mode', async ({ page }) => {
    await page.click('button:has-text("Circle")');

    await page.waitForTimeout(1000);

    const map = page.locator('.leaflet-container');
    const bbox = await map.boundingBox();

    if (bbox) {
      await page.mouse.click(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
      await page.waitForTimeout(200);
      await page.mouse.move(
        bbox.x + bbox.width / 2 + 100,
        bbox.y + bbox.height / 2
      );
      await page.waitForTimeout(200);
      await page.mouse.click(
        bbox.x + bbox.width / 2 + 100,
        bbox.y + bbox.height / 2
      );
    }

    await page.waitForTimeout(1500);

    const aoiListText = await page
      .locator('h2:has-text("AOI List")')
      .textContent();
    expect(aoiListText).toContain('1');

    await page.click('button:has-text("Enable Shape Editing")');
    await page.waitForTimeout(500);

    const editButton = page.locator('button:has-text("Edit Shapes Enabled")');
    await expect(editButton).toBeVisible();
  });

  test('should cancel drawing with ESC key', async ({ page }) => {
    await page.click('button:has-text("Polygon")');
    await page.waitForTimeout(1000);

    const polygonButton = page.locator('button:has-text("Polygon")');
    await expect(polygonButton).toHaveClass(/bg-blue-600/);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    await expect(polygonButton).not.toHaveClass(/bg-blue-600/);
  });
});
