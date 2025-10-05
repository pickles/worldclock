import { test, expect } from '@playwright/test';
import { 
  addClock, 
  removeClock, 
  addMultipleClocks, 
  getClockCount, 
  isClockVisible,
  clearLocalStorage,
  setClockSettings,
  getClockSettings,
  isValidTimeFormat,
  isValidDateFormat
} from './helpers.js';

test.describe('世界時計アプリ - 統合テスト', () => {
  test('完全なユーザーワークフロー', async ({ page }) => {
    await page.goto('/');

    // 1. 初期状態の確認
    expect(await getClockCount(page)).toBe(1);
    expect(await isClockVisible(page, 'UTC')).toBe(true);

    // 2. 複数の時計を追加
    const cities = ['Tokyo', 'New York', 'London', 'Sydney'];
    await addMultipleClocks(page, cities);

    expect(await getClockCount(page)).toBe(5); // UTC + 4都市

    // 3. すべての都市が表示されることを確認
    for (const city of cities) {
      expect(await isClockVisible(page, city)).toBe(true);
    }

    // 4. 一部の時計を削除
    await removeClock(page, 'New York');
    await removeClock(page, 'Sydney');

    expect(await getClockCount(page)).toBe(3); // UTC + Tokyo + London
    expect(await isClockVisible(page, 'New York')).toBe(false);
    expect(await isClockVisible(page, 'Sydney')).toBe(false);

    // 5. ページリロード後も設定が保持される
    await page.reload();
    expect(await getClockCount(page)).toBe(3);
    expect(await isClockVisible(page, 'Tokyo')).toBe(true);
    expect(await isClockVisible(page, 'London')).toBe(true);

    // 6. 削除した時計を再追加
    await addClock(page, 'New York');
    expect(await getClockCount(page)).toBe(4);
    expect(await isClockVisible(page, 'New York')).toBe(true);

    // 7. 重複追加を試行（エラー確認）
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    // エラーメッセージが表示される
    await expect(page.locator('.error-message')).toContainText('この都市の時計は既に追加されています');
    expect(await getClockCount(page)).toBe(4); // 変わらず

    await page.click('.cancel-btn'); // モーダルを閉じる

    // 8. すべての追加時計を削除
    await removeClock(page, 'Tokyo');
    await removeClock(page, 'London');
    await removeClock(page, 'New York');

    expect(await getClockCount(page)).toBe(1); // UTCのみ
    expect(await isClockVisible(page, 'UTC')).toBe(true);
  });

  test('時刻表示の正確性テスト', async ({ page }) => {
    await page.goto('/');

    // 複数の時計を追加
    await addMultipleClocks(page, ['Tokyo', 'New York', 'London']);

    // 各時計の時刻表示を確認
    const clocks = await page.locator('.clock-card').all();
    
    for (const clock of clocks) {
      const timeText = await clock.locator('.time-display').textContent();
      const dateText = await clock.locator('.date-display').textContent();

      // 時刻フォーマットの確認
      expect(isValidTimeFormat(timeText)).toBe(true);
      expect(isValidDateFormat(dateText)).toBe(true);
    }

    // 時刻が更新されることを確認
    const utcTimeInitial = await page.locator('[data-timezone="UTC"] .time-display').textContent();
    await page.waitForTimeout(2000);
    const utcTimeAfter = await page.locator('[data-timezone="UTC"] .time-display').textContent();

    // 2秒後に時刻が変わっている
    expect(utcTimeInitial).not.toBe(utcTimeAfter);
  });

  test('エラーハンドリングとリカバリ', async ({ page }) => {
    await page.goto('/');

    // 1. 無効な都市名でエラー
    await page.click('text=時計を追加');
    await page.fill('.city-input', 'InvalidCityName123');
    await page.click('.submit-btn');

    await expect(page.locator('.error-message')).toContainText('対応していない都市です');

    // 2. エラー後に正常な都市を追加
    await page.fill('.city-input', 'Tokyo');
    await page.click('.submit-btn');

    expect(await getClockCount(page)).toBe(2);
    expect(await isClockVisible(page, 'Tokyo')).toBe(true);

    // 3. LocalStorageを破損させる
    await page.evaluate(() => {
      localStorage.setItem('worldClockSettings', 'invalid json data');
    });

    await page.reload();

    // アプリが正常動作する（UTCのみ表示）
    expect(await getClockCount(page)).toBe(1);
    expect(await isClockVisible(page, 'UTC')).toBe(true);

    // 4. 正常に時計を追加できる
    await addClock(page, 'London');
    expect(await getClockCount(page)).toBe(2);
  });

  test('複数タブでの同期テスト', async ({ context }) => {
    // タブ1で時計を追加
    const page1 = await context.newPage();
    await page1.goto('/');
    await addClock(page1, 'Tokyo');

    // タブ2を開く
    const page2 = await context.newPage();
    await page2.goto('/');

    // タブ2でも同じ時計が表示される
    expect(await getClockCount(page2)).toBe(2);
    expect(await isClockVisible(page2, 'Tokyo')).toBe(true);

    // タブ2で時計を追加
    await addClock(page2, 'London');

    // タブ1をリロードして変更を確認
    await page1.reload();
    expect(await getClockCount(page1)).toBe(3);
    expect(await isClockVisible(page1, 'London')).toBe(true);

    await page1.close();
    await page2.close();
  });

  test('大量データのパフォーマンステスト', async ({ page }) => {
    await page.goto('/');

    // 10個の時計を追加
    const cities = [
      'Tokyo', 'New York', 'London', 'Paris', 'Berlin',
      'Sydney', 'Mumbai', 'Dubai', 'Singapore', 'Seoul'
    ];

    const startTime = Date.now();
    await addMultipleClocks(page, cities);
    const endTime = Date.now();

    // 10個の時計追加が5秒以内に完了する
    expect(endTime - startTime).toBeLessThan(5000);

    // すべての時計が正常に表示される
    expect(await getClockCount(page)).toBe(11); // UTC + 10都市

    // ページの描画パフォーマンスを確認
    const perfEntries = await page.evaluate(() => {
      return performance.getEntriesByType('navigation')[0];
    });

    // DOMContentLoadedが2秒以内
    expect(perfEntries.domContentLoadedEventEnd - perfEntries.navigationStart).toBeLessThan(2000);
  });

  test('データ整合性テスト', async ({ page }) => {
    await page.goto('/');

    // 時計を追加
    const testCities = ['Tokyo', 'New York', 'London'];
    await addMultipleClocks(page, testCities);

    // LocalStorageの内容を確認
    const settings = await getClockSettings(page);
    expect(settings).toHaveLength(3);

    for (let i = 0; i < testCities.length; i++) {
      expect(settings[i].city).toBe(testCities[i]);
      expect(settings[i].timezone).toBeTruthy();
      expect(settings[i].id).toBeTruthy();
    }

    // 時計を削除
    await removeClock(page, 'New York');

    // LocalStorageが更新される
    const updatedSettings = await getClockSettings(page);
    expect(updatedSettings).toHaveLength(2);
    expect(updatedSettings.find(s => s.city === 'New York')).toBeUndefined();
    expect(updatedSettings.find(s => s.city === 'Tokyo')).toBeTruthy();
    expect(updatedSettings.find(s => s.city === 'London')).toBeTruthy();
  });

  test('ネットワーク障害時の動作', async ({ page }) => {
    await page.goto('/');

    // 時計を追加
    await addClock(page, 'Tokyo');

    // ネットワークを無効にする
    await page.context().setOffline(true);

    // オフラインでもアプリが動作する
    expect(await getClockCount(page)).toBe(2);
    expect(await isClockVisible(page, 'UTC')).toBe(true);
    expect(await isClockVisible(page, 'Tokyo')).toBe(true);

    // 時刻が更新される
    const timeInitial = await page.locator('[data-timezone="UTC"] .time-display').textContent();
    await page.waitForTimeout(2000);
    const timeAfter = await page.locator('[data-timezone="UTC"] .time-display').textContent();
    expect(timeInitial).not.toBe(timeAfter);

    // 時計の削除も動作する
    await removeClock(page, 'Tokyo');
    expect(await getClockCount(page)).toBe(1);

    // ネットワークを復元
    await page.context().setOffline(false);

    // 正常に動作する
    await addClock(page, 'London');
    expect(await getClockCount(page)).toBe(2);
  });
});