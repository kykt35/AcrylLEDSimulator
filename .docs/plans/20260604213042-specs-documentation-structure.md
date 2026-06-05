# Specs Documentation Structure Plan

## 概要
アプリの仕様を継続的に管理するため、既存の `docs/` 直下ドキュメントを整理し、`specs/` ディレクトリ配下へ階層化する。単なるファイル移動ではなく、仕様の種類、更新責務、参照順序、変更時の確認ルールを明確にする。

## 前提条件
- 既存仕様は主に `docs/` 直下に存在する
- 現行アプリは Next.js / React / Three.js 構成
- 仕様管理の主対象は、プロダクト要件、画面仕様、機能仕様、状態設計、API、データモデル、受け入れ条件
- この計画では仕様ドキュメントの作成・移行を対象とし、アプリ実装変更は原則含めない

**特記事項**
- mainブランチには直接コミットしないこと
- サブタスクを基準に適宜コミットを行うこと
- ドキュメント移行後にリンク切れと参照先を確認すること
- 全ての作業が完了した後、PRを作成する

## 推奨する `specs/` 階層

```text
specs/
  README.md
  product/
    prd.md
    milestones.md
    acceptance-criteria.md
  ux/
    user-flow.md
    screens.md
    ui-design.md
  architecture/
    tech-stack.md
    component-design.md
    state-design.md
    data-model.md
    api.md
    error-handling.md
  features/
    simulator.md
    image-input.md
    lighting-controls.md
    display-controls.md
    export-save.md
  operations/
    spec-maintenance.md
    change-log.md
```

## タスク一覧

### Task 1: 仕様体系と命名規約の定義

**目的:** 今後どの仕様をどこに書くか迷わないように、`specs/` の分類、命名、更新ルールを先に固定する。

**変更ファイル:**
- `specs/README.md`
- `specs/operations/spec-maintenance.md`
- `specs/operations/change-log.md`

**サブタスク:**
1. [ ] `specs/` のトップレベル分類を決定する（コミット: `docs: define specs directory structure`）
2. [ ] 各ディレクトリの責務と配置ルールを `specs/README.md` に記載する（コミット: `docs: add specs index`）
3. [ ] 仕様変更時の更新手順を `specs/operations/spec-maintenance.md` に記載する（コミット: `docs: add spec maintenance rules`）
4. [ ] 仕様変更履歴の最低限のフォーマットを `specs/operations/change-log.md` に作成する（コミット: `docs: add spec change log`）
5. [ ] ドキュメントだけの変更であることを確認する

**受け入れ条件:**
- [ ] `specs/README.md` から全カテゴリの役割が分かる
- [ ] 新しい仕様を追加するときの配置先を判断できる
- [ ] 仕様変更時に更新すべき関連ドキュメントが分かる

---

### Task 2: 既存 `docs/` の分類と移行

**目的:** 既存ドキュメントを `specs/` 配下へ移し、仕様の種類ごとに参照しやすい状態にする。

**変更ファイル:**
- `docs/MVP_PRD.md` -> `specs/product/prd.md`
- `docs/MVP_milestone.md` -> `specs/product/milestones.md`
- `docs/acceptance-criteria.md` -> `specs/product/acceptance-criteria.md`
- `docs/user-flow.md` -> `specs/ux/user-flow.md`
- `docs/screen-spec.md` -> `specs/ux/screens.md`
- `docs/MVP_UI_Design.md` -> `specs/ux/ui-design.md`
- `docs/MVP_Tech_Stack.md` -> `specs/architecture/tech-stack.md`
- `docs/component-design.md` -> `specs/architecture/component-design.md`
- `docs/state-design.md` -> `specs/architecture/state-design.md`
- `docs/data-model.md` -> `specs/architecture/data-model.md`
- `docs/api-spec.md` -> `specs/architecture/api.md`
- `docs/error-handling.md` -> `specs/architecture/error-handling.md`

**サブタスク:**
1. [ ] 移行先ディレクトリを作成する（コミット: `docs: create specs hierarchy`）
2. [ ] プロダクト系仕様を `specs/product/` へ移行する（コミット: `docs: move product specs`）
3. [ ] UX系仕様を `specs/ux/` へ移行する（コミット: `docs: move ux specs`）
4. [ ] 技術設計系仕様を `specs/architecture/` へ移行する（コミット: `docs: move architecture specs`）
5. [ ] 旧 `docs/` を残す場合は移行案内だけにするか、削除するかを決める

