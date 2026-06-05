# Phase 2 MVP Design Implementation Plan

## 概要
Phase 2 では、Phase 1 の PoC で成立した 3D プレビュー体験を、Phase 3 の MVP 実装へ落とし込むための設計を固める。対象は画面仕様、コンポーネント責務、状態管理、API と保存データ、エラー処理、受入基準であり、実装着手時に再設計が発生しない粒度まで文書化する。

## 前提条件
- 要件の基準は `docs/specs/product/milestones.md`、`docs/specs/product/prd.md`、`docs/specs/ux/ui-design.md`、`docs/specs/architecture/tech-stack.md` を参照する
- 現状コードは Phase 1 PoC として `app/page.tsx` を中心に構成されており、MVP 用の画面分割、保存フロー、状態分離は未整理である
- Phase 2 の成果物は設計ドキュメントを主とし、注文導線、共有 URL、本格的な管理機能は対象外とする
- 実装優先度は Must 機能を先に確定し、Should 機能は拡張余地のみ残す

**特記事項**
- main ブランチには直接コミットしないこと
- サブタスクを基準に適宜コミットを行うこと
- 設計成果物は `.docs/topics/20260402_3_mvp-phase-2-mvp-design/` に集約すること
- Phase 3 の着手条件は、各 Task の受け入れ条件が満たされていることとする

## タスク一覧

### Task 1: 画面仕様とユーザーフローの設計を確定する

**目的:** トップ画面、シミュレーター画面、保存結果画面の責務と主要操作を整理し、MVP の画面導線を固定する。

**変更ファイル:**
- `.docs/topics/20260402_3_mvp-phase-2-mvp-design/screen-spec.md`
- `.docs/topics/20260402_3_mvp-phase-2-mvp-design/user-flow.md`

**サブタスク:**
1. [ ] 対象画面、遷移、主要アクション、MVP 対象外の整理観点を洗い出す
2. [ ] コミット: `docs: outline phase2 screen spec scope`
3. [ ] 3 画面と補助モーダルのレイアウト、UI セクション、操作フローを `screen-spec.md` に整理する
4. [ ] コミット: `docs: define mvp screen specifications`
5. [ ] 初回訪問から保存完了までのユーザーフローと分岐条件を `user-flow.md` に整理する
6. [ ] コミット: `docs: add simulator user flow design`
7. [ ] 画面仕様が PRD の Must 機能を過不足なく満たすか確認する

**受け入れ条件:**
- [ ] 3 画面と補助モーダルの責務が明文化されている
- [ ] 画像アップロード、LED 色変更、明るさ変更、背景切替、保存の操作導線が説明できる
- [ ] 将来機能と MVP 対象範囲が区別されている

---

### Task 2: コンポーネント構成と状態管理方針を設計する

**目的:** Phase 1 PoC の単一画面構成を、Phase 3 で拡張しやすい責務分割と状態の持ち方へ変換する。

**変更ファイル:**
- `.docs/topics/20260402_3_mvp-phase-2-mvp-design/component-design.md`
- `.docs/topics/20260402_3_mvp-phase-2-mvp-design/state-design.md`

**サブタスク:**
1. [ ] 現行の `app/`、`components/`、`lib/` 配下の責務と Phase 3 で不足する境界を洗い出す
2. [ ] コミット: `docs: capture current poc architecture gaps`
3. [ ] 画面、UI、3D シーン、アップロード、保存の責務分割と推奨ディレクトリ構成を `component-design.md` に整理する
4. [ ] コミット: `docs: define mvp component architecture`
5. [ ] 画像入力、シミュレーター設定、保存状態、エラー状態の管理方針を `state-design.md` に整理する
6. [ ] コミット: `docs: define simulator state management`
7. [ ] 状態の更新起点とデータフローが画面仕様と矛盾しないか確認する

**受け入れ条件:**
- [ ] Phase 3 で追加する主要コンポーネントの責務が説明できる
- [ ] `useState` で持つ状態と分離すべき状態の判断基準がある
- [ ] 画像アップロードからプレビュー反映までのデータフローが一意に定まっている

---

### Task 3: API、保存データ、エラー処理を設計する

**目的:** 保存機能と将来拡張を見据えた最小 API 契約を定義し、失敗時の挙動を先に固定する。

**変更ファイル:**
- `.docs/topics/20260402_3_mvp-phase-2-mvp-design/api-spec.md`
- `.docs/topics/20260402_3_mvp-phase-2-mvp-design/data-model.md`
- `.docs/topics/20260402_3_mvp-phase-2-mvp-design/error-handling.md`

**サブタスク:**
1. [ ] 保存対象、保存手順、クライアント完結処理とサーバー処理の境界を洗い出す
2. [ ] コミット: `docs: outline save flow constraints`
3. [ ] アップロードと保存に必要な Route Handler の入出力、レスポンス、失敗系を `api-spec.md` に整理する
4. [ ] コミット: `docs: define upload and save api contracts`
5. [ ] シミュレーション設定 JSON、出力画像メタデータ、エラーパターンと UI 応答を `data-model.md` と `error-handling.md` に整理する
6. [ ] コミット: `docs: define save data and error handling`
7. [ ] Phase 3 の保存実装に必要な判断材料が揃っているか確認する

**受け入れ条件:**
- [ ] 保存機能の API 契約とデータ構造が定義されている
- [ ] 想定する失敗パターンごとに UI 表示とリカバリ方法が決まっている
- [ ] 共有 URL や履歴管理などの将来拡張が MVP 設計から分離されている

---

### Task 4: 受入基準と Phase 3 着手用バックログを確定する

**目的:** 実装と QA の判断基準を共通化し、Phase 3 の着手順をレビュー可能な粒度まで分解する。

**変更ファイル:**
- `.docs/topics/20260402_3_mvp-phase-2-mvp-design/acceptance-criteria.md`
- `.docs/topics/20260402_3_mvp-phase-2-mvp-design/phase-3-backlog.md`

**サブタスク:**
1. [ ] ユースケースごとの受入観点とブラウザ確認観点を洗い出す
2. [ ] コミット: `docs: outline mvp acceptance viewpoints`
3. [ ] Must 機能中心の受入基準、非機能観点、除外事項を `acceptance-criteria.md` に整理する
4. [ ] コミット: `docs: define mvp acceptance criteria`
5. [ ] Phase 3 を基盤実装、シミュレーター、画像処理、保存、補助 UI の順に分解した実装バックログを `phase-3-backlog.md` に整理する
6. [ ] コミット: `docs: create phase3 execution backlog`
7. [ ] 受入基準とバックログの順序が依存関係と一致するか確認する

**受け入れ条件:**
- [ ] QA と実装で共通利用できる受入条件が定義されている
- [ ] Phase 3 の実装順が依存関係ベースで説明できる
- [ ] 未確定事項が「設計漏れ」ではなく「将来課題」として切り分けられている

## 依存関係
- Task 2 は Task 1 の画面仕様を前提に進める
- Task 3 は Task 1 と Task 2 の画面責務、状態責務を入力として進める
- Task 4 は Task 1 から Task 3 の成果物を参照して最終化する

## 備考
- Phase 2 の成果物はコードではなく設計文書だが、Phase 3 の実装を迷わせない粒度で具体化する
- 保存機能は MVP で必要な最小構成に限定し、共有機能や運用管理機能は拡張余地の記載に留める
- 受入基準は見た目の主観表現だけで終わらせず、操作、失敗時挙動、保存成功条件まで含める
