import { test, expect } from '@playwright/test';

test.describe('世界時計アプリ - LocalStorage永続化', () => {
  test('追加した時計がページリロード後も保持される', async ({ page }) => {
    await page.goto('/');

    // 初期状態でUTC時計のみ
    await expect(page.locator('.clock-card')).toHaveCount(1);

    // いくつかの時計を追加
    const cities = ['Tokyo', 'New York', 'London'];
    
    for (const city of cities) {
      await page.click('text=時計を追加');
      await page.fill('.city-input', city);
      await page.click('.submit-btn');
      await page.waitForTimeout(100);
    }

    // 4つの時計が表示されることを確認
    await expect(page.locator('.clock-card')).toHaveCount(4);

    // ページをリロード
    await page.reload();

    // リロード後も同じ時計が表示される
    await expect(page.locator('.clock-card')).toHaveCount(4);
    await expect(page.locator('.clock-card:has-text("UTC")')).toBeVisible();
    await expect(page.locator('.clock-card:has-text("Tokyo")')).toBeVisible();
    await expect(page.locator('.clock-card:has-text("New York")')).toBeVisible();
    await expect(page.locator('.clock-card:has-text("London")')).toBeVisible();
  });

  test('削除した時計がページリロード後も削除されたまま', async ({ page }) => {
    await page.goto('/');

    // 時計を追加
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    await page.click('text=時計を追加');
    await page.fill('.city-input', 'London');
    await page.click('.submit-btn');

    // 3つの時計があることを確認
    await expect(page.locator('.clock-card')).toHaveCount(3);

    // Tokyo時計を削除
    await page.locator('.clock-card:has-text("Tokyo") .remove-btn').click();
    await expect(page.locator('.clock-card')).toHaveCount(2);

    // ページをリロード
    await page.reload();

    // リロード後もTokyo時計は削除されたまま
    await expect(page.locator('.clock-card')).toHaveCount(2);
    await expect(page.locator('.clock-card:has-text("UTC")')).toBeVisible();
    await expect(page.locator('.clock-card:has-text("London")')).toBeVisible();
    await expect(page.locator('.clock-card:has-text("Tokyo")')).not.toBeVisible();
  });

  test('新しいブラウザタブでも時計設定が共有される', async ({ context }) => {
    // 最初のページで時計を追加
    const page1 = await context.newPage();
    await page1.goto('/');

    await page1.click('text=時計を追加');
    await page1.fill('.city-input', 'Tokyo');
    await page1.click('.submit-btn');

    await expect(page1.locator('.clock-card')).toHaveCount(2);

    // 新しいタブを開く
    const page2 = await context.newPage();
    await page2.goto('/');

    // 新しいタブでも同じ時計が表示される
    await expect(page2.locator('.clock-card')).toHaveCount(2);
    await expect(page2.locator('.clock-card:has-text("Tokyo")')).toBeVisible();

    // 新しいタブで時計を追加
    await page2.click('text=時計を追加');
    await page2.fill('.city-input', 'London');
    await page2.click('.submit-btn');

    await expect(page2.locator('.clock-card')).toHaveCount(3);

    // 最初のタブをリロードして変更が反映されるか確認
    await page1.reload();
    await expect(page1.locator('.clock-card')).toHaveCount(3);
    await expect(page1.locator('.clock-card:has-text("London")')).toBeVisible();

    await page1.close();
    await page2.close();
  });

  test('LocalStorageが空の場合はUTC時計のみ表示', async ({ page }) => {
    // LocalStorageをクリア
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });

    // ページをリロード
    await page.reload();

    // UTC時計のみが表示される
    await expect(page.locator('.clock-card')).toHaveCount(1);
    await expect(page.locator('.clock-card:has-text("UTC")')).toBeVisible();
  });

  test('不正なLocalStorageデータがある場合もアプリが正常動作', async ({ page }) => {
    await page.goto('/');

    // 不正なデータをLocalStorageに設定
    await page.evaluate(() => {
      localStorage.setItem('worldClockSettings', 'invalid json');
    });

    // ページをリロード
    await page.reload();

    // エラーにならずUTC時計のみが表示される
    await expect(page.locator('.clock-card')).toHaveCount(1);
    await expect(page.locator('.clock-card:has-text("UTC")')).toBeVisible();

    // 新しい時計を追加しても正常動作
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    await expect(page.locator('.clock-card')).toHaveCount(2);
  });
});