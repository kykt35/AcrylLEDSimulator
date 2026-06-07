# Phase 2 State Design

## 目的
画像入力、シミュレーター設定、保存状態、エラー状態の管理方針を定義し、Phase 3 実装で state の責務が崩れないようにする。

## 基本方針
- MVP 初期は React state を基本とする
- 画面ローカルで完結する state は `app/simulator/page.tsx` または `SimulatorScreen` に置く
- Canvas 内だけで閉じる値は表示コンポーネントへ props で渡す
- 共有や永続化に関わる値は構造化したオブジェクトとして扱う
- Zustand などの外部 store は、状態が複数画面や複数階層へ拡散した場合に限り導入を検討する

## 状態分類

### 1. 画像入力状態

| キー | 型 | 用途 |
|---|---|---|
| `sourceImage.fileName` | `string` | UI 表示用ファイル名 |
| `sourceImage.objectUrl` | `string \| null` | プレビュー用画像 URL |
| `sourceImage.width` | `number \| null` | 任意のメタデータ |
| `sourceImage.height` | `number \| null` | 任意のメタデータ |
| `sourceImage.status` | `"idle" \| "loading" \| "ready" \| "error"` | 読み込み状態 |
| `sourceImage.errorMessage` | `string \| null` | 読み込み失敗時の説明 |

### 2. 彫刻画像状態

| キー | 型 | 用途 |
|---|---|---|
| `engraving.src` | `string \| null` | 生成済み彫刻画像Data URL |
| `engraving.status` | `"idle" \| "loading" \| "ready" \| "error"` | 彫刻画像生成状態 |
| `engraving.errorMessage` | `string \| null` | 彫刻画像生成失敗時の説明 |
| `engraving.adjustments.toneMode` | `"stepped" \| "grayscale"` | 階調量子化または連続グレースケールの生成モード |
| `engraving.adjustments.toneLevels` | `number` | `toneMode="stepped"` のとき使う階調数。2から8 |
| `engraving.averageStrength` | `number \| null` | 生成済み彫刻画像の平均強度 |

### 3. シミュレーター設定状態

| キー | 型 | 用途 |
|---|---|---|
| `simulation.ledColorId` | `string` | LED 色プリセット識別子 |
| `simulation.brightness` | `number` | 発光量 |
| `simulation.backgroundId` | `string` | 背景プリセット識別子 |
| `simulation.cameraPresetId` | `string` | カメラプリセット識別子 |
| `simulation.autoRotate` | `boolean` | 将来拡張。MVP では固定 `false` |

### 4. 保存状態

| キー | 型 | 用途 |
|---|---|---|
| `save.status` | `"idle" \| "saving" \| "success" \| "error"` | 保存処理状態 |
| `save.exportedImageUrl` | `string \| null` | 保存結果画面に渡す出力画像 |
| `save.savedAt` | `string \| null` | 保存完了時刻 |
| `save.errorMessage` | `string \| null` | 保存失敗理由 |

### 5. UI 補助状態

| キー | 型 | 用途 |
|---|---|---|
| `ui.isNoticeOpen` | `boolean` | 注意事項モーダル表示 |
| `ui.isUploadModalOpen` | `boolean` | アップロードモーダル表示 |
| `ui.isSaveCompleteOpen` | `boolean` | 保存完了モーダル表示 |

## 推奨 state 形状

```ts
type SimulatorScreenState = {
  sourceImage: {
    fileName: string;
    objectUrl: string | null;
    width: number | null;
    height: number | null;
    status: "idle" | "loading" | "ready" | "error";
    errorMessage: string | null;
  };
  simulation: {
    ledColorId: string;
    brightness: number;
    backgroundId: string;
    cameraPresetId: string;
    autoRotate: boolean;
  };
  engraving: {
    src: string | null;
    status: "idle" | "loading" | "ready" | "error";
    errorMessage: string | null;
    adjustments: {
      contrast: number;
      gamma: number;
      threshold: number;
      invert: boolean;
      edgeWeight: number;
      edgeWidth: number;
      toneMode: "stepped" | "grayscale";
      toneLevels: number;
    };
    averageStrength: number | null;
  };
  save: {
    status: "idle" | "saving" | "success" | "error";
    exportedImageUrl: string | null;
    savedAt: string | null;
    errorMessage: string | null;
  };
  ui: {
    isNoticeOpen: boolean;
    isUploadModalOpen: boolean;
    isSaveCompleteOpen: boolean;
  };
};
```

## 状態の持ち場所

### `app/simulator/page.tsx` または `SimulatorScreen`
- `sourceImage`
- `simulation`
- `save`
- `ui`

理由:
- 画像アップロード、操作パネル、保存処理、画面遷移の全てで参照するため
- `PocWorkbench` のような 1 コンポーネント集中ではなく、コンテナ 1 箇所から各部品へ分配した方が明確なため

### `SimulatorCanvas` / `SimulatorScene`
- 受け取った props を描画へ反映するのみ
- 画面状態を独自に保持しない

理由:
- 表示ロジックを UI 変更から独立させるため
- 再描画の起点を UI 操作に揃えるため

### `ImageUploader`
- ローカルな input 要素状態だけを持つ
- 読み込み結果は上位へコールバックする

## データフロー

```text
ImageUploader
  ↓ onSelect(file)
sourceImage.status = loading
  ↓ loadPngTexture(file)
sourceImage.status = ready / error
  ↓
SimulatorCanvas に objectUrl を渡す
  ↓
LightingControls / DisplayControls
  ↓ onChange
simulation を更新
  ↓
SaveControls
  ↓ onSave
save.status = saving
  ↓ export / API 呼び出し
save.status = success / error
  ↓
結果画面または保存完了モーダル
```

## 更新ルール

### 画像アップロード
- 新規画像読込開始時に `sourceImage.status = "loading"` とする
- 読込成功時は `sourceImage.errorMessage` をクリアする
- 読込失敗時は直前の有効画像がある場合のみ `objectUrl` を維持する

### 設定変更
- LED 色、明るさ、背景、カメラは独立したイベントで更新する
- プレビュー反映は即時とし、保存状態を巻き戻さない

### 保存
- 保存開始時に `save.status = "saving"` とし、二重送信を抑止する
- 保存成功時は `exportedImageUrl` と `savedAt` を更新する
- 保存失敗時は `save.errorMessage` を保持し、現在のシミュレーション状態は維持する

## `useState` と `useReducer` の判断基準

### `useState` で十分な範囲
- 単独値の切替
- モーダル開閉
- 明るさやカメラ選択のような単純更新

### `useReducer` を使うべき範囲
- 画像読込や保存のように状態遷移が明確な処理
- 複数フィールドをまとめて更新する必要がある処理

推奨:
- MVP 初回では `sourceImage` と `save` を reducer 化し、`simulation` と `ui` は `useState` でもよい

## 保存結果画面への受け渡し
- 画面遷移時に `save.exportedImageUrl` と `simulation` のスナップショットを渡す
- 永続化 API を利用する場合は、レスポンスの `savedSimulationId` を併せて保持する

## 将来拡張との境界
- 比較保存や共有 URL 用の state は MVP に含めない
- 共有リンクが必要になった場合は `save.sharedToken` を後付けする
- 履歴一覧が必要になった場合のみグローバル store や server state を検討する
