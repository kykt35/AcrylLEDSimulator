# Data Model

## 目的

現行MVPがブラウザ内で扱う画像、シミュレーション設定、書出しデータ、セッション保存データを定義する。

## データモデル一覧

| モデル | 用途 | ライフサイクル |
|---|---|---|
| `SourceImageState` | 元PNGのファイル名、Data URL、読込状態 | 画面内 |
| `EngravingAdjustments` | 彫刻画像生成の調整値 | 画面内、セッション保存 |
| `EngravingSnapshot` | 彫刻画像と調整値 | セッション保存 |
| `SimulationSnapshot` | 復元対象の表示設定 | セッション保存 |
| `EditorSnapshot` | 再編集に必要な値の集合 | sessionStorageまたはメモリ |
| `ExportCropRegion` | 正規化されたCanvas書出範囲 | 画面内 |
| `Blob` | PNG/JPGまたは彫刻用PNG | ダウンロード時のみ |

## 元画像

```ts
type SourceImageState = {
  fileName: string;
  src: string | null;
  status: "idle" | "loading" | "ready" | "error";
  errorMessage: string | null;
};
```

- `src` はFileReaderが生成したData URL
- サーバー側ID、永続URL、アップロード先を持たない
- PNGのwidth/heightは元画像stateへ保存しない
- `status` と `errorMessage` はセッション保存しない

## 彫刻調整

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

- `edgeWidth` は1から5の整数へ正規化する
- `toneMode` は `stepped` または `grayscale`
- 不明な `toneMode` は `grayscale` へ補正する
- `toneLevels` は2から8の整数へ正規化する
- `grayscale` では `toneLevels` を画像生成に使用しない

## 画像配置

```ts
type ImageLayout = {
  contentFit: "contain" | "cover" | "fill";
  scale: number;
  offsetX: number;
  offsetY: number;
};
```

- `scale` は0.4から1.6
- `offsetX` と `offsetY` は-100から100
- 既定値は `contain`、`1`、`0`、`0`

## セッションスナップショット

```ts
type EngravingSnapshot = {
  src: string | null;
  adjustments: EngravingAdjustments;
  averageStrength: number | null;
};

type SimulationSnapshot = {
  ledColorId: string;
  brightness: number;
  heightAttenuation?: number;
  backgroundId: string;
  cameraPresetId: string;
  acrylicSizeId: "small" | "medium" | "large";
  showSourceOverlay: boolean;
  imageLayout: ImageLayout;
};

type EditorSnapshot = {
  sourceImage: {
    fileName: string;
    src: string | null;
  };
  engraving: EngravingSnapshot;
  simulation: SimulationSnapshot;
};
```

### 保存先

- sessionStorageキーは `acryl-led-simulator:editor`
- sessionStorageへ書き込む前に同じ値をモジュール内メモリへ保持する
- sessionStorageが利用できない、またはquota超過などで書き込めない場合はメモリだけを使用する

### 保存タイミング

1. Canvasと書出範囲からPNG/JPG Blobを生成する
2. 現在の `EditorSnapshot` を構築する
3. sessionStorageまたはメモリへ保存する
4. Blobのローカルダウンロードを開始する
5. `savedAt` を画面stateへ記録し、成功toastを表示する

### 復元時の正規化

- 彫刻調整値を既定値とマージし、`edgeWidth`、`toneMode`、`toneLevels` を正規化する
- `heightAttenuation` がない場合は `0.3`
- `acrylicSizeId` がない場合は `medium`
- `showSourceOverlay` がない場合は元画像表示
- `imageLayout` がない場合は既定配置
- sessionStorageのJSONが不正な場合はメモリ値を使い、なければ復元しない

## 書出しモデル

```ts
type ExportImageFormat = "png" | "jpg";

type ExportCropRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

- 書出範囲は0から1の正規化座標
- `width` と `height` の最小値は0.08
- Canvasから生成したBlobは一時的にだけ保持し、永続化しない
- `downloadBlob` はBlobのObject URLを作成し、一時リンクのクリック後に破棄する
- 書出し形式と範囲は `EditorSnapshot` に含めない

## モデル間の関係

```text
File
  ↓ FileReader
SourceImageState.src (Data URL)
  ├─ generateEngravingMap → EngravingSnapshot.src
  ├─ composePreviewImage → 3Dプレビュー用Data URL
  └─ EditorSnapshot

3D Canvas + ExportCropRegion
  ↓ exportCanvasImage
Blob
  ↓ downloadBlob
ローカルファイル
```

## 現行MVPに存在しないモデル

- `SavedSimulation`
- `SaveSimulationPayload`
- `ResultViewModel`
- `sourceImageId`
- `savedSimulationId`
- `resultImageUrl`
- `exportedImageDataUrl`

これらはサーバー永続化と結果再参照の要件が確定した場合に、API契約と同時に新規設計する。

## 未確認・推定

- Data URLを含むスナップショットのブラウザ別容量上限は未検証
- sessionStorageの保持期間をユーザーへ案内する要件は未定義
- サーバー永続化、共有URL、保存履歴のデータモデルは未定義
