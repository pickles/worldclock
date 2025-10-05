import { test, expect } from '@playwright/test';

test.describe('世界時計アプリ - 基本機能', () => {
  test('アプリケーションが正常に読み込まれる', async ({ page }) => {
    await page.goto('/');

    // ページタイトルの確認
    await expect(page).toHaveTitle(/世界時計/);

    // メインヘッダーの確認
    await expect(page.locator('h1')).toContainText('世界時計');

    // UTC時計が表示されている
    await expect(page.locator('[data-timezone="UTC"]')).toBeVisible();
    
    // 時計追加ボタンが表示されている
    await expect(page.locator('text=時計を追加')).toBeVisible();
  });

  test('UTC時計が正しく動作する', async ({ page }) => {
    await page.goto('/');

    // UTC時計カードの確認
    const utcClock = page.locator('[data-timezone="UTC"]');
    await expect(utcClock).toBeVisible();

    // UTC表示の確認
    await expect(utcClock.locator('h2')).toContainText('UTC');
    await expect(utcClock.locator('.timezone-info')).toContainText('協定世界時');

    // 時刻表示の確認（HH:MM:SS形式）
    const timeDisplay = utcClock.locator('.time-display');
    await expect(timeDisplay).toBeVisible();
    
    // 時刻が更新されることを確認（少し待機して変化を確認）
    const initialTime = await timeDisplay.textContent();
    await page.waitForTimeout(2000);
    const updatedTime = await timeDisplay.textContent();
    
    // 時刻フォーマットの確認
    expect(initialTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(updatedTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);

    // 日付表示の確認
    const dateDisplay = utcClock.locator('.date-display');
    await expect(dateDisplay).toBeVisible();
    const dateText = await dateDisplay.textContent();
    expect(dateText).toMatch(/^\d{4}\/\d{2}\/\d{2}$/);
  });

  test('削除ボタンがUTC時計には表示されない', async ({ page }) => {
    await page.goto('/');

    const utcClock = page.locator('[data-timezone="UTC"]');
    await expect(utcClock.locator('.remove-btn')).not.toBeVisible();
  });
});