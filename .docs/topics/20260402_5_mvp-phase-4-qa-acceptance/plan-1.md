# Phase 4 QA Acceptance Plan

## 概要
Phase 4 では、Phase 3 で実装した MVP を公開判断可能な品質まで整える。対象は新機能追加ではなく、主要ブラウザでの動作確認、操作導線の磨き込み、保存や例外系の確認、見た目と文言の調整、不具合修正、受入記録の整備である。実装作業は QA で見つかった問題の修正に限定し、仕様追加は次フェーズへ送る。

## 前提条件
- 基準要件は `specs/product/milestones.md`、`specs/product/prd.md`、`specs/ux/ui-design.md`、`specs/architecture/tech-stack.md` を参照する
- 受入基準は `specs/product/acceptance-criteria.md` を正とする
- エラー時挙動は `specs/architecture/error-handling.md` を正とする
- Phase 3 の実装前提は `.docs/topics/20260402_4_mvp-phase-3-mvp-implementation/plan-1.md` と実装済みコードを参照する
- Phase 4 はデスクトップ優先で進め、Chrome、Safari、Edge を最低確認対象とする

**特記事項**
- main ブランチには直接コミットしないこと
- Phase 4 中の変更は品質改善と不具合修正に限定し、新機能は入れないこと
- 受入記録と不具合一覧を成果物として残すこと
- 既知課題は「リリース阻害」「公開後許容」「次フェーズ送り」に分類して扱うこと

## タスク一覧

### Task 1: QA 実施条件と確認用チェックリストを整備する

**目的:** QA 実施前に確認対象、対応ブラウザ、操作シナリオ、記録フォーマットを固定し、受入確認の属人化を防ぐ。

**変更ファイル:**
- `.docs/topics/20260402_5_mvp-phase-4-qa-acceptance/checklist-1.md`
- `.docs/topics/20260402_5_mvp-phase-4-qa-acceptance/acceptance-log-1.md`
- `.docs/topics/20260402_5_mvp-phase-4-qa-acceptance/bug-list-1.md`

**サブタスク:**
1. [ ] `specs/product/acceptance-criteria.md` と `specs/architecture/error-handling.md` から確認観点を抽出する
2. [ ] コミット: `docs: prepare phase4 qa checklist`
3. [ ] ブラウザ別、主要導線別、例外ケース別のチェックリストを `checklist-1.md` に整理する
4. [ ] 受入結果を記録するテンプレートを `acceptance-log-1.md` に作成する
5. [ ] 不具合記録用のテンプレートを `bug-list-1.md` に作成する
6. [ ] Go / Hold 判定に必要な確認項目が揃っているか見直す

**受け入れ条件:**
- [ ] 対応ブラウザ、対象シナリオ、エラーケースが明文化されている
- [ ] QA 実施者が同じ記録フォーマットで結果を残せる
- [ ] 重大度付きで不具合を管理できる

---

### Task 2: 主要ブラウザで基本導線と保存導線を確認する

**目的:** MVP の主要フローが Chrome、Safari、Edge で成立することを確認し、ブラウザ差異を洗い出す。

**変更ファイル:**
- `.docs/topics/20260402_5_mvp-phase-4-qa-acceptance/acceptance-log-1.md`
- `.docs/topics/20260402_5_mvp-phase-4-qa-acceptance/bug-list-1.md`

**サブタスク:**
1. [ ] トップ画面からシミュレーター画面遷移、保存結果画面遷移までの基本導線を確認する
2. [ ] コミット: `docs: record phase4 browser acceptance results`
3. [ ] PNG アップロード、LED 色変更、明るさ変更、背景切替、カメラ切替、保存を各ブラウザで確認する
4. [ ] 保存結果画面の再編集、新規作成、ダウンロード導線を確認する
5. [ ] ブラウザ差異による見た目崩れや操作不能を `bug-list-1.md` へ記録する
6. [ ] 重大度が高いものを優先修正対象として切り分ける

**受け入れ条件:**
- [ ] 主要ブラウザで基本導線の結果が記録されている
- [ ] 保存成功導線の差異や問題点が整理されている
- [ ] 修正が必要な不具合が重大度付きで列挙されている

---

### Task 3: 例外ケースと回復性を確認する

**目的:** エラー時挙動が仕様どおりで、ユーザーが再試行可能な状態に戻れることを確認する。

**変更ファイル:**
- `.docs/topics/20260402_5_mvp-phase-4-qa-acceptance/acceptance-log-1.md`
- `.docs/topics/20260402_5_mvp-phase-4-qa-acceptance/bug-list-1.md`
- `tests/` 配下の必要なテストファイル

