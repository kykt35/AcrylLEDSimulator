# シミュレータ右カラム調整 - 実装計画

## 概要
シミュレータページ右カラムのタグ表示とコンテンツ表示を見直し、設定切り替えの視認性、現在地の分かりやすさ、狭い画面での操作性を改善する。現状は [`components/screens/SimulatorScreen.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/screens/SimulatorScreen.tsx) で 5 つのタブを並べ、[`app/globals.css`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/app/globals.css) の `control-tablist` / `control-tab-card` / `control-tab-panels` で右カラム全体を制御している。この計画では、右カラムのナビゲーション表現と各タブ内コンテンツの情報密度を調整し、既存機能を維持したまま UI を整理する。

## 前提条件
- 対象は `/simulator` 画面の右カラム UI に限定し、画像生成や書き出しロジック自体は変更しない
- 「タグ」は現状実装上のタブ UI と解釈する
- 右カラムの詳細な最終デザインは未確定のため、既存の情報構造を保ちながら改善する前提で計画する
- 画面回帰は [`tests/components/screens/SimulatorScreen.test.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/tests/components/screens/SimulatorScreen.test.tsx) を中心に担保する

**特記事項**
- mainブランチには直接コミットしないこと
- サブタスクを基準に適宜コミットを行うこと
- 実装完了後にコードレビューを実行すること
- 全ての作業が完了した後、PRを作成する

## タスク一覧

### Task 1: 右カラム UI 方針の整理と最小テスト更新

**目的:** タブ/タグ表示とコンテンツ表示の改修方針を `SimulatorScreen` の実装単位へ落とし込み、回帰防止の観点を先に固定する。

**変更ファイル:**
- `components/screens/SimulatorScreen.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`

**サブタスク:**
1. [ ] テストの作成/更新: 右カラムのナビゲーション表示、選択状態、切替対象パネルの見え方を検証するケースを追加する（コミット: `test: cover simulator control panel navigation`）
2. [ ] 右カラムの現行構成を整理し、タブ定義に必要な補助情報を追加できる形へ整える（例: 補助ラベル、状態表示、グルーピング用メタデータ）（コミット: `refactor: prepare simulator control panel metadata`）
3. [ ] 追加したテストを実行し、既存操作フローを壊していないことを確認する

**受け入れ条件:**
- [ ] タブ選択状態と表示対象パネルの関係をテストで検証できる
- [ ] 右カラム UI 改修前に保持すべき挙動が明文化されている

---

### Task 2: タグ表示とレイアウトの調整

**目的:** 右カラム上部のタグ群を視認しやすくし、アクティブ状態とタブ切替の意味を明確にする。

**変更ファイル:**
- `components/screens/SimulatorScreen.tsx`
- `app/globals.css`

**サブタスク:**
1. [ ] テストの作成/更新: タグ表示のラベル、選択状態、必要なアクセシビリティ属性を検証する（コミット: `test: update simulator control tab presentation`）
2. [ ] `CONTROL_PANEL_TABS` と右カラム描画を見直し、必要に応じてラベル補助情報、現在地表示、モバイル時の折返し/横スクロール方針を実装する（コミット: `feat: refine simulator control tab navigation`）
3. [ ] `control-tablist` / `control-tab` / `control-panel` 周辺の CSS を更新し、横並び崩れ、過密な折返し、選択状態の弱さを解消する（コミット: `style: adjust simulator right column tabs`）
4. [ ] テスト実行

**受け入れ条件:**
- [ ] 右カラムのタグ群で現在選択中の項目が一目で分かる
- [ ] タグ数が多い状態でも狭い幅で破綻しにくい
- [ ] 既存のタブ切替操作とキーボード操作を維持する

---

### Task 3: コンテンツ表示の情報設計とスクロール挙動の調整

**目的:** タブ切替後のコンテンツを読みやすくし、右カラム内の情報密度とスクロール体験を改善する。

**変更ファイル:**
- `components/screens/SimulatorScreen.tsx`
- `components/controls/ImageControls.tsx`
- `components/controls/EngravingControls.tsx`
- `components/controls/LightingControls.tsx`
- `components/controls/DisplayControls.tsx`
- `components/controls/SaveControls.tsx`
- `app/globals.css`
- `tests/components/screens/SimulatorScreen.test.tsx`

**サブタスク:**
1. [ ] テストの作成/更新: 各タブで主要見出し、主要操作、状態表示が確認できることを検証する（コミット: `test: verify simulator control panel content layout`）
2. [ ] 各コントロールの見出し、補助文、状態表示の優先度を見直し、必要に応じてセクション順序や文言を調整する（コミット: `feat: reorganize simulator control panel content`）
3. [ ] `control-tab-card` / `control-tab-panels` / `panel-section` 周辺の CSS を更新し、二重の囲み感、余白不足、スクロール起点の分かりづらさを解消する（コミット: `style: refine simulator control panel content area`）
4. [ ] テスト実行

**受け入れ条件:**
- [ ] 各タブの先頭で何を設定する領域か判別できる
- [ ] 状態表示と主要操作が埋もれず、右カラム単体で読み進めやすい
- [ ] 右カラム内スクロール時にコンテンツが欠けたり操作しづらくなったりしない

## 依存関係
- Task 2 は Task 1 の完了後に着手する
- Task 3 は Task 2 のナビゲーション構造確定後に着手する

## 備考
- 最終的な UI 変更量が小さい場合でも、テストは「表示ラベル」「選択状態」「対象コンテンツ表示」の 3 点を最低限カバーする
- 右カラムをタブのまま改善する案を優先し、アコーディオンや常時展開への変更は追加要件が出た場合の代替案として扱う
- デザイン要件が別途ある場合は、その差分を Task 2 と Task 3 の受け入れ条件へ反映してから着手する
