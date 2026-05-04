# uiux-current-improvements - 実装計画

## 概要

`report-1.md` のUI使いやすさ分析をもとに、LEDアクスタ シミュレーターの主導線を「PNG追加 -> 調整 -> 書き出し」として見通しやすくする。対象は既存MVPの画面構造を大きく壊さず、操作パネル、文言、レスポンシブ表示、入口導線を段階的に改善する範囲とする。

本計画では、1 Task = 1 PR、1サブタスク = 1コミット単位を原則とする。各Taskはテスト作成/更新、実装、検証の順で進める。

## 対象レポート

- `./report-1.md`

## スコープ

### 対象

- 画像未選択時の操作パネル整理
- 画像配置文言の日本語化
- タブ間の次ステップ導線追加
- モバイル時のタブ視認性改善
- シミュレーター入口の短い開始ガイド追加
- 関連テスト更新

### 対象外

- 3D描画品質の変更
- 保存結果専用画面の新規実装
- 注文導線、共有URL、アカウント機能
- モーダル基盤の全面刷新
- デザインシステム全体の再設計

## タスク一覧

| Task | PR相当の内容 | 主な変更領域 | 依存 |
|---|---|---|---|
| Task 1 | 画像未選択時のUI整理と文言改善 | `ImageControls`, `SimulatorScreen`, テスト | なし |
| Task 2 | タブ間の次ステップ導線追加 | `SimulatorScreen`, 各Control, テスト | Task 1 |
| Task 3 | モバイル操作パネルと書き出し視認性改善 | `app/globals.css`, `SimulatorScreen`, テスト | Task 2 |
| Task 4 | 入口ガイドと最終UX確認 | `SimulatorScreen`, `app/page.tsx` または `/about` 導線, E2E相当確認 | Task 1-3 |

---

## Task 1: 画像未選択時のUI整理と文言改善

**目的:** 初回表示で「まずPNGを追加する」ことに集中できるようにし、未選択時に効かない調整UIを隠す。あわせて `Contain / Cover / Fill` を一般ユーザー向けの日本語ラベルに変更する。

**変更ファイル:**
- `components/controls/ImageControls.tsx`
- `components/screens/SimulatorScreen.tsx`
- `tests/components/controls/ImageControls.test.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`

**サブタスク:**
1. [ ] `ImageControls` に画像有無を表す props（例: `hasImage`）を追加するテストを作成/更新する
2. [ ] コミット: `test(ui): cover image controls empty state`
3. [ ] 画像未選択時は配置調整セクションを非表示または待機メッセージ表示に変更する
4. [ ] コミット: `feat(ui): simplify image controls before upload`
5. [ ] `Contain / Cover / Fill` の表示を `全体を収める / 余白なく広げる / 枠いっぱいに伸ばす` に変更し、内部値は既存の `contain / cover / fill` を維持する
6. [ ] コミット: `feat(ui): localize image fit labels`
7. [ ] `npm test -- tests/components/controls/ImageControls.test.tsx tests/components/screens/SimulatorScreen.test.tsx` を実行して結果を確認する

**受け入れ条件:**
- [ ] 画像未選択時、画像サイズ / 横位置 / 縦位置 / フィット切替が主操作として表示されない
- [ ] 画像未選択時、「PNGを追加すると配置調整ができます」相当の案内が表示される
- [ ] 画像読み込み後は既存どおり配置調整ができる
- [ ] フィット切替の内部値とプレビュー生成処理は壊れない
- [ ] 関連テストが通る

---

## Task 2: タブ間の次ステップ導線追加

**目的:** 並列に見えるタブUIに、ユーザーが次に進むための明示的なCTAを追加し、「画像 -> 彫刻 -> ライト -> 表示 -> 書き出し」の主導線を補強する。

**変更ファイル:**
- `components/screens/SimulatorScreen.tsx`
- `components/controls/ImageControls.tsx`
- `components/controls/EngravingControls.tsx`
- `components/controls/LightingControls.tsx`
- `components/controls/DisplayControls.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`
- 必要に応じて各 control test

**サブタスク:**
1. [ ] タブ末尾CTAの表示・クリックで次タブへ移動するテストを `SimulatorScreen` に追加する
2. [ ] コミット: `test(ui): cover step navigation between control tabs`
3. [ ] `SimulatorScreen` に次タブへ移動する共通ハンドラを追加し、各Controlへ `onNextStep` などのpropsを渡す
4. [ ] コミット: `feat(ui): add control step navigation handlers`
5. [ ] 各タブの末尾に次ステップボタンを追加する
   - 画像: `彫刻を調整する`
   - 彫刻: `ライトを調整する`
   - ライト: `表示を確認する`
   - 表示: `書き出しへ進む`
6. [ ] コミット: `feat(ui): add next step calls to action`
7. [ ] 画像未選択時のCTAの扱いを実装する
   - 画像タブ以外では待機表示またはdisabledにする
   - 書き出しタブの保存ボタンは既存どおり画像未選択時disabledを維持する
8. [ ] コミット: `feat(ui): gate step actions before upload`
9. [ ] `npm test -- tests/components/screens/SimulatorScreen.test.tsx` を実行して結果を確認する

**受け入れ条件:**
- [ ] 画像読み込み後、各タブから次のタブへ明示的に進める
- [ ] CTAクリック後、該当タブが `aria-selected="true"` になる
- [ ] キーボードタブ操作の既存挙動が維持される
- [ ] 画像未選択時に保存可能であるような誤認を与えない
- [ ] 関連テストが通る