**サブタスク:**
1. [ ] 非 PNG 選択、壊れた画像、保存失敗、結果未保存状態などの例外ケースを列挙する
2. [ ] コミット: `test: cover phase4 error recovery flows`
3. [ ] 画面が壊れないこと、設定が保持されること、再試行導線があることを確認する
4. [ ] テストで担保しやすい回復性ケースを追加または更新する
5. [ ] 実装と受入基準の不一致があれば `bug-list-1.md` へ記録する
6. [ ] 公開前に潰すべき例外系不具合を確定する

**受け入れ条件:**
- [ ] `specs/architecture/error-handling.md` の主要ケースが確認されている
- [ ] 保存失敗や画像失敗で状態維持が確認できる
- [ ] 必要な回帰テストが追加または更新されている

---

### Task 4: UI 文言、導線、見た目を調整する

**目的:** 一般ユーザーが最小説明で迷わず操作できるレベルまで、文言、誘導、レイアウト、注意表示を調整する。

**変更ファイル:**
- `app/page.tsx`
- `app/globals.css`
- `components/screens/SimulatorScreen.tsx`
- `components/screens/ResultScreen.tsx`
- `components/modals/NoticeModal.tsx`
- `components/ui/ErrorNotice.tsx`
- `.docs/topics/20260402_5_mvp-phase-4-qa-acceptance/bug-list-1.md`

**サブタスク:**
1. [ ] QA で見つかった迷いやすい箇所、読みにくい文言、見た目崩れを洗い出す
2. [ ] コミット: `fix: polish phase4 acceptance feedback`
3. [ ] 注意事項、保存状態、エラー文言を次の行動が分かる表現へ揃える
4. [ ] プレビュー領域と操作パネルの視認性、余白、重なり、モバイル未満での破綻を調整する
5. [ ] 必要な軽微不具合を修正し、再確認結果を記録する
6. [ ] 新たな仕様追加が混入していないか確認する

**受け入れ条件:**
- [ ] 主要導線で迷いやすい文言や UI が改善されている
- [ ] 見た目崩れや読みにくさが許容範囲まで減っている
- [ ] 修正内容が品質改善の範囲に収まっている

---

### Task 5: パフォーマンスと最終リリース候補を確認する

**目的:** 体感性能とリリース候補版の安定性を確認し、公開可否判断の材料を揃える。

**変更ファイル:**
- `.docs/topics/20260402_5_mvp-phase-4-qa-acceptance/acceptance-log-1.md`
- `.docs/topics/20260402_5_mvp-phase-4-qa-acceptance/bug-list-1.md`
- `.docs/topics/20260402_5_mvp-phase-4-qa-acceptance/report-2.md`

**サブタスク:**
1. [ ] 画像アップロード後の反映、設定変更時の応答、保存処理の待ち時間を体感ベースで確認する
2. [ ] コミット: `docs: finalize phase4 acceptance report`
3. [ ] `npm test` と `npm run build` の結果を記録する
4. [ ] 未解決不具合を「公開阻害」「公開後許容」「次フェーズ送り」に分類する
5. [ ] Go / Hold 判定とその根拠を `report-2.md` にまとめる
6. [ ] Phase 5 へ引き継ぐ注意点と計測観点を記録する

**受け入れ条件:**
- [ ] リリース候補版の検証結果が記録されている
- [ ] 未解決課題の優先度と扱い方が整理されている
- [ ] Go / Hold 判定の根拠が文書化されている

## 推奨実施順
1. Task 1 で QA 実施条件と記録フォーマットを固定する
2. Task 2 でブラウザ別の主要導線確認を行う
3. Task 3 で例外系と回復性を確認し、必要テストを補強する
4. Task 4 で文言、導線、見た目の軽微調整を行う
5. Task 5 で最終検証と Go / Hold 判定をまとめる

## 依存関係
- Task 2 は Task 1 のチェックリストを前提に進める
- Task 3 は Task 2 で把握した導線確認結果を参照して進める
- Task 4 は Task 2 と Task 3 で見つかった問題を入力にする
- Task 5 は Task 4 の修正反映後に実施する

## リスクと対策
- QA 中に仕様追加が入り、受入範囲が膨らむ
- 対策: 新機能は受けず、品質改善と不具合修正に限定する
- ブラウザ差異の再現条件が曖昧で修正判断がぶれる
- 対策: 発生ブラウザ、操作手順、期待値、実際の結果を記録テンプレートへ必ず残す
- UI 調整が場当たり的になり回帰を生む
- 対策: 受入観点に紐づく修正だけに限定し、修正後は対象シナリオを再確認する

## 完了判定
- `specs/product/acceptance-criteria.md` の Must 観点が主要ブラウザで確認済みである
- 重大不具合が解消され、残課題が公開判断可能な粒度で整理されている
- リリース候補版、受入確認記録、不具合一覧、Go / Hold 判定が揃っている
- Phase 5 へ引き継ぐ公開時注意点と計測観点が文書化されている
