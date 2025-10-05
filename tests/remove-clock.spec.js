import { test, expect } from '@playwright/test';

test.describe('世界時計アプリ - 時計削除機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // テスト用にいくつかの時計を追加
    const cities = ['Tokyo', 'New York', 'London'];
    
    for (const city of cities) {
      await page.click('text=時計を追加');
      await page.fill('.city-input', city);
      await page.click('.submit-btn');
      await page.waitForTimeout(100); // 少し待機
    }
  });

  test('時計を正常に削除できる', async ({ page }) => {
    // 初期状態で4つの時計がある（UTC + 3つの追加された時計）
    await expect(page.locator('.clock-card')).toHaveCount(4);

    // Tokyo時計の削除ボタンをクリック
    const tokyoClock = page.locator('.clock-card:has-text("Tokyo")');
    await expect(tokyoClock).toBeVisible();
    
    await tokyoClock.locator('.remove-btn').click();

    // Tokyo時計が削除される
    await expect(page.locator('.clock-card')).toHaveCount(3);
    await expect(page.locator('.clock-card:has-text("Tokyo")')).not.toBeVisible();

    // 他の時計は残っている
    await expect(page.locator('.clock-card:has-text("UTC")')).toBeVisible();
    await expect(page.locator('.clock-card:has-text("New York")')).toBeVisible();
    await expect(page.locator('.clock-card:has-text("London")')).toBeVisible();
  });

  test('複数の時計を削除できる', async ({ page }) => {
    // 初期状態で4つの時計がある
    await expect(page.locator('.clock-card')).toHaveCount(4);

    // New York時計を削除
    await page.locator('.clock-card:has-text("New York") .remove-btn').click();
    await expect(page.locator('.clock-card')).toHaveCount(3);
    await expect(page.locator('.clock-card:has-text("New York")')).not.toBeVisible();

    // London時計を削除
    await page.locator('.clock-card:has-text("London") .remove-btn').click();
    await expect(page.locator('.clock-card')).toHaveCount(2);
    await expect(page.locator('.clock-card:has-text("London")')).not.toBeVisible();

    // UTC時計とTokyo時計は残っている
    await expect(page.locator('.clock-card:has-text("UTC")')).toBeVisible();
    await expect(page.locator('.clock-card:has-text("Tokyo")')).toBeVisible();
  });

  test('すべての追加時計を削除してもUTC時計は残る', async ({ page }) => {
    // すべての追加された時計を削除
    const cities = ['Tokyo', 'New York', 'London'];
    
    for (const city of cities) {
      await page.locator(`.clock-card:has-text("${city}") .remove-btn`).click();
      await page.waitForTimeout(100); // 少し待機
    }

    // UTC時計のみが残る
    await expect(page.locator('.clock-card')).toHaveCount(1);
    await expect(page.locator('.clock-card:has-text("UTC")')).toBeVisible();
  });

  test('削除した時計を再度追加できる', async ({ page }) => {
    // Tokyo時計を削除
    await page.locator('.clock-card:has-text("Tokyo") .remove-btn').click();
    await expect(page.locator('.clock-card:has-text("Tokyo")')).not.toBeVisible();

    // 再度Tokyo時計を追加
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    // Tokyo時計が再び表示される
    await expect(page.locator('.clock-card:has-text("Tokyo")')).toBeVisible();
    await expect(page.locator('.clock-card:has-text("Tokyo") .remove-btn')).toBeVisible();
  });
});