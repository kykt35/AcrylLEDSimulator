# State Design

## 目的

現行MVPの `SimulatorScreen` が保持する画面状態、処理状態、永続化対象を定義する。

## 基本方針

- `SimulatorScreen` 内のReact stateを単一の画面状態の正とする
- 遷移が明確な画像入力とダウンロードは `useReducer` で管理する
- 単独の設定値、UI開閉、プレビュー派生値は `useState` で管理する
- 3D表示コンポーネントは受け取ったpropsを描画へ反映し、画面状態を所有しない
- 複数画面向けglobal storeやserver stateは使用しない
- セッション復元に必要な値だけを `EditorSnapshot` として保存する

## 処理状態

### 画像入力

```ts
type SourceImageState = {
  fileName: string;
  src: string | null;
  status: "idle" | "loading" | "ready" | "error";
  errorMessage: string | null;
};
```

- `src` はFileReaderで読み込んだ元画像Data URL
- `load-start`、`load-success`、`load-error`、`reset` をreducerで処理する
- 読込開始時にファイル名を更新し、直前のエラーを消す
- 読込失敗時は現在stateの `src` を維持する

### ダウンロード

```ts
type SaveState = {
  status: "idle" | "saving" | "success" | "error";
  savedAt: string | null;
  errorMessage: string | null;
};
```

内部名は `SaveState` だが、現行MVPで表す処理はサーバー保存ではなくローカルダウンロードである。

- `save-start`、`save-success`、`save-error`、`save-reset` をreducerで処理する
- `saving` 中はダウンロード操作を無効にする
- 成功時は `savedAt` にダウンロード開始時刻を設定する
- 失敗時は `errorMessage` を保持する
- 出力画像URLやサーバー保存IDは保持しない

### 彫刻画像

```ts
type EngravingState = {
  src: string | null;
  width: number | null;
  height: number | null;
  averageStrength: number | null;
  status: "idle" | "loading" | "ready" | "error";
  errorMessage: string | null;
};
```

- `src` は生成済み彫刻画像Data URL
- 調整値は別の `engravingAdjustments` stateで保持する
- 元画像または調整値が変わると彫刻画像を再生成する

### 配置済みプレビュー

```ts
type PreviewImageState = {
  src: string | null;
  status: "idle" | "loading" | "ready" | "error";
};
```

- 元画像と彫刻画像それぞれに配置反映後のプレビューstateを持つ
- 配置合成に失敗した場合は元のData URLへフォールバックする

## シミュレーション設定

| state | 型 | 初期値 | 用途 |
|---|---|---|---|
| `ledColorId` | `string` | 最初のライトプリセット | LED色 |
| `brightness` | `number` | `1.2` | 発光量 |
| `heightAttenuation` | `number` | `0.3` | 高さ方向の減衰 |
| `backgroundId` | `string` | `"night"` | 背景 |
| `cameraPresetId` | `string` | `"front"` | カメラ |
| `acrylicSizeId` | `AcrylicSizePresetId` | `"medium"` | アクリルサイズ |
| `isEngravingMode` | `boolean` | `false` | 元画像/彫刻表示 |
| `imageLayout` | `ImageLayout` | `contain, 1, 0, 0` | 画像配置 |
| `engravingAdjustments` | `EngravingAdjustments` | 既定調整値 | 彫刻画像生成 |

各値は独立して更新し、3Dプレビューまたは画像生成処理へ即時反映する。

## 書出し状態

| state | 型 | 初期値 | 用途 |
|---|---|---|---|
| `exportFormat` | `"png" \| "jpg"` | `"png"` | シミュレーション画像形式 |
| `exportCropRegion` | `ExportCropRegion` | 全面 | 正規化された書出範囲 |
| `isExportCropOverlayVisible` | `boolean` | `false` | 書出範囲オーバーレイ |
| `exportPreviewUrl` | `string \| null` | `null` | クロップ済みプレビューData URL |

新しい画像の読込成功時は書出範囲を全面へ戻し、オーバーレイを閉じる。リセット時も同じ初期状態へ戻す。

## UI状態

| state | 型 | 初期値 | 用途 |
|---|---|---|---|
| `controlPanelTab` | `ControlPanelTabId` | `"image"` | 選択中タブ |
| `isControlDrawerOpen` | `boolean` | `false` | 設定パネル |
| `isPreviewDragActive` | `boolean` | `false` | ドラッグ中表示 |
| `isSaveCompleteOpen` | `boolean` | `false` | 成功toast |

注意事項dialogとモバイルメニューのstateは `SimulatorHeaderActions`、補助ページの注意事項dialogは `NoticeModal` がローカルに持つ。

## 派生状態

- `isImageReady`: 元画像Data URLがある
- `isEngravingReady`: 彫刻状態が `ready`
- `isExportReady`: 元画像Data URLがある
- `isBusy`: 画像読込、彫刻生成、ダウンロードのいずれかが処理中
- 選択中プリセット: 各IDからライト、背景、カメラ、アクリルサイズを解決する
- ライブリージョン文言: 画像、彫刻、ダウンロードの状態から優先順に組み立てる

## データフロー

```text
File
  ↓ loadPngTexture
SourceImageState / EngravingState
  ↓ composePreviewImageFromDataUrl
PreviewImageState
  ↓ props
SimulatorCanvas
  ↓ Canvas + ExportCropRegion
exportCanvasImage
  ↓ Blob
writeEditorSnapshot → downloadBlob
  ↓
SaveState(success) + success toast
```

アプリ独自API呼び出しと結果画面へのstate受け渡しは行わない。

## セッション保存境界

ダウンロードするBlobの生成後、`buildEditorSnapshot` で次を保存する。

- 元画像のファイル名とData URL
- 彫刻画像Data URL、調整値、平均強度
- LED色、明るさ、高さ減衰、背景、カメラ、アクリルサイズ
- 元画像/彫刻表示
- content fit、画像サイズ、縦横位置

次は保存しない。

- `SaveState`
- 書出し形式
- 書出範囲
- 設定パネルやtoastなどのUI開閉状態
- 一時Blob、Object URL、書出しプレビューData URL

## 復元と初期化

- `?resume=1` の場合だけ `readEditorSnapshot` を実行する
- スナップショットがなければ初期状態を維持する
- 彫刻調整値を正規化し、不足する高さ減衰とアクリルサイズを既定値で補う
- `?reset=1` は復元より優先し、全画面stateとスナップショットを初期化する
- 画面上のリセットも同じ `resetEditor` を使用する

## 将来拡張との境界

- `save.exportedImageUrl`、`savedSimulationId`、共有tokenは現行stateに追加しない
- サーバー保存または結果画面を導入する場合は、ローカルstate、server state、URLで受け渡す値を再設計する
- 複数画面で共有する要件が生じた場合だけglobal storeを検討する
