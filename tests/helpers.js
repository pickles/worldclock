// テスト用のヘルパー関数

/**
 * 指定した都市の時計を追加する
 * @param {import('@playwright/test').Page} page
 * @param {string} cityName
 */
export async function addClock(page, cityName) {
  await page.click('text=時計を追加');
  await page.fill('.city-input', cityName);
  await page.click('.submit-btn');
  await page.waitForTimeout(100); // アニメーション待機
}

/**
 * 指定した都市の時計を削除する
 * @param {import('@playwright/test').Page} page
 * @param {string} cityName
 */
export async function removeClock(page, cityName) {
  await page.locator(`.clock-card:has-text("${cityName}") .remove-btn`).click();
  await page.waitForTimeout(100); // アニメーション待機
}

/**
 * 複数の都市の時計を一度に追加する
 * @param {import('@playwright/test').Page} page
 * @param {string[]} cities
 */
export async function addMultipleClocks(page, cities) {
  for (const city of cities) {
    await addClock(page, city);
  }
}

/**
 * 現在表示されている時計の数を取得する
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<number>}
 */
export async function getClockCount(page) {
  return await page.locator('.clock-card').count();
}

/**
 * 指定した都市の時計が表示されているかチェック
 * @param {import('@playwright/test').Page} page
 * @param {string} cityName
 * @returns {Promise<boolean>}
 */
export async function isClockVisible(page, cityName) {
  return await page.locator(`.clock-card:has-text("${cityName}")`).isVisible();
}

/**
 * LocalStorageをクリアする
 * @param {import('@playwright/test').Page} page
 */
export async function clearLocalStorage(page) {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

/**
 * LocalStorageに時計設定を直接設定する
 * @param {import('@playwright/test').Page} page
 * @param {Array} clocks
 */
export async function setClockSettings(page, clocks) {
  await page.evaluate((clockData) => {
    localStorage.setItem('worldClockSettings', JSON.stringify(clockData));
  }, clocks);
}

/**
 * 現在のLocalStorage設定を取得する
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<Array>}
 */
export async function getClockSettings(page) {
  return await page.evaluate(() => {
    const settings = localStorage.getItem('worldClockSettings');
    return settings ? JSON.parse(settings) : [];
  });
}

/**
 * モーダルが開いているかチェック
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<boolean>}
 */
export async function isModalOpen(page) {
  return await page.locator('.modal-overlay').isVisible();
}

/**
 * エラーメッセージを取得する
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string|null>}
 */
export async function getErrorMessage(page) {
  const errorElement = page.locator('.error-message');
  if (await errorElement.isVisible()) {
    return await errorElement.textContent();
  }
  return null;
}

/**
 * 時刻表示が正しいフォーマットかチェック
 * @param {string} timeString
 * @returns {boolean}
 */
export function isValidTimeFormat(timeString) {
  return /^\d{2}:\d{2}:\d{2}$/.test(timeString);
}

/**
 * 日付表示が正しいフォーマットかチェック
 * @param {string} dateString
 * @returns {boolean}
 */
export function isValidDateFormat(dateString) {
  return /^\d{4}\/\d{2}\/\d{2}$/.test(dateString);
}

/**
 * 指定した時間待機
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}