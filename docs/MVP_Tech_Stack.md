# 技術スタック提案: LEDアクリルスタンド見え方シミュレーター（Web版）

## 1. 技術選定方針

本システムは、LEDで光るアクリルスタンドの**完成イメージをブラウザ上で確認する見え方シミュレーター**である。  
そのため、技術選定では以下を重視する。

- ブラウザでの動作
- 3D表示と通常UIの統合しやすさ
- カスタムシェーダーによる発光表現の実装しやすさ
- 将来的な保存・共有・注文導線との接続しやすさ
- 小さく作って段階的に拡張しやすいこと

---

## 2. 推奨技術スタック

## 2.1 フロントエンド
- **Next.js**
- **React**
- **TypeScript**

### 採用理由
- Webアプリ全体の構成を組みやすい
- 画像アップロード、フォーム、管理画面、共有ページなどを一体で作りやすい
- 将来的にサーバー機能やAPI連携を足しやすい
- React Three Fiber との相性がよい

---

## 2.2 3D描画
- **Three.js**
- **React Three Fiber**
- **@react-three/drei**

### 採用理由
- ブラウザ3Dの定番構成で実績が多い
- Reactベースで3DとUIを自然に統合できる
- カメラ操作、ライト、補助コンポーネントを使いやすい
- 商品シミュレーターやコンフィギュレーター用途と相性がよい

---

## 2.3 シェーダー・見た目表現
- **Three.js ShaderMaterial**
- 必要に応じて **Postprocessing**
- カスタムGLSLシェーダー

### 採用理由
- LED発光、下部からの光、輪郭強調などを表現しやすい
- 見た目に特化したシミュレーターに必要な制御がしやすい
- 物理的な正確性より、商品として自然に見える表現を優先できる

### 主な表現対象
- アクリルの透明感
- LED色変更
- 発光マスク
- 下部から上への減衰
- 輪郭の発光強調
- Bloomによる発光感

---

## 2.4 UI
- **React**
- **Tailwind CSS**
- 必要に応じて **shadcn/ui** または同等のUIライブラリ

### 採用理由
- 操作パネルを素早く構築できる
- シンプルで保守しやすい
- 管理画面や保存一覧なども同じ設計で広げやすい

### UI対象
- 画像アップロード
- LED色選択
- 明るさ調整
- 背景切り替え
- 保存
- リセット
- 比較表示

---

## 2.5 状態管理
- **React state**
- 必要に応じて **Zustand**

### 採用理由
- MVPでは React の標準 state で十分
- 3DパラメータとUI状態を整理したくなったら Zustand が軽くて扱いやすい

### 管理対象
- アップロード画像
- LED色
- 明るさ
- 背景設定
- カメラ状態
- 保存状態
- シミュレーション設定

---

## 2.6 画像アップロード・保存
### 第一候補
- **Vercel Blob**

### 代替候補
- **Cloudflare R2**

### 採用理由
- 画像アップロードと保存を簡単に実装しやすい
- MVP段階では運用コストを抑えて始めやすい
- 将来的に共有URLや保存履歴にもつなげやすい

### 保存対象
- 元画像
- 出力画像
- シミュレーション設定JSON
- 共有用データ

---

## 2.7 バックエンド
### MVP
- **Next.js Route Handler / Server Actions**

### 将来的な候補
- **Supabase**
- **PostgreSQL**
- **Prisma**

### 採用理由
- MVPでは Next.js 内で完結しやすい
- 保存履歴、ユーザー管理、注文連携が必要になったらDBを追加しやすい

---

## 2.8 認証
### MVP
- なし、または簡易セッション

### 将来的な候補
- **NextAuth.js / Auth.js**
- **Supabase Auth**

### 想定用途
- 保存履歴の管理
- 顧客ごとの案件管理
- 制作会社向けダッシュボード
- 共有データの編集権限管理

---

## 2.9 出力機能
- **Canvas / WebGL の画像書き出し**
- 必要に応じて **サーバー側画像生成**

### 用途
- プレビュー画像保存
- 提案用画像生成
- 比較画像出力
- 注文確認画面への引き継ぎ

---

## 2.10 デプロイ
### 第一候補
- **Vercel**

### 代替候補
- **Cloudflare Pages**
- **Netlify**

### 採用理由
- Next.js と相性がよい
- 小規模での運用開始がしやすい
- フロント中心のアプリとして始めやすい

---

## 3. 推奨構成まとめ

### フロント
- Next.js
- React
- TypeScript

### 3D
- Three.js
- React Three Fiber
- Drei

### 表現
- ShaderMaterial
- GLSL
- Postprocessing

### UI
- Tailwind CSS
- 必要に応じて shadcn/ui

### 状態管理
- React state
- 必要に応じて Zustand

### 保存
- Vercel Blob または Cloudflare R2

### バックエンド
- Next.js Route Handler
- 将来的に PostgreSQL / Supabase / Prisma

### デプロイ
- Vercel

---

## 4. ディレクトリ構成案

```text
app/
  page.tsx
  simulator/
    page.tsx
  api/
    upload/
      route.ts
    save/
      route.ts

components/
  simulator/
    SimulatorCanvas.tsx
    AcrylicStand.tsx
    StandBase.tsx
    CameraController.tsx
    ControlPanel.tsx
    ColorPicker.tsx
    BackgroundSwitcher.tsx
    ExportButton.tsx

lib/
  shaders/
    acrylicVertex.glsl
    acrylicFragment.glsl
  storage/
    uploadImage.ts
    savePreset.ts
  utils/
    mask.ts
    export.ts

stores/
  simulatorStore.ts

types/
  simulator.ts
  preset.ts

public/
  presets/
  backgrounds/