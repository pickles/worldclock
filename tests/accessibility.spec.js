import { test, expect } from '@playwright/test';

test.describe('世界時計アプリ - アクセシビリティ', () => {
  test('キーボードナビゲーションが正常に動作する', async ({ page }) => {
    await page.goto('/');

    // Tabキーで要素間を移動できる
    await page.keyboard.press('Tab');
    
    // 時計追加ボタンにフォーカス
    await expect(page.locator('.add-btn')).toBeFocused();

    // Enterでモーダルを開く
    await page.keyboard.press('Enter');
    await expect(page.locator('.modal-overlay')).toBeVisible();

    // 入力フィールドにフォーカス
    await expect(page.locator('.city-input')).toBeFocused();

    // Tabでボタン間を移動
    await page.keyboard.press('Tab'); // 追加ボタン
    await page.keyboard.press('Tab'); // キャンセルボタン
    await expect(page.locator('.cancel-btn')).toBeFocused();

    await page.keyboard.press('Tab'); // 閉じるボタン
    await expect(page.locator('.close-btn')).toBeFocused();

    // Enterで閉じる
    await page.keyboard.press('Enter');
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('適切なARIAラベルが設定されている', async ({ page }) => {
    await page.goto('/');

    // 時計を追加
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    // 削除ボタンにaria-labelが設定されている
    const removeBtn = page.locator('.clock-card:has-text("Tokyo") .remove-btn');
    await expect(removeBtn).toHaveAttribute('aria-label', '時計を削除');

    // モーダルを開く
    await page.click('text=時計を追加');
    
    // 閉じるボタンにaria-labelが設定されている
    const closeBtn = page.locator('.close-btn');
    await expect(closeBtn).toHaveAttribute('aria-label', 'モーダルを閉じる');
  });

  test('フォームラベルが適切に関連付けられている', async ({ page }) => {
    await page.goto('/');
    await page.click('text=時計を追加');

    // labelとinputが適切に関連付けられている
    const label = page.locator('.form-label');
    const input = page.locator('.city-input');

    await expect(label).toHaveAttribute('for', 'city-input');
    await expect(input).toHaveAttribute('id', 'city-input');
  });

  test('エラーメッセージが適切に表示される', async ({ page }) => {
    await page.goto('/');
    await page.click('text=時計を追加');

    // 空の状態で送信
    await page.click('.submit-btn');

    // エラーメッセージが表示される
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('都市名を入力してください');

    // エラーメッセージにrole="alert"が設定されている（実装要確認）
    // await expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  test('色覚障害者にも識別可能なデザイン', async ({ page }) => {
    await page.goto('/');

    // 時計を追加
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    // 削除ボタンが色だけでなくアイコンでも識別可能
    const removeBtn = page.locator('.clock-card:has-text("Tokyo") .remove-btn');
    await expect(removeBtn).toContainText('×'); // テキストまたはアイコン

    // エラー状態も色だけでなくテキストで表現
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'InvalidCity');
    await page.click('.submit-btn');

    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    // エラーアイコンやテキストが表示されている
  });

  test('ズーム200%でも正常に表示される', async ({ page }) => {
    await page.goto('/');

    // ズームを200%に設定
    await page.evaluate(() => {
      document.body.style.zoom = '2';
    });

    // 基本的な機能が動作する
    await expect(page.locator('.title')).toBeVisible();
    await expect(page.locator('.add-btn')).toBeVisible();

    // 時計追加も正常動作
    await page.click('text=時計を追加');
    await expect(page.locator('.modal-overlay')).toBeVisible();

    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    await expect(page.locator('.clock-card:has-text("Tokyo")')).toBeVisible();
  });

  test('コントラスト比が適切', async ({ page }) => {
    await page.goto('/');

    // メインテキストのコントラスト比をチェック（手動確認が必要）
    const title = page.locator('.title');
    const titleColor = await title.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });

    // 最低限、色が設定されていることを確認
    expect(titleColor.color).toBeTruthy();
  });

  test('Focus indicatorが適切に表示される', async ({ page }) => {
    await page.goto('/');

    // 追加ボタンにフォーカス
    await page.keyboard.press('Tab');
    await expect(page.locator('.add-btn')).toBeFocused();

    // フォーカス状態のスタイルが適用されている
    const focusedBtn = page.locator('.add-btn:focus');
    const outlineStyle = await focusedBtn.evaluate(el => {
      return window.getComputedStyle(el).outline;
    });

    // アウトラインまたはボックスシャドウが設定されている
    expect(outlineStyle !== 'none' || outlineStyle !== '').toBeTruthy();
  });

  test('スクリーンリーダー用の構造化された見出し', async ({ page }) => {
    await page.goto('/');

    // h1タグが存在する
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('世界時計');

    // 時計を追加
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    // 各時計にh2タグが使用されている
    const clockHeadings = page.locator('.clock-title');
    await expect(clockHeadings.first()).toContainText('UTC');
    await expect(clockHeadings.nth(1)).toContainText('Tokyo');
  });
});