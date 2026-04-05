# preview時の元画像表示デフォルトオフ - 実装計画

## 概要
`/simulator` の preview で表示される元画像オーバーレイを、初期状態でオフに変更する。現状は [`components/screens/SimulatorScreen.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/screens/SimulatorScreen.tsx) で `showSourceOverlay` を `true` 初期化しており、表示設定リセット時とセッション復元時のフォールバックもオン寄りになっている。この計画では、初期表示・リセット・保存復元の既定値を揃え、表示設定 UI と 3D preview の整合性を保つ。

## 前提条件
- 「元造の表示」は現行 UI 上の「元画像を重ねて表示」を指すものとして扱う
- 対象は preview 上の元画像オーバーレイ既定値に限定し、入力画像カードや彫刻用グレースケールの 2D 比較プレビューは変更しない
- 既存の保存データ構造 `EditorSnapshot.simulation.showSourceOverlay` は維持し、保存済みデータの明示的な値は尊重する
- 回帰確認は [`tests/components/screens/SimulatorScreen.test.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/tests/components/screens/SimulatorScreen.test.tsx)、[`tests/components/controls/DisplayControls.test.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/tests/components/controls/DisplayControls.test.tsx)、[`tests/lib/save/session.test.ts`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/tests/lib/save/session.test.ts) を中心に行う

**特記事項**
- mainブランチには直接コミットしないこと
- サブタスクを基準に適宜コミットを行うこと
- 実装完了後にコードレビューを実行すること
- 全ての作業が完了した後、PRを作成する

## タスク一覧

### Task 1: 元画像オーバーレイ既定値の回帰テストを先に固定する

**目的:** preview 初期表示、表示設定リセット、保存済みスナップショット復元時の期待動作をテストで先に明文化する。

**変更ファイル:**
- `tests/components/screens/SimulatorScreen.test.tsx`
- `tests/components/controls/DisplayControls.test.tsx`
- `tests/lib/save/session.test.ts`

**サブタスク:**
1. [ ] テストの作成/更新: 初回表示で `showSourceOverlay` がオフ、表示設定リセット後もオフ、明示的に保存された `showSourceOverlay` は復元時に維持されることを検証する（コミット: `test: cover default hidden source overlay`）
2. [ ] テストの作成/更新: 表示設定 UI のチェックボックス初期状態と文言表示がオフ前提で整合することを検証する（コミット: `test: verify display controls default overlay state`）
3. [ ] テスト実行

**受け入れ条件:**
- [ ] `/simulator` の初回表示で元画像オーバーレイが描画オフになることをテストで確認できる
- [ ] リセット操作後に元画像オーバーレイが再びオンへ戻らないことを確認できる
- [ ] 保存済みスナップショットに `showSourceOverlay` が存在する場合、その値が優先されることを確認できる

---

### Task 2: preview既定値と表示設定の実装を揃える

**目的:** `showSourceOverlay` の初期化、リセット、保存復元時のフォールバック値をオフへ統一し、UI 表示と Canvas の状態を一致させる。

**変更ファイル:**
- `components/screens/SimulatorScreen.tsx`
- `components/controls/DisplayControls.tsx`
- `components/simulator/SimulatorCanvas.tsx`
- `components/simulator/AcrylicStandMesh.tsx`

**サブタスク:**
1. [ ] `SimulatorScreen` の `showSourceOverlay` 初期値、`handleResetView`、`resetEditor`、resume 復元時のフォールバックをオフ基準へ変更する（コミット: `feat: default source overlay to hidden`）
2. [ ] `DisplayControls` の状態表示とチェックボックス初期状態が変更後の既定値と矛盾しないことを確認し、必要なら補助文言を調整する（コミット: `refactor: align display controls with overlay default`）
3. [ ] `SimulatorCanvas` / `AcrylicStandMesh` 側のデフォルト引数が実運用上の既定値と食い違わないように整理する（コミット: `refactor: align simulator overlay fallback`）
4. [ ] テスト実行

**受け入れ条件:**
- [ ] 画像読み込み直後の 3D preview で元画像オーバーレイが表示されない
- [ ] ユーザーがチェックボックスをオンにした場合のみ元画像オーバーレイが表示される
- [ ] 「表示設定をリセット」後は背景とカメラだけでなく元画像オーバーレイもデフォルトオフへ戻る
- [ ] 保存済みデータがない resume ケースではデフォルトオフ、保存済みデータがある resume ケースでは保存値を再現する

## 依存関係
- Task 2 は Task 1 の完了後に着手する

## 備考
- 既存保存データとの互換性を壊さないため、`showSourceOverlay` フィールド自体は削除しない
- 2D 比較プレビューの「元画像」カードは別用途のため、今回の変更対象に含めない
- 実装後は `/simulator?resume=1` と `/simulator?reset=1` の両方で手動確認を行う