**受け入れ条件:**
- [ ] 既存仕様が `specs/` 配下に分類されている
- [ ] ファイル名がカテゴリ内で一貫している
- [ ] 同じ仕様内容が `docs/` と `specs/` に二重管理されていない

---

### Task 3: 機能別仕様の作成

**目的:** 画面やアーキテクチャ単位だけでなく、実装・改善時に参照しやすい機能単位の仕様を追加する。

**変更ファイル:**
- `specs/features/simulator.md`
- `specs/features/image-input.md`
- `specs/features/lighting-controls.md`
- `specs/features/display-controls.md`
- `specs/features/export-save.md`

**サブタスク:**
1. [ ] 現行コードから主要機能を洗い出す（コミット: `docs: audit simulator features`）
2. [ ] シミュレーター全体仕様を作成する（コミット: `docs: add simulator feature spec`）
3. [ ] 画像入力仕様を作成する（コミット: `docs: add image input spec`）
4. [ ] LED発光・表示設定仕様を作成する（コミット: `docs: add controls feature specs`）
5. [ ] 保存・書き出し仕様を作成する（コミット: `docs: add export save spec`）

**受け入れ条件:**
- [ ] 各機能仕様に目的、入力、状態、UI挙動、エラー、受け入れ条件がある
- [ ] 実装者が該当機能の変更前に読むべき仕様を特定できる
- [ ] 画面仕様や状態設計との矛盾がない

---

### Task 4: README と参照リンクの更新

**目的:** 開発者が `specs/` を仕様の正と分かるように、入口とリンクを更新する。

**変更ファイル:**
- `README.md`
- `specs/README.md`
- 必要に応じて `.docs/plans/*.md`

**サブタスク:**
1. [ ] `README.md` に仕様ドキュメントの参照先を追加する（コミット: `docs: link specs from readme`）
2. [ ] `specs/README.md` に主要仕様への索引を追加する（コミット: `docs: add specs navigation`）
3. [ ] 移行後の相対リンクを確認・修正する（コミット: `docs: fix spec links`）
4. [ ] 旧パスを参照している箇所を検索して更新する

**受け入れ条件:**
- [ ] `README.md` から仕様トップへ到達できる
- [ ] `specs/README.md` から主要仕様へ到達できる
- [ ] 旧 `docs/` パスへの不要な参照が残っていない

---

### Task 5: 継続運用チェックの整備

**目的:** 仕様が作られた後に放置されないよう、開発フロー上の確認観点を明文化する。

**変更ファイル:**
- `specs/operations/spec-maintenance.md`
- 必要に応じて `.github/pull_request_template.md`

**サブタスク:**
1. [ ] 仕様変更が必要なケースを定義する（コミット: `docs: define when specs must change`）
2. [ ] PR作成時の仕様確認チェックリストを作成する（コミット: `docs: add spec review checklist`）
3. [ ] 必要であれば PR テンプレートに仕様更新欄を追加する（コミット: `docs: add pr spec checklist`）
4. [ ] ドキュメント変更のみでテスト不要な条件を明記する

**受け入れ条件:**
- [ ] 仕様更新が必要な変更と不要な変更を判断できる
- [ ] PRレビュー時に仕様との差分を確認できる
- [ ] 仕様更新漏れを検出しやすいチェック項目がある

## 依存関係
- Task 2 は Task 1 の完了後に着手
- Task 3 は Task 2 の完了後に着手
- Task 4 は Task 2 と Task 3 の後に実施
- Task 5 は Task 1 完了後に並行作業可能

## 備考
- まずは `specs/` を正とし、旧 `docs/` を二重管理しない方針が望ましい
- 既存ドキュメントの内容修正は、移行時には最小限に留める
- 内容の再整理や不足仕様の追記は、移行完了後に別PRで進めるとレビューしやすい
- 機能別仕様は実装コードと完全対応させすぎず、変更判断に必要な振る舞いを中心に書く
