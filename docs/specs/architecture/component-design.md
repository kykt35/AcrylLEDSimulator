# Phase 2 Component Design

## 目的
Phase 1 PoC の単一ワークベンチ構成を、画面、UI、3D シーン、保存処理ごとの責務へ分解し、Phase 3 の実装単位を明確にする。

## 現状整理

### 現行構成
- `app/page.tsx`: トップ訴求と PoC ワークベンチを同一画面に配置
- `components/simulator/PocWorkbench.tsx`: 画面全体の状態と UI を集中管理
- `components/simulator/SimulatorCanvas.tsx`: Canvas と 3D シーンの合成
- `components/upload/ImageUploader.tsx`: ファイル入力と読み込み状態表示
- `components/controls/LightingControls.tsx`: 発光とカメラ操作 UI
- `components/actions/ExportPreviewButton.tsx`: クライアント側画像書き出し

### 現状の課題
- 画面責務とシミュレーター責務が `PocWorkbench` に集中している
- 画像入力、表示設定、保存状態が局所 state で混在している
- 保存結果画面や将来の API 連携を差し込む境界がない
- `components/simulator` 配下に UI と 3D 表示が混在している

## 設計方針
- 画面コンポーネントはルーティング単位で分ける
- UI パネルと 3D シーンを別責務にする
- 状態更新の起点はコンテナコンポーネントへ寄せる
- PNG入力は `lib/image/` のクライアント処理で完結させ、サーバー保存など将来の外部 I/O は `lib/` と `app/api/` に閉じる
- Phase 3 では実装不要な将来拡張の抽象化は増やしすぎない

## 推奨ディレクトリ構成

```text
app/
  page.tsx
  simulator/
    page.tsx
  result/
    page.tsx
  api/
    save/
      route.ts

components/
  layout/
    SiteHeader.tsx
  simulator/
    SimulatorScreen.tsx
    SimulatorCanvas.tsx
    SimulatorScene.tsx
    AcrylicStandMesh.tsx
    LedBaseMesh.tsx
    SceneLighting.tsx
    CameraController.tsx
  controls/
    SimulatorControlPanel.tsx
    ImageSettingsSection.tsx
    LightingControls.tsx
    DisplayControls.tsx
    SaveControls.tsx
  upload/
    ImageUploader.tsx
    UploadStatus.tsx
  feedback/
    NoticeModal.tsx
    SaveCompleteModal.tsx
    ErrorNotice.tsx
  result/
    ExportResultCard.tsx
    ResultActions.tsx

lib/
  image/
    loadPngTexture.ts
  export/
    exportCanvasImage.ts
  storage/
    saveSimulation.ts
  simulator/
    lightingPresets.ts
    backgroundPresets.ts
    cameraPresets.ts

types/
  simulator.ts
  save.ts
```

## 画面単位の責務

### `app/page.tsx`
- サービス概要と開始導線の表示
- シミュレーター本体を直接持たない

### `app/simulator/page.tsx`
- シミュレーター画面全体のコンテナ
- URL からの初期状態復元や保存結果への遷移制御

### `app/result/page.tsx`
- 保存済み出力の表示
- 再編集、新規作成、ダウンロードの導線管理

## コンポーネント責務

### 画面コンテナ

#### `SimulatorScreen`
- シミュレーター画面のレイアウトを構成する
- 状態フックと UI セクションを束ねる
- 3D 表示と操作パネルの橋渡しを行う

### 3D 表示

#### `SimulatorCanvas`
- Canvas のマウント、サイズ、背景コンテナを扱う
- `SimulatorScene` へ描画用 props を渡す

#### `SimulatorScene`
- `SceneLighting`、`AcrylicStandMesh`、`LedBaseMesh`、`CameraController` を組み合わせる
- Canvas 内の表示責務を 1 箇所へまとめる

#### `AcrylicStandMesh`
- PNG テクスチャ反映とアクリル板表現を担当する

#### `LedBaseMesh`
- 台座と発光基準表現を担当する

#### `CameraController`
- カメラプリセット、リセット、操作制御を担当する

### UI パネル

#### `SimulatorControlPanel`
- 画像設定、発光設定、表示設定、出力設定を縦に構成する
- 状態表示の順序を一貫させる

#### `ImageSettingsSection`
- ファイル入力、ファイル名、読込状態、差し替え導線を担当する

#### `LightingControls`
- LED 色プリセットと明るさ変更を担当する

#### `DisplayControls`
- 背景切替、カメラプリセット、各種リセットを担当する

#### `SaveControls`
- 保存ボタン、保存中表示、保存成功 / 失敗通知を担当する

### 補助表示

#### `NoticeModal`
- 実物との差異や利用上の注意事項を表示する

#### `SaveCompleteModal`
- 保存成功後の行動を案内する

#### `ErrorNotice`
- 読込失敗や保存失敗など画面内エラーを一貫した見た目で表示する

### 保存結果表示

#### `ExportResultCard`
- 保存画像と主要設定値をまとめて表示する

#### `ResultActions`
- 再編集、新規作成、ダウンロードを提供する

## 既存コンポーネントの扱い

| 既存 | 方針 |
|---|---|
| `PocWorkbench` | Phase 3 で廃止し、`SimulatorScreen` とトップ画面へ責務を分離する |
| `SimulatorCanvas` | 継続利用し、Canvas マウント責務へ限定する |
| `ImageUploader` | `ImageSettingsSection` の配下へ移し、UI 表示を分離する |
| `LightingControls` | 継続利用し、背景や保存操作は別コンポーネントへ分離する |
| `ExportPreviewButton` | `SaveControls` の内部責務へ吸収するか、薄い部品として再利用する |

## 実装順メモ
1. ルーティング分割と画面シェル
2. シミュレーター画面コンテナ作成
3. 操作パネル分割
4. 保存結果画面作成
5. モーダルとエラー表示追加

## 非対象
- グローバルデザインシステムの整備
- 共有 URL 向け専用コンポーネント
- 管理画面向け一覧 UI
