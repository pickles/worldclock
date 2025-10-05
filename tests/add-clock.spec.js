import { test, expect } from '@playwright/test';

test.describe('世界時計アプリ - 時計追加機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('時計追加モーダルが正しく開閉される', async ({ page }) => {
    // モーダルが初期状態では表示されていない
    await expect(page.locator('.modal-overlay')).not.toBeVisible();

    // 時計追加ボタンをクリック
    await page.click('text=時計を追加');

    // モーダルが表示される
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('.modal-title')).toContainText('時計を追加');
    await expect(page.locator('.city-input')).toBeVisible();

    // 閉じるボタンでモーダルを閉じる
    await page.click('.close-btn');
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('都市名の候補表示機能が動作する', async ({ page }) => {
    // モーダルを開く
    await page.click('text=時計を追加');

    // 都市名を入力
    await page.fill('.city-input', 'Tok');

    // 候補が表示される
    await expect(page.locator('.suggestions')).toBeVisible();
    await expect(page.locator('.suggestion-item')).toContainText('Tokyo');

    // 候補をクリックして選択
    await page.click('.suggestion-item:has-text("Tokyo")');

    // 入力フィールドに選択した都市名が入る
    await expect(page.locator('.city-input')).toHaveValue('Tokyo');
    await expect(page.locator('.suggestions')).not.toBeVisible();
  });

  test('新しい時計を正常に追加できる', async ({ page }) => {
    // 初期状態で時計は1つ（UTC）のみ
    await expect(page.locator('.clock-card')).toHaveCount(1);

    // モーダルを開く
    await page.click('text=時計を追加');

    // 都市名を入力
    await page.fill('.city-input', 'Tokyo');

    // 追加ボタンをクリック
    await page.click('.submit-btn');

    // モーダルが閉じる
    await expect(page.locator('.modal-overlay')).not.toBeVisible();

    // 新しい時計が追加される
    await expect(page.locator('.clock-card')).toHaveCount(2);
    
    // Tokyo時計の確認
    const tokyoClock = page.locator('.clock-card:has-text("Tokyo")');
    await expect(tokyoClock).toBeVisible();
    await expect(tokyoClock.locator('h2')).toContainText('Tokyo');
    await expect(tokyoClock.locator('.remove-btn')).toBeVisible();
  });

  test('複数の時計を追加できる', async ({ page }) => {
    const cities = ['Tokyo', 'New York', 'London'];

    for (let i = 0; i < cities.length; i++) {
      // モーダルを開く
      await page.click('text=時計を追加');

      // 都市名を入力
      await page.fill('.city-input', cities[i]);

      // 追加ボタンをクリック
      await page.click('.submit-btn');

      // 時計が追加されることを確認
      await expect(page.locator('.clock-card')).toHaveCount(i + 2); // UTC + 追加された時計
    }

    // すべての都市の時計が表示されることを確認
    for (const city of cities) {
      await expect(page.locator(`.clock-card:has-text("${city}")`)).toBeVisible();
    }
  });

  test('同じ都市の時計は重複追加できない', async ({ page }) => {
    // 最初にTokyo時計を追加
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    // 再度Tokyo時計を追加しようとする
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    // エラーメッセージが表示される
    await expect(page.locator('.error-message')).toContainText('この都市の時計は既に追加されています');

    // 時計は1つのまま（UTC + Tokyo = 2つ）
    await expect(page.locator('.clock-card')).toHaveCount(2);
  });

  test('無効な都市名でエラーが表示される', async ({ page }) => {
    // モーダルを開く
    await page.click('text=時計を追加');

    // 無効な都市名を入力
    await page.fill('.city-input', 'InvalidCity123');

    // 追加ボタンをクリック
    await page.click('.submit-btn');

    // エラーメッセージが表示される
    await expect(page.locator('.error-message')).toContainText('対応していない都市です');

    // モーダルは開いたまま
    await expect(page.locator('.modal-overlay')).toBeVisible();
  });

  test('空の都市名でエラーが表示される', async ({ page }) => {
    // モーダルを開く
    await page.click('text=時計を追加');

    // 空の状態で追加ボタンをクリック
    await page.click('.submit-btn');

    // エラーメッセージが表示される
    await expect(page.locator('.error-message')).toContainText('都市名を入力してください');
  });

  test('Escキーでモーダルを閉じることができる', async ({ page }) => {
    // モーダルを開く
    await page.click('text=時計を追加');
    await expect(page.locator('.modal-overlay')).toBeVisible();

    // Escキーを押す
    await page.keyboard.press('Escape');

    // モーダルが閉じる
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });
});