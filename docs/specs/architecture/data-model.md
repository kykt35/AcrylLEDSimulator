# Phase 2 Data Model

## 目的
保存機能で扱うデータ構造を定義し、クライアント state、API 契約、保存結果画面の入力を揃える。

## データモデル一覧

| モデル | 用途 |
|---|---|
| `SourceImage` | 元 PNG の参照情報 |
| `EngravingAdjustments` | 彫刻用画像生成の調整値 |
| `SimulationSettings` | シミュレーターの主要設定 |
| `SavedSimulation` | 保存結果 1 件の情報 |

## `SourceImage`

```ts
type SourceImage = {
  id: string | null;
  fileName: string;
  mimeType: "image/png";
  sourceImageUrl: string | null;
  width: number | null;
  height: number | null;
};
```

### 備考
- MVP では未保存のローカル画像も扱うため `id` と `sourceImageUrl` は `null` を許容する
- プレビュー用途の object URL は別 state で管理してよい

## `EngravingAdjustments`

```ts
type EngravingAdjustments = {
  contrast: number;
  gamma: number;
  threshold: number;
  invert: boolean;
  edgeWeight: number;
  edgeWidth: number;
  toneMode: "stepped" | "grayscale";
  toneLevels: number;
};
```

### 制約
- `toneMode="grayscale"` は `toneLevels` を使わず連続グレースケールとして生成する
- `toneMode="stepped"` は2から8段階へ量子化する
- セッション保存では `EditorSnapshot.engraving.adjustments` に保持する

## `SimulationSettings`

```ts
type SimulationSettings = {
  ledColorId: string;
  brightness: number;
  backgroundId: string;
  cameraPresetId: string;
};
```

### 制約
- `ledColorId` は定義済みプリセットのみ
- `brightness` は UI スライダーの下限 / 上限に従う
- `backgroundId` は背景プリセットに存在する識別子のみ
- `cameraPresetId` はカメラプリセットに存在する識別子のみ

## `SavedSimulation`

```ts
type SavedSimulation = {
  id: string;
  sourceImage: SourceImage;
  simulation: SimulationSettings;
  resultImageUrl: string;
  savedAt: string;
};
```

## 保存時ペイロード

```ts
type SaveSimulationPayload = {
  sourceImageId: string | null;
  exportedImageDataUrl: string;
  simulation: SimulationSettings;
  meta: {
    sourceFileName: string;
  };
};
```

## 保存結果画面の入力モデル

```ts
type ResultViewModel = {
  resultImageUrl: string;
  sourceFileName: string;
  simulation: SimulationSettings;
  savedAt: string | null;
};
```

## モデル間の関係

```text
SourceImage
  + SimulationSettings
  ↓ 保存
SavedSimulation
  ↓ 表示変換
ResultViewModel
```

## Phase 3 実装メモ
- `types/simulator.ts` に `SimulationSettings` を置く
- `types/save.ts` に保存 API 用の型を置く
- クライアント state では API モデルをそのまま使わず、UI 状態を含む view model を別に持ってよい