---

## Task 3: モバイル操作パネルと書き出し視認性改善

**目的:** モバイル幅で「書き出し」タブが見落とされにくいようにし、操作パネル下部への到達性を上げる。

**変更ファイル:**
- `app/globals.css`
- `components/screens/SimulatorScreen.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`

**サブタスク:**
1. [ ] タブの全項目がDOM上で確認でき、モバイル用クラスや補助表示が出ることを検証するテストを追加/更新する
2. [ ] コミット: `test(ui): cover mobile control tab affordance`
3. [ ] 960px以下の `.control-tablist` を横スクロール依存から2段グリッド表示へ変更する
4. [ ] コミット: `feat(ui): improve mobile control tab layout`
5. [ ] 画像読み込み後に書き出しへ進める補助CTAまたはステータスをパネル上部に追加する
6. [ ] コミット: `feat(ui): surface export action after upload`
7. [ ] デスクトップのパネル内部スクロールに下端フェード等の視覚ヒントを追加する
8. [ ] コミット: `feat(ui): add control panel scroll affordance`
9. [ ] `npm test -- tests/components/screens/SimulatorScreen.test.tsx` を実行し、必要に応じてブラウザで `http://localhost:3001/` を確認する

**受け入れ条件:**
- [ ] モバイル幅で5タブすべてが初期視界または明確な2段表示内に収まる
- [ ] 「書き出し」が横スクロールしないと見えない状態にならない
- [ ] 画像読み込み後、書き出しへ進む補助導線が見える
- [ ] デスクトップの既存2カラムレイアウトが崩れない
- [ ] 関連テストが通る

---

## Task 4: 入口ガイドと最終UX確認

**目的:** 初見ユーザーが事前説明なしでも保存までの全体像を理解できるように、シミュレーター冒頭に短い開始ガイドを追加する。`/` と `/about` の役割は大きく入れ替えず、MVPへの影響が小さい改善に留める。

**変更ファイル:**
- `components/screens/SimulatorScreen.tsx`
- `app/about/page.tsx`（必要な文言調整のみ）
- `tests/components/screens/SimulatorScreen.test.tsx`
- `tests/app/page.test.tsx`（必要に応じて）

**サブタスク:**
1. [ ] シミュレーター冒頭に「1. PNG追加 / 2. 調整 / 3. 書き出し」の開始ガイドが表示されるテストを追加する
2. [ ] コミット: `test(ui): cover simulator start guide`
3. [ ] `SimulatorScreen` のヘッダー下に短いステップガイドを追加し、既存のプレビュー主役のレイアウトを圧迫しないスタイルを適用する
4. [ ] コミット: `feat(ui): add simulator start guide`
5. [ ] `/about` のCTAや説明文が現状の `/` 直行構成と矛盾しないように必要最小限で調整する
6. [ ] コミット: `docs(ui): align about copy with simulator entry`
7. [ ] 主要テストを実行する
   - `npm test -- tests/components/screens/SimulatorScreen.test.tsx tests/components/controls/ImageControls.test.tsx tests/app/page.test.tsx`
8. [ ] 実ブラウザでデスクトップ / モバイル相当の視認性を確認し、結果をチェックリストへ記録する

**受け入れ条件:**
- [ ] 初期表示で「PNG追加 -> 調整 -> 書き出し」の全体像が分かる
- [ ] 既存の3Dプレビュー導線が埋もれない
- [ ] `/about` から「試してみる」導線が維持される
- [ ] 主要テストが通る
- [ ] 実画面でテキストの重なりやタブ欠けがない

## 全体の依存関係

- Task 1 は他タスクの前提。画像有無のUI整理を先に行う。
- Task 2 は Task 1 の `hasImage` / 待機状態整理を前提にする。
- Task 3 は Task 2 の次ステップ導線をモバイルで見せる調整を含む。
- Task 4 は Task 1-3 後の最終的な入口説明と確認を行う。

## 検証方針

- 単体/コンポーネントテスト:
  - `tests/components/controls/ImageControls.test.tsx`
  - `tests/components/screens/SimulatorScreen.test.tsx`
  - 必要に応じて `tests/app/page.test.tsx`
- 実行コマンド:
  - `npm test -- tests/components/controls/ImageControls.test.tsx tests/components/screens/SimulatorScreen.test.tsx`
  - 最終確認で `npm test`
- 目視確認:
  - `npm run dev`
  - `http://localhost:3001/` または利用可能ポート
  - デスクトップ幅とモバイル相当幅で、タブ表示、次ステップCTA、書き出し導線、初期ガイドを確認する

## リスクと対応

- タブCTA追加でControlコンポーネントのpropsが増える
  - 対応: 各Controlに責務を持たせすぎず、タブ切替ロジックは `SimulatorScreen` に集約する
- モバイル2段タブ化で既存デスクトップ表示へ影響する
  - 対応: 変更を `@media (max-width: 960px)` に閉じる
- 文言変更で既存テストが落ちる
  - 対応: 表示文言を意図した仕様としてテストを更新する
- `/` と `/about` の役割変更は影響が大きい
  - 対応: 今回は入口ガイド追加を優先し、ルーティング入れ替えは別計画に切り出す

## 備考

- 既存の `package-lock.json` に未関連の変更があるため、本計画実装時も差分混入に注意する。
- 実装時はユーザー変更を巻き戻さず、対象ファイルの差分のみ扱う。
