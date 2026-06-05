# Acrylic Size Dropdown Feasibility Report

- Report Type: architecture-review
- Topic: acrylic-size-dropdown-feasibility
- Source Documents: `docs/specs/product/prd.md`, `docs/specs/ux/screens.md`, `docs/specs/architecture/state-design.md`, `components/screens/SimulatorScreen.tsx`, `components/controls/DisplayControls.tsx`, `components/controls/ImageControls.tsx`, `components/simulator/SimulatorCanvas.tsx`, `components/simulator/AcrylicStandMesh.tsx`, `components/simulator/LedBaseMesh.tsx`, `components/simulator/CameraController.tsx`, `lib/save/session.ts`
- Created: 2026-04-05

## Summary

アクリル板サイズをプルダウンで選べるようにする実装は十分現実的であり、現在の構成にも無理なく追加できる。ただし、UI に選択肢を 1 つ増やすだけでは不十分で、少なくとも「板形状」「台座寸法」「カメラ距離」「保存スナップショット」の 4 箇所を同時に整合させる必要がある。

現状は板サイズが `AcrylicStandMesh` の固定値 `1.6 x 2.4 x 0.08` に埋め込まれており、台座寸法と発光位置も `LedBaseMesh` 内で固定されている。このままではプルダウンを追加しても見た目だけが変わらず、選択値が UI 上の飾りになってしまう。

したがって、推奨方針は「サイズプリセット定義を `lib/` に切り出し、`SimulatorScreen` が選択状態を持ち、`SimulatorCanvas` 経由で板・台座・カメラへ配る」構成である。MVP では自由入力ではなく、商品として扱う定型サイズのプリセット選択に限定するのが妥当である。

## Current State

### 実装上の現状

- [`components/screens/SimulatorScreen.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/screens/SimulatorScreen.tsx) は LED 色、明るさ、背景、カメラ、画像レイアウトを state 管理しているが、板サイズ state は持っていない
- [`components/controls/DisplayControls.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/controls/DisplayControls.tsx) は背景とカメラのみを扱っており、商品仕様に相当する選択 UI はまだない
- [`components/simulator/AcrylicStandMesh.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/simulator/AcrylicStandMesh.tsx) は `boxGeometry args={[1.6, 2.4, 0.08]}` と `planeGeometry args={[1.58, 2.38]}` を固定値で持つ
- [`components/simulator/LedBaseMesh.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/simulator/LedBaseMesh.tsx) は台座直径、発光バー幅、ライト位置が固定で、板サイズとの関係を持っていない
- [`components/simulator/CameraController.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/simulator/CameraController.tsx) はサイズ差分を考慮せず固定のカメラ座標を使っている
- [`lib/save/session.ts`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/lib/save/session.ts) の `SimulationSnapshot` に板サイズが含まれていない

### 影響範囲

板サイズの選択値は、次の 4 つに同時反映される必要がある。

1. 3D の板寸法
2. 台座の幅や発光位置
3. 初期カメラの見切れ防止
4. セッション保存と再開時の復元

## Options

### 案1: UI にだけプルダウンを追加する

`DisplayControls` または `ImageControls` に `select` を追加し、選択値を state に保持するだけの案。

評価:

- 実装は最小
- 3D 表示が変わらないため要件を満たさない
- 将来の保存や URL 復元にも繋がらない

結論:

不採用。ユーザー価値が出ない。

### 案2: 板サイズだけ可変にする

`AcrylicStandMesh` の geometry のみをサイズプリセットに置き換える案。

評価:

- 板の見た目は変わる
- 台座とのバランスが崩れやすい
- 大きいサイズでカメラに収まらない可能性がある
- 保存復元を追加しないと編集継続で状態が欠落する

結論:

部分対応としては可能だが、中途半端で不整合が残る。

### 案3: サイズプリセットを導入し、板・台座・カメラ・保存を連動させる

サイズを 1 つのプリセット定義として持ち、各描画コンポーネントに配る案。

評価:

- 現在の props 駆動構成に素直に乗る
- 商品ラインナップの追加や変更がしやすい
- 将来、板厚や差し込み幅の差分にも拡張しやすい
- 実装範囲は増えるが整合性が高い

結論:

推奨。

## Recommended Approach

### 1. サイズプリセットを `lib/simulator` に定義する

例:

```ts
export type AcrylicSizePreset = {
  id: "small" | "medium" | "large";
  label: string;
  width: number;
  height: number;
  thickness: number;
  baseWidth: number;
  baseDepth: number;
  baseHeight: number;
  ledBarWidth: number;
  pointLightY: number;
  pointLightZ: number;
  cameraDistanceMultiplier: number;
};
```

ポイント:

- 実寸 mm をそのまま扱うより、まずは現在の Three.js 空間に対する相対寸法で揃える方が安全
- MVP では `small / medium / large` のような定型プリセットで十分
- 表示ラベルだけ `100 x 150 mm` のような実商品名にすればよい

### 2. `SimulatorScreen` に選択 state を追加する

追加候補:

- `const [acrylicSizeId, setAcrylicSizeId] = useState(defaultAcrylicSizePresetId);`

反映先:

- `buildEditorSnapshot`
- `resume` 時の state 復元
- コントロールパネルの表示ラベル

保存対象へ加える値:

- `simulation.acrylicSizeId`

### 3. UI はプルダウンを 1 箇所に集約する

配置先は `DisplayControls` より `ImageControls` の先頭、もしくは新設の「商品設定」セクションがよい。

理由:

- 背景やカメラは閲覧条件だが、板サイズは商品仕様であり意味が異なる
- 今後「板厚」「台座タイプ」「差し込み位置」も増えるなら、表示設定に混ぜると破綻しやすい

MVP で最小に寄せるなら、`ImageControls` のアップロード領域の上に次のような `select` を置く。

```tsx
<label className="control-field">
  <span className="control-label">アクリル板サイズ</span>
  <select
    value={activeSizeId}
    onChange={(event) => onAcrylicSizeChange(event.target.value)}
  >
    {acrylicSizePresets.map((preset) => (
      <option key={preset.id} value={preset.id}>
        {preset.label}
      </option>
    ))}
  </select>
</label>
```

### 4. `SimulatorCanvas` から板・台座へサイズプリセットを渡す

推奨 props 追加:

- `SimulatorCanvasProps.sizePreset`
- `AcrylicStandMeshProps.sizePreset`
- `LedBaseMeshProps.sizePreset`

これにより、固定値を各コンポーネントから排除できる。

### 5. カメラはプリセット座標の固定値をやめ、サイズ係数を掛ける

現状の `front: [0, 0.8, 4.6]` などは中サイズ前提である。サイズ差が大きい場合は見切れや余白過多が起きるため、少なくとも Z 距離に倍率を掛けるべきである。

簡易案:

- 各カメラプリセットの基準座標は維持する
- `sizePreset.cameraDistanceMultiplier` を掛けて `camera.position` を補正する

これで実装負荷を抑えつつ破綻を避けられる。

## Proposed File Changes

- `lib/simulator/acrylicSizePresets.ts`
  - サイズプリセット定義と取得関数を追加
- [`components/screens/SimulatorScreen.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/screens/SimulatorScreen.tsx)
  - `acrylicSizeId` state、保存復元、タブ表示文言を追加
