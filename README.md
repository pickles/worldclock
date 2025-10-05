# 世界時計 React PWA

React + Viteで構築された美しいデザインの世界時計アプリケーションです。PWA（Progressive Web App）として動作し、デスクトップに常駐できます。

## ✨ 機能

- 🌍 **標準UTC時計**: 常に表示される協定世界時
- 🏙️ **都市追加**: 世界各地の都市の時計を追加可能
- 💾 **設定保存**: 追加した時計の設定は自動的に保存される
- 📱 **PWA対応**: デスクトップにインストール可能
- 🎨 **美しいデザイン**: モダンでレスポンシブなUI
- ⚡ **高速**: Viteによる高速ビルドとHMR
- 🔧 **React 18**: 最新のReact機能を活用

## 対応都市

アプリケーションは以下のような主要都市に対応しています：

### アジア・太平洋
- Tokyo, Seoul, Beijing, Shanghai, Hong Kong, Singapore, Bangkok, Manila, Jakarta, Mumbai, Sydney, Melbourne, Auckland

### ヨーロッパ
- London, Paris, Berlin, Rome, Madrid, Amsterdam, Stockholm, Vienna, Moscow, Istanbul, Zurich

### 北米・南米
- New York, Los Angeles, Chicago, Toronto, Vancouver, Mexico City, São Paulo, Buenos Aires

### 中東・アフリカ
- Dubai, Riyadh, Tel Aviv, Cairo, Johannesburg

## 使用方法

1. **時計の追加**
   - 「+ 時計を追加」ボタンをクリック
   - 都市名を入力（例：Tokyo, New York, London）
   - 候補から選択するか、直接入力
   - 「追加」ボタンをクリック

2. **時計の削除**
   - 削除したい時計の右上の「×」ボタンをクリック

3. **PWAインストール**
   - ブラウザでアクセス時にインストールプロンプトが表示
   - 「インストール」ボタンをクリックして追加

## 🛠️ 技術スタック

- **Frontend Framework**: React 18
- **Build Tool**: Vite 4
- **UI Components**: カスタムコンポーネント + Lucide React Icons
- **Styling**: CSS3 (CSS Grid & Flexbox)
- **PWA**: Vite PWA Plugin
- **Time Management**: Intl.DateTimeFormat API
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: LocalStorage

## 📁 プロジェクト構成

```
worldclock/
├── public/
│   ├── android-chrome-192x192.png  # PWAアイコン (192x192)
│   ├── android-chrome-512x512.png  # PWAアイコン (512x512)
│   ├── apple-touch-icon.png        # iOS用タッチアイコン
│   ├── favicon.svg                 # ベクターファビコン
│   ├── favicon-32.png / 48 / 64…   # ラスターファビコン各種
│   └── site.webmanifest            # 静的Webマニフェスト
├── src/
│   ├── components/       # Reactコンポーネント
│   │   ├── ClockCard.jsx      # 時計カードコンポーネント
│   │   └── AddClockModal.jsx  # 時計追加モーダル
│   ├── utils/           # ユーティリティ関数
│   │   └── timezones.js      # タイムゾーンデータ
│   ├── App.jsx          # メインAppコンポーネント
│   ├── App.css          # アプリケーションスタイル
│   ├── main.jsx         # Reactエントリーポイント
│   └── index.css        # グローバルスタイル
├── index.html           # HTMLテンプレート
├── vite.config.js       # Vite設定ファイル
├── package.json         # npm依存関係
└── README.md           # このファイル
```

## 🚀 開発・起動方法

### 前提条件
- Node.js (v16以上)
- npm または yarn

### インストール
```bash
# リポジトリをクローン
git clone <repository-url>
cd worldclock

# 依存関係をインストール
npm install
```

### 開発サーバー起動
```bash
# 開発サーバーを起動
npm run dev

# ブラウザで以下にアクセス
# http://localhost:3000
```

### ビルド
```bash
# 本番用ビルド
npm run build

# ビルド結果をプレビュー
npm run preview
```

## 🧪 テスト

### E2Eテスト（Playwright）
```bash
# 全テストを実行
npm run test

# ブラウザを表示してテスト実行
npm run test:headed

# テストUIを使用
npm run test:ui

# デバッグモードでテスト実行
npm run test:debug

# テストレポートを表示
npm run test:report
```

### テストカバレッジ
- ✅ **基本機能**: UTC時計表示、時刻更新
- ✅ **時計追加**: モーダル操作、都市検索、バリデーション
- ✅ **時計削除**: 削除機能、確認処理
- ✅ **永続化**: LocalStorage保存・読込み
- ✅ **レスポンシブ**: デスクトップ・タブレット・モバイル
- ✅ **アクセシビリティ**: キーボード操作、ARIAラベル
- ✅ **統合テスト**: 複雑なユーザーシナリオ
- ✅ **エラーハンドリング**: 例外処理、リカバリ

## 📱 PWA機能詳細

### Vite PWA Plugin
- 自動Service Worker生成
- オフライン動作をサポート
- キャッシュ戦略により高速読み込み
- アップデート時の自動キャッシュ更新

### Web App Manifest
- デスクトップ・モバイルでのインストール対応
- ネイティブアプリライクな動作
- カスタムアイコン・スプラッシュスクリーン

## 🎯 主要コンポーネント

### App.jsx
- メインアプリケーションロジック
- 状態管理 (時計リスト、モーダル状態)
- LocalStorage連携
- リアルタイム時刻更新

### ClockCard.jsx
- 個別時計表示コンポーネント
- タイムゾーン計算
- 時刻・日付フォーマット
- 削除機能

### AddClockModal.jsx
- 時計追加用モーダル
- 都市名検索・候補表示
- フォームバリデーション
- キーボードナビゲーション

## 🔧 カスタマイズ

### 新しい都市を追加
`src/utils/timezones.js`ファイルを編集：

```javascript
export const getTimezoneList = () => {
  return {
    // 既存の都市...
    'Your City': 'Your/Timezone',
  }
}
```

### スタイルのカスタマイズ
`src/App.css`でデザインを変更可能：
- カラーテーマ
- レイアウト
- アニメーション
- レスポンシブブレークポイント

## 📝 更新履歴

- **v2.0.0** (2025-10-05): React/Vite版リリース
  - React 18 + Vite 4による完全リビルド
  - コンポーネントベースのアーキテクチャ
  - TypeScript対応準備
  - 改善されたPWA機能
  - パフォーマンス最適化

- **v1.0.0** (2025-10-05): 初回リリース（バニラJS版）
  - UTC時計表示
  - 都市追加・削除機能
  - PWA対応
  - 設定自動保存