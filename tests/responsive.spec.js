import { test, expect } from '@playwright/test';

test.describe('世界時計アプリ - レスポンシブデザイン', () => {
  test('デスクトップ表示で正しくレイアウトされる', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');

    // ヘッダーが横並びで表示される
    const header = page.locator('.header');
    await expect(header).toBeVisible();
    
    // タイトルと追加ボタンが横並び
    const title = page.locator('.title');
    const addBtn = page.locator('.add-btn');
    
    const titleBox = await title.boundingBox();
    const addBtnBox = await addBtn.boundingBox();
    
    // 横並びになっている（Y座標がほぼ同じ）
    expect(Math.abs(titleBox.y - addBtnBox.y)).toBeLessThan(20);

    // 時計が複数列で表示される可能性があることを確認
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    await page.click('text=時計を追加');
    await page.fill('.city-input', 'New York');
    await page.click('.submit-btn');

    await page.click('text=時計を追加');
    await page.fill('.city-input', 'London');
    await page.click('.submit-btn');

    // クロックコンテナがGrid レイアウト
    const clocksContainer = page.locator('.clocks-container');
    const containerStyles = await clocksContainer.evaluate(el => {
      return window.getComputedStyle(el).display;
    });
    expect(containerStyles).toBe('grid');
  });

  test('タブレット表示で適切にレイアウトされる', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // ヘッダーが縦並びに変わる
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    // モーダルが適切なサイズで表示される
    await page.click('text=時計を追加');
    const modal = page.locator('.modal-content');
    
    const modalBox = await modal.boundingBox();
    expect(modalBox.width).toBeLessThan(600); // モバイル向けの幅制限
  });

  test('モバイル表示で正しく動作する', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE サイズ
    await page.goto('/');

    // ヘッダーが縦並びで表示される
    const header = page.locator('.header');
    await expect(header).toBeVisible();

    // 時計が1列で表示される
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    await page.click('text=時計を追加');
    await page.fill('.city-input', 'London');
    await page.click('.submit-btn');

    const clocks = page.locator('.clock-card');
    await expect(clocks).toHaveCount(3);

    // すべての時計が縦に並んでいることを確認
    const clockBoxes = await clocks.all();
    for (let i = 0; i < clockBoxes.length - 1; i++) {
      const currentBox = await clockBoxes[i].boundingBox();
      const nextBox = await clockBoxes[i + 1].boundingBox();
      
      // 次の時計が下に配置されている
      expect(nextBox.y).toBeGreaterThan(currentBox.y + currentBox.height - 50);
    }
  });

  test('モバイルでモーダルが適切に表示される', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // モーダルを開く
    await page.click('text=時計を追加');

    const modal = page.locator('.modal-content');
    const modalBox = await modal.boundingBox();
    
    // モーダルが画面幅のほとんどを占める
    expect(modalBox.width).toBeGreaterThan(300);
    expect(modalBox.width).toBeLessThan(375);

    // マージンが適切に設定されている
    expect(modalBox.x).toBeGreaterThan(10);
    expect(modalBox.x).toBeLessThan(50);
  });

  test('タッチデバイスで操作できる', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 時計を追加
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    // タッチで削除ボタンをタップ
    const removeBtn = page.locator('.clock-card:has-text("Tokyo") .remove-btn');
    await expect(removeBtn).toBeVisible();
    
    // タッチイベントをシミュレート
    await removeBtn.tap();

    // Tokyo時計が削除される
    await expect(page.locator('.clock-card:has-text("Tokyo")')).not.toBeVisible();
  });

  test('画面回転に対応している', async ({ page }) => {
    // 縦向きで開始
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await page.click('text=時計を追加');
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    await expect(page.locator('.clock-card')).toHaveCount(2);

    // 横向きに回転
    await page.setViewportSize({ width: 667, height: 375 });

    // 時計が正常に表示される
    await expect(page.locator('.clock-card')).toHaveCount(2);
    await expect(page.locator('.clock-card:has-text("UTC")')).toBeVisible();
    await expect(page.locator('.clock-card:has-text("Tokyo")')).toBeVisible();

    // 新しい時計を追加できる
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'London');
    await page.click('.submit-btn');

    await expect(page.locator('.clock-card')).toHaveCount(3);
  });

  test('フォントサイズが適切にスケールされる', async ({ page }) => {
    // デスクトップサイズ
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');

    const titleDesktop = page.locator('.title');
    const titleFontSizeDesktop = await titleDesktop.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });

    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 });

    const titleFontSizeMobile = await titleDesktop.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });

    // モバイルの方がフォントサイズが小さい
    const desktopSize = parseFloat(titleFontSizeDesktop);
    const mobileSize = parseFloat(titleFontSizeMobile);
    expect(mobileSize).toBeLessThanOrEqual(desktopSize);
  });
});