# 世界時計 React PWA

React + Viteで構築された美しいデザインの世界時計アプリケーションです。PWA（Progressive Web App）として動作し、デスクトップに常駐できます。

## ✨ 機能

- 🌍 **標準UTC時計**: 常に表示される協定世界時
- 🏙️ **都市追加**: 世界各地の主要都市から時計を追加可能。部分一致検索や候補サジェストに対応
- 🔀 **ドラッグ＆ドロップ並べ替え**: 時計カードをドラッグして順番を自由に入れ替え
- 🔁 **コンパクトモード**: ヘッダーのトグルでカードをコンパクト表示に切り替え。レイアウトは自動スケーリングで崩れません
- � **自動保存**: 追加順序・コンパクトモード設定を LocalStorage に永続化
- 🕒 **DST情報**: 夏時間かどうかを判定し、標準時との差分を表示
- 🌅 **時間帯に応じた背景**: 夜明け/昼/夕暮れ/夜でグラデーションが変化
- ♿ **アクセシブル設計**: キーボード操作、ARIAラベル、フォーカス管理を考慮
- 📱 **PWA対応**: デスクトップ/スマホにインストール可能。オフラインキャッシュ対応
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
   - 予測サジェストから選択するか、直接入力
   - 「追加」ボタンで登録

2. **時計の削除**
   - 削除したい時計の右上の「×」ボタンをクリック

3. **順番の入れ替え**
   - 時計カードをドラッグ＆ドロップして並び順を変更
   - 保存されている順序はページ再訪時にも維持

4. **表示モードの切り替え**
   - ヘッダー右側の「コンパクト / 通常表示」ボタンで切替
   - コンパクトモードではカードの高さが縮まり、時刻の文字は自動スケール調整

5. **PWAインストール**
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
- **Storage**: LocalStorage (時計リストと表示設定の永続化)
- **Drag & Drop**: ネイティブHTML5 DnD API

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
- タイムゾーン計算・夏時間判定
- 時刻・日付フォーマットと自動スケール調整
- 時間帯に応じたグラデーション背景
- 削除・ドラッグ状態のUI

### AddClockModal.jsx
- 時計追加用モーダル
- 都市名検索・候補表示（最大5件のサジェスト）
- フォームバリデーションと重複検知
- キーボードナビゲーションとフォーカス管理

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
- カラーテーマ・時間帯グラデーション
- レイアウトやコンパクトモードのブレークポイント
- アニメーション（ホバー、ドラッグ状態）
- アクセシビリティ調整（フォーカスリング等）

## ☁️ Amplify Hosting にデプロイする

1. **AWS アカウントの準備**
   - IAM ユーザー（Amplify へアクセスできる権限）を用意
   - `AdministratorAccess-Amplify` か、Amplify Hosting に必要な最小権限を付与

2. **リポジトリを Amplify に接続**
   - [Amplify Console](https://console.aws.amazon.com/amplify/) にアクセス
   - 「ホスト web アプリ」→ GitHub / GitLab / Bitbucket / AWS CodeCommit を選択し、リポジトリを接続
   - ブランチは `main` を指定

3. **ビルド設定の確認**
   - ルートに追加した `amplify.yml` が自動検出されます
   - 内容は以下の通りで、Vite の本番ビルドを実行し `dist/` をデプロイします

   ```yaml
   version: 1
   applications:
     - frontend:
         phases:
           preBuild:
             commands:
               - npm ci
           build:
             commands:
               - npm run build
         artifacts:
           baseDirectory: dist
           files:
             - '**/*'
         cache:
           paths:
             - node_modules/**/*
       appRoot: .
   ```

4. **環境変数 (必要に応じて)**
   - Vite で利用する環境変数を `AMPLIFY_ENVIRONMENT_VARIABLES` に設定
   - 例: API キー、分析ツールのトークンなど（今回のアプリではデフォルト不要）

5. **デプロイ実行**
   - 設定後、Amplify が自動的に `npm ci` → `npm run build` を実行し、`dist/` を配信
   - 成功すると `https://<app-id>.amplifyapp.com` のような URL が発行されます

6. **自動デプロイとブランチプレビュー**
   - `main` への push で自動デプロイ
   - Pull Request ごとにプレビューを生成したい場合は、Amplify Console で「プレビューのビルド」を有効化

7. **カスタムドメインの設定 (任意)**
   - Amplify Console の「ドメイン管理」から Route53 や他社 DNS を設定
   - `www.example.com` 等のカスタムドメインに HTTPS 証明書が自動発行されます

## 📝 更新履歴

- **v2.1.0** (2025-10-05): UXアップデート & Amplify対応
   - 時計カードのドラッグ＆ドロップ並び替えを追加
   - コンパクトモードを実装し、レイアウトスケーリングを自動化
   - 夏時間表示や時間帯グラデーションなど視覚的アクセントを改善
   - アクセシビリティ改善（ARIA属性、フォーカス管理）
   - Amplify Hosting 用ビルド設定・ドキュメントを整備

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