# 3Dビュー画像入力導線変更 - 実装計画

## 概要
画像タブ内の `ImageUploader` ベースのアップロードUIを廃止し、3Dビュー上でのドラッグ&ドロップおよびクリックによるファイル選択を新しい画像入力導線にする。既存の PNG バリデーション、読み込み中表示、エラーハンドリング、彫刻画像生成は維持しつつ、入力開始位置だけを 3D プレビュー側へ移す。

## 前提条件
- 現在の画像読み込み処理は [components/screens/SimulatorScreen.tsx](/Users/kiyotada/AcrylLedSimulator/components/screens/SimulatorScreen.tsx) の `handleFileSelected` に集約されており、この責務は極力維持する
- 3D プレビュー本体は [components/simulator/SimulatorCanvas.tsx](/Users/kiyotada/AcrylLedSimulator/components/simulator/SimulatorCanvas.tsx)、画像タブUIは [components/controls/ImageControls.tsx](/Users/kiyotada/AcrylLedSimulator/components/controls/ImageControls.tsx) が担当している
- 現行のファイル種別・サイズ検証とドラッグ状態は [components/upload/ImageUploader.tsx](/Users/kiyotada/AcrylLedSimulator/components/upload/ImageUploader.tsx) にあるため、完全削除ではなく再利用可能なロジック単位へ分離する前提で進める
- エラー時は既存方針どおり「直前の有効プレビューを可能な限り維持する」を守る

**特記事項**
- mainブランチには直接コミットしないこと
- サブタスクを基準に適宜コミットを行うこと
- 実装完了後にコードレビューを実行すること
- 全ての作業が完了した後、PRを作成する

## タスク一覧

### Task 1: 3Dビュー入力導線の受け皿を設計する

**目的:** 3Dビュー側でファイルドロップとクリック選択を受け付けるUI責務を定義し、初期表示・読込中・エラー時の見え方を整理する。

**変更ファイル:**
- `components/simulator/SimulatorCanvas.tsx`
- `components/screens/SimulatorScreen.tsx`
- `app/globals.css`
- `tests/components/simulator/SimulatorCanvas.test.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`

**サブタスク:**
1. [ ] 3Dビュー未設定時と設定済み時の双方で、クリック選択とドラッグオーバーをどこで受けるかをテスト観点込みで整理する
2. [ ] コミット: `test: cover file input entry points on simulator preview`
3. [ ] `SimulatorCanvas` またはその外側ラッパーへ「ファイル選択を開始できるホストUI」の props を追加し、空状態文言とオーバーレイ責務を明確化する
4. [ ] コミット: `feat: add preview-host upload surface`
5. [ ] 3Dビュー上の drag over / drag leave / drop / click の視覚状態を `app/globals.css` に追加し、既存ローディングオーバーレイと競合しない構造へ整える
6. [ ] コミット: `feat: style drag and click upload affordance on preview`
7. [ ] 対象テストを実行して、入力導線の受け皿だけで成立することを確認する

---

### Task 2: 画像選択ロジックを 3Dビュー用に再配置する

**目的:** 既存 `ImageUploader` が持つファイル検証とファイル入力処理を、3Dビュー側からも使える形へ分離し、読み込み本体は既存の `handleFileSelected` を再利用する。

**変更ファイル:**
- `components/upload/ImageUploader.tsx`
- `components/screens/SimulatorScreen.tsx`
- `lib/image/loadPngTexture.ts`
- `tests/components/upload/ImageUploader.test.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`
- `tests/lib/image/loadPngTexture.test.ts`

**サブタスク:**
1. [ ] PNG限定・8MB制限・無効ファイル時の表示維持に関する既存テストを、UI部品から切り出しても担保できる形へ更新する
2. [ ] コミット: `test: preserve png validation when moving upload entry`
3. [ ] ファイル検証と `input[type="file"]` 起動の責務を、3Dビュー側と既存部品の双方から利用できる単位へ抽出する
4. [ ] コミット: `refactor: extract reusable png file selection logic`
5. [ ] `SimulatorScreen` から新しい入力導線へ `handleFileSelected` を接続し、クリック選択・ドロップのどちらでも同一処理系を通るよう統合する
6. [ ] コミット: `feat: connect preview surface to source image loader`
7. [ ] 関連テストを実行し、読み込み成功・失敗・非PNG入力の回帰がないことを確認する

---

### Task 3: 画像タブから旧アップロードUIを撤去し、状態表示を整理する

**目的:** 画像タブは「現在の入力確認」と「レイアウト調整」に責務を絞り、入力開始は3Dビューへ一本化する。

**変更ファイル:**
- `components/controls/ImageControls.tsx`
- `components/upload/ImageUploader.tsx`
- `components/screens/SimulatorScreen.tsx`
- `tests/components/controls/ImageControls.test.tsx`
- `tests/components/upload/ImageUploader.test.tsx`

**サブタスク:**
1. [ ] 画像タブの期待表示をテストへ先に反映し、アップロードUI削除後もファイル名・ステータス・調整UIが見えることを固定する
2. [ ] コミット: `test: update image controls after removing inline uploader`
3. [ ] `ImageControls` から `ImageUploader` 呼び出しを除去し、3Dビューで操作する旨の説明文と現在の入力表示へ差し替える
4. [ ] コミット: `feat: simplify image controls to status and layout only`
5. [ ] 不要になった `ImageUploader` を削除するか、共通ロジックだけ残す薄い内部部品へ整理して、未使用コードを解消する
6. [ ] コミット: `refactor: remove deprecated image uploader panel ui`
7. [ ] 対象コンポーネントテストを実行して、画像タブの責務変更が意図どおり反映されていることを確認する

---

### Task 4: 仕様文言と回帰確認項目を更新する

**目的:** 実装後のUIと運用ドキュメントの不整合をなくし、QAが新しい入力導線で確認できる状態にする。

**変更ファイル:**
- `docs/specs/ux/screens.md`
- `docs/specs/architecture/error-handling.md`
- 必要に応じて `.docs/topics/20260410_1_3d-view-image-input/checklist-1.md`

**サブタスク:**
1. [ ] 画面仕様・エラーハンドリングの記述を、画像タブ起点から3Dビュー起点へ変更する差分を洗い出す
2. [ ] コミット: `docs: update simulator upload flow references`
3. [ ] 新しいQA観点として「3Dビューにドラッグ」「3Dビュークリックでファイル選択」「読込失敗後の再試行」を明記する
4. [ ] コミット: `docs: add qa coverage for preview-based upload`
5. [ ] 実装チェックリストの確認項目と整合させ、検証漏れがないことを見直す
6. [ ] テスト実行結果とドキュメント差分を最終確認する

## 依存関係
- Task 2 は Task 1 で 3Dビュー側の受け皿構造が決まってから着手する
- Task 3 は Task 2 の接続完了後に進める。先に消すと入力導線が一時的に失われるため順序を逆転しない
- Task 4 は Task 3 完了後に行い、最終UIに合わせて仕様を更新する

## 備考
- 既存の `preview-empty-state` はそのまま置き換えるのではなく、「未設定時も設定済み時も同じアップロード導線を持つか」を先に決めてから実装する
- ドラッグ&ドロップは Canvas DOM そのものより、外側のホスト要素で扱う方がテストとアクセシビリティの両面で安定しやすい
- `input[type="file"]` は視覚的には隠しても、キーボード操作とスクリーンリーダー導線を失わない設計にする
- 既存エラー方針どおり、無効ファイル選択や読み込み失敗でも直前の有効画像があれば維持する
