# Output Image Download Report

- Report Type: architecture-review
- Topic: output-image-download-only
- Source Documents: `components/screens/SimulatorScreen.tsx`, `components/screens/ResultScreen.tsx`, `components/controls/SaveControls.tsx`, `lib/export/exportCanvasImage.ts`, `app/api/save/route.ts`, `lib/save/session.ts`
- Created: 2026-04-03

## Summary

現状の出力画像導線は、「保存」と表現しているが、実態は `canvas.toDataURL("image/png")` で生成した `data:image/png;base64,...` を `/api/save` に送信し、そのまま結果画面と `sessionStorage` に返しているだけである。永続保存はしておらず、実質は「base64 化した画像の一時保持 + ダウンロード」である。

今回の要件は次の 2 点である。

- 保存機能はなくし、ダウンロードのみ可能にする
- 画像は base64 文字列ではなく、`jpg` / `png` ファイルとしてダウンロードする

この要件に対しては、`toDataURL` ベースをやめ、`HTMLCanvasElement.toBlob()` で `Blob` を生成し、`URL.createObjectURL()` でダウンロードさせる構成へ変更するのが適切である。

## Current State

### 実装上の現状

- [`lib/export/exportCanvasImage.ts`](/Users/kiyotada/AcrylLedSimulator/lib/export/exportCanvasImage.ts) は `canvas.toDataURL("image/png")` を返している
- [`components/screens/SimulatorScreen.tsx`](/Users/kiyotada/AcrylLedSimulator/components/screens/SimulatorScreen.tsx) は `exportedImageDataUrl` を `/api/save` へ POST している
- [`app/api/save/route.ts`](/Users/kiyotada/AcrylLedSimulator/app/api/save/route.ts) は `data:image/png;base64,` を検証し、そのまま `resultImageUrl` として返している
- [`components/screens/ResultScreen.tsx`](/Users/kiyotada/AcrylLedSimulator/components/screens/ResultScreen.tsx) は `result.resultImageUrl` を `<img>` と `<a download>` にそのまま使っている
- [`lib/save/session.ts`](/Users/kiyotada/AcrylLedSimulator/lib/save/session.ts) は結果画像 URL を `sessionStorage` に保存している

### 問題点

- 「保存」という文言と実装責務が一致していない
- `base64` は画像バイナリよりサイズが増えやすく、`sessionStorage` に載せると容量効率が悪い
- `data URL` はファイルとして扱いにくく、`jpg/png` の出力制御や品質設定がしづらい
- `Blob URL` は `sessionStorage` にそのまま保存できないため、現行の結果画面遷移設計とは相性が悪い

## Requirement Interpretation

今回の要件を実装に落とすと、意味は以下になる。

- アプリ内の「保存」文言、保存 API、保存済み結果という概念を廃止する
- 出力処理は「現在の見え方をファイルとしてダウンロードする」に統一する
- 出力形式は少なくとも `image/png` と `image/jpeg` を扱えるようにする
- ダウンロード時は `Blob` を生成し、拡張子付きのファイル名で保存させる

## Recommended Approach

### 結論

推奨案は「クライアント完結のダウンロード専用フロー」へ寄せる案である。

- `app/api/save/route.ts` は削除、または未使用化する
- `exportCanvasImage` は `string` ではなく `Blob` を返す関数へ変更する
- `SimulatorScreen` で `Blob` を生成し、その場でダウンロードする
- 結果画面へ遷移して確認する導線は廃止するか、どうしても残す場合は `IndexedDB` へ一時保存する

### 推奨理由

- 要件の「保存機能なし」と最も整合する
- base64 を排除できる
- `png/jpg` の MIME type とファイル名を直接制御できる
- サーバー API を経由しないため責務が明確になる
- 実装量と保守コストを最小化できる

## Detailed Design

### 1. 画像出力関数を `toBlob()` ベースへ変更する

現状:

```ts
return canvas.toDataURL("image/png");
```

変更後のイメージ:

```ts
export type ExportImageFormat = "png" | "jpeg";

export async function exportCanvasImage(
  rootElement: HTMLElement | null,
  format: ExportImageFormat
): Promise<Blob> {
  const canvas = rootElement?.querySelector("canvas");

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("書き出し対象の canvas が見つかりません。");
  }

  const mimeType = format === "png" ? "image/png" : "image/jpeg";
  const quality = format === "jpeg" ? 0.92 : undefined;

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, quality);
  });

  if (!blob) {
    throw new Error("画像の書き出しに失敗しました。");
  }

  return blob;
}
```

補足:

- `png` は透過を保持できる
- `jpeg` は透過できないため、背景色が確定する
- 背景透過が要件上必要なら、既定値は `png` を推奨する

### 2. ダウンロード専用ユーティリティを追加する

例:

```ts
export function downloadBlob(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(objectUrl);
}
```

注意:

- `revokeObjectURL` は即時実行でも多くのブラウザで動くが、安定性を優先するなら `setTimeout` で次 tick にずらす
- `jpeg` の拡張子は `.jpg` に寄せる方が利用者には自然

### 3. UI 文言と導線を保存からダウンロードへ変更する

対象:

- [`components/controls/SaveControls.tsx`](/Users/kiyotada/AcrylLedSimulator/components/controls/SaveControls.tsx)
- [`components/modals/SaveCompleteModal.tsx`](/Users/kiyotada/AcrylLedSimulator/components/modals/SaveCompleteModal.tsx)
- [`components/screens/SimulatorScreen.tsx`](/Users/kiyotada/AcrylLedSimulator/components/screens/SimulatorScreen.tsx)
- [`components/screens/ResultScreen.tsx`](/Users/kiyotada/AcrylLedSimulator/components/screens/ResultScreen.tsx)

変更方針:

- ボタン文言を `画像を保存する` から `画像をダウンロード` へ変更する
- 状態名 `save` は `download` または `export` へ変更する
- 成功メッセージは `保存が完了しました` ではなく `ダウンロードを開始しました` にする
- 結果画面は廃止するか、少なくとも「保存結果」という概念を外す

### 4. `jpg/png` の選択方法

実装案:

- MVP 最小案: `PNG` 固定でダウンロード
- 拡張案: `PNG / JPG` のセレクタを追加

推奨:

- 初回は `PNG` を既定値にする
- UI 余力があれば `PNG / JPG` の 2 択を追加する

理由:

- 元画像が透過 PNG 前提であり、JPEG では透過が失われる
- まず `PNG` を安全に成立させ、その後 JPEG を追加する方が仕様衝突が少ない

### 5. 結果画面を残す場合の対応

`Blob URL` はページ再読込や別画面復元に使えないため、結果画面を維持したい場合は別の保管手段が必要である。

選択肢:

- `IndexedDB` に `Blob` を保存し、結果画面で取り出して `object URL` を再生成する
- 一時的にサーバーへアップロードし、署名付き URL や一時ファイル URL から取得する

ただし、今回の要件は「保存機能なし」であるため、結果画面を残す理由は弱い。したがって、結果画面は廃止し、シミュレーター画面または完了モーダルから直接ダウンロードさせる構成を推奨する。

## API / State Impact

### API

- [`app/api/save/route.ts`](/Users/kiyotada/AcrylLedSimulator/app/api/save/route.ts) は不要になる
- `exportedImageDataUrl` を送る API 契約は廃止する

### State

- [`lib/save/session.ts`](/Users/kiyotada/AcrylLedSimulator/lib/save/session.ts) から `SavedSimulationResult` の画像 URL 保持は不要になる
- 再編集用に設定状態だけ保持したい場合は `EditorSnapshot` のみ残せばよい
- ダウンロード成否を UI に出すなら、`save.status` は `download.status` へ変更する

## Implementation Steps

1. `lib/export/exportCanvasImage.ts` を `toBlob` ベースの非同期関数へ変更する
2. `lib/download/downloadBlob.ts` のようなクライアント専用ユーティリティを追加する
3. `SimulatorScreen` の `handleSave` を `handleDownload` に置き換える
4. `SaveControls` の文言と props 名を保存前提からダウンロード前提へ変更する
5. `SaveCompleteModal` を「ダウンロード開始」または「形式選択」前提の文言へ変更する
6. `ResultScreen` と `/result` ルートを廃止するか、残す場合は `IndexedDB` 化する
7. `/api/save` とその関連テストを削除または未使用化する

## Test Plan

更新対象:

- [`tests/components/screens/SimulatorScreen.test.tsx`](/Users/kiyotada/AcrylLedSimulator/tests/components/screens/SimulatorScreen.test.tsx)
- [`tests/components/screens/ResultScreen.test.tsx`](/Users/kiyotada/AcrylLedSimulator/tests/components/screens/ResultScreen.test.tsx)

追加・変更観点:

- `exportCanvasImage` が指定形式の `Blob` を返す
- `画像をダウンロード` ボタン押下でダウンロード処理が呼ばれる
- `PNG` 選択時に `image/png` と `.png` が使われる
- `JPG` 選択時に `image/jpeg` と `.jpg` が使われる
- `canvas.toBlob()` が `null` を返した場合にエラー表示される
- 結果画面を廃止するなら、そのテストも削除する

## Risks And Controls

- JPEG 出力で透明部分が黒または意図しない色に見える
- 対応: JPEG 時は背景色を明示し、既定値は PNG にする

- `URL.revokeObjectURL()` のタイミングが早すぎるとダウンロードが失敗する
- 対応: ダウンロード開始後に遅延解放する

- 結果画面を残したまま `Blob` 化すると画面遷移後に画像参照できない
- 対応: 結果画面を廃止するか、`IndexedDB` を導入する

## Recommendation

今回の要件に対する最短かつ整合的な実現方法は、以下の構成である。

- 出力機能を「保存」ではなく「ダウンロード」に再定義する
- 画像生成は `canvas.toBlob()` を使う
- ダウンロードは `URL.createObjectURL()` + `<a download>` で実行する
- 形式は `PNG` を既定にし、必要なら `JPG` を追加する
- `result` 画面と `/api/save` は廃止する

この構成であれば、要件どおり base64 をやめつつ、実ファイルとしての `png/jpg` ダウンロードへ移行できる。