- [`components/controls/ImageControls.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/controls/ImageControls.tsx)
  - プルダウン UI と変更コールバックを追加
- [`components/simulator/SimulatorCanvas.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/simulator/SimulatorCanvas.tsx)
  - `sizePreset` props を受けて下位へ受け渡し
- [`components/simulator/AcrylicStandMesh.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/simulator/AcrylicStandMesh.tsx)
  - 固定 geometry をプリセット参照へ置換
- [`components/simulator/LedBaseMesh.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/simulator/LedBaseMesh.tsx)
  - 台座と発光位置をプリセット連動へ変更
- [`components/simulator/CameraController.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/simulator/CameraController.tsx)
  - サイズ補正を追加
- [`lib/save/session.ts`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/lib/save/session.ts)
  - `SimulationSnapshot` へ `acrylicSizeId` を追加

## UI Recommendation

プルダウンの選択肢は、実寸を含む商品名で表記するのがよい。

例:

- `S (100 x 150 mm)`
- `M (120 x 180 mm)`
- `L (150 x 200 mm)`

補足:

- 初期値は現状の見た目に最も近いサイズを `M` として合わせる
- 選択変更時に画像レイアウトを自動リセットするかは慎重に判断すべき
- まずはレイアウトを維持し、見切れが多い場合だけ「サイズ変更後に位置を調整してください」と案内する方が破壊的でない

## Risks

- サイズ変更後に画像位置・スケールの見え方が変わるため、ユーザーが「画像がずれた」と感じる可能性がある
- 台座寸法を連動させないと、板だけ大きくなって物理的に不自然な見た目になる
- 接写カメラは大サイズで意図せずトリミングされやすい
- 保存スナップショットにサイズがないままだと、再開時に別サイズで開いてしまう

## Implementation Order

1. `lib/simulator/acrylicSizePresets.ts` を追加し、現行固定値に相当する既定サイズを定義する
2. `SimulatorScreen` に `acrylicSizeId` state と snapshot 保存復元を追加する
3. `ImageControls` にプルダウンを追加する
4. `SimulatorCanvas` から `AcrylicStandMesh` と `LedBaseMesh` へサイズプリセットを渡す
5. `CameraController` にサイズ倍率補正を追加する
6. 大中小の各サイズで、正面・俯瞰・接写が見切れないか手動確認する

## Conclusion

アクリル板サイズのプルダウン追加は、現在のコンポーネント分離を活かして素直に実装できる。ただし、真に必要なのは「選択 UI の追加」ではなく「サイズプリセットを描画系全体へ通すこと」である。

そのため、実装は `ImageControls` もしくは新設の「商品設定」にプルダウンを置き、`SimulatorScreen` を単一の状態起点として、板・台座・カメラ・保存へ伝播させる構成を採るべきである。これが最小の追加で整合性を保てる実現方法である。
