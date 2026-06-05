# Specs Documentation Workflow Implementation Plan

## 概要

既存の `docs/` 直下にあるMVP/Phase仕様を、継続運用しやすい `docs/specs/` 配下へ整理する。単なるファイル移動ではなく、別リポジトリ `quartet-labo/an-ne_platform` の PR #336 で導入された「機能一覧インデックス」「機能別詳細仕様」「仕様更新ルール」「エージェント向け手順」を、このNext.js / React / Three.jsアプリ向けに取り込む。

この計画では Task をPR単位、サブタスクをコミット単位として扱う。

## 参照情報

- 元計画: `.docs/plans/20260604213042-specs-documentation-structure.md`
- 参考PR: `quartet-labo/an-ne_platform#336` Add specification documentation workflow
- 参考PRから取り込む方針:
  - `feature-index.md` はカテゴリ、機能、詳細仕様リンクだけを持つ入口にする
  - 機能の振る舞い、例外、関連実装、関連テストは `features/*.md` に書く
  - 実装から断定できない内容は詳細仕様の `未確認・推定` に残す
  - 実装変更時の仕様更新ルールをエージェントとPR作業者が参照できる形にする
  - ドキュメントのみの変更では、リンクと参照構造の確認を主な検証にする

## 前提条件

- 現在の仕様は `docs/` 直下にある
- このリポジトリでは元計画に従い、仕様の正を `docs/specs/` に置く
- `.docs/` は計画、調査、チェックリストなどの作業管理用として残す
- アプリ実装変更は原則含めない
- mainブランチには直接コミットしない
- サブタスクを基準に適宜コミットする
- 全タスク完了後にPRを作成する

## 対象外

- 実装コードの仕様変更
- 新規APIや保存基盤の実装
- 仕様内容の全面リライト
- UIデザインや文言の改善

## 推奨する最終構成

```text
docs/specs/
  README.md
  feature-index.md
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
    engraving-map.md
    lighting-controls.md
    display-controls.md
    export-save.md
  operations/
    spec-maintenance.md
    change-log.md
.agents/
  implementation-change-rules.md
  skills/
    spec-update/
      SKILL.md
AGENTS.md
.github/
  pull_request_template.md
```

## タスク一覧

### Task 1: 仕様入口と運用構造の定義

**目的:** `docs/specs/` の役割、参照順序、機能一覧インデックスの責務を先に固定し、以降の移行と詳細化の判断基準を揃える。

**変更ファイル:**
- `docs/specs/README.md`
- `docs/specs/feature-index.md`
- `docs/specs/operations/spec-maintenance.md`
- `docs/specs/operations/change-log.md`

**サブタスク:**
1. [ ] 既存 `docs/*.md` と現行実装の仕様境界を確認する（コミット: `docs: audit existing specification sources`）
2. [ ] `docs/specs/` のディレクトリ責務と参照順序を `docs/specs/README.md` に定義する（コミット: `docs: define specs documentation structure`）
3. [ ] `feature-index.md` をカテゴリ、機能、詳細仕様リンクだけの入口として作成する（コミット: `docs: add feature specification index`）
4. [ ] 仕様更新手順と変更履歴フォーマットを `operations/` に作成する（コミット: `docs: add specification maintenance workflow`）
5. [ ] `find docs/specs -maxdepth 3 -type f | sort` で配置を確認する

**受け入れ条件:**
- [ ] `docs/specs/README.md` から仕様カテゴリと読む順序が分かる
- [ ] `feature-index.md` に詳細な仕様本文が混ざっていない
- [ ] 新しい仕様を追加するときの配置先を判断できる
- [ ] 仕様変更履歴の最小フォーマットがある

---

### Task 2: 既存 `docs/` 仕様の分類移行

**目的:** 既存仕様を `docs/specs/product/`, `docs/specs/ux/`, `docs/specs/architecture/` に移し、二重管理を避ける。

**移行後ファイル:**
- `docs/specs/product/prd.md`
- `docs/specs/product/milestones.md`
- `docs/specs/product/acceptance-criteria.md`
- `docs/specs/ux/user-flow.md`
- `docs/specs/ux/screens.md`
- `docs/specs/ux/ui-design.md`
- `docs/specs/architecture/tech-stack.md`
- `docs/specs/architecture/component-design.md`
- `docs/specs/architecture/state-design.md`
- `docs/specs/architecture/data-model.md`
- `docs/specs/architecture/api.md`
- `docs/specs/architecture/error-handling.md`
- 必要に応じて `docs/README.md`

**サブタスク:**
1. [ ] 移行先ディレクトリを作成し、既存仕様の移動先を確定する（コミット: `docs: create specs hierarchy`）
2. [ ] プロダクト系仕様を `docs/specs/product/` へ移行する（コミット: `docs: move product specs`）
3. [ ] UX系仕様を `docs/specs/ux/` へ移行する（コミット: `docs: move ux specs`）
4. [ ] 技術設計系仕様を `docs/specs/architecture/` へ移行する（コミット: `docs: move architecture specs`）
5. [ ] 旧 `docs/` を空にするか、移行案内だけの `docs/README.md` にする（コミット: `docs: remove duplicated legacy specs`）
6. [ ] `rg "docs/(MVP_|acceptance|user-flow|screen-spec|component-design|state-design|data-model|api-spec|error-handling)"` で旧参照を確認する

**受け入れ条件:**
- [ ] 既存仕様がカテゴリ別に `docs/specs/` 配下へ移っている
- [ ] 同じ仕様本文が `docs/` と `docs/specs/` に重複していない
- [ ] ファイル名がカテゴリ内で英小文字kebab-caseに揃っている
- [ ] 旧パス参照が残っていない、または意図した移行案内に限られている

---

### Task 3: 現行機能の詳細仕様作成

**目的:** 実装変更時に参照できる機能別詳細仕様を、現行コードと既存テストから作成する。

**変更ファイル:**
- `docs/specs/features/simulator.md`
- `docs/specs/features/image-input.md`
- `docs/specs/features/engraving-map.md`
- `docs/specs/features/lighting-controls.md`
- `docs/specs/features/display-controls.md`
- `docs/specs/features/export-save.md`
- `docs/specs/feature-index.md`

**サブタスク:**
1. [ ] `app/`, `components/`, `lib/`, `tests/` から主要機能、入口、関連実装、関連テストを洗い出す（コミット: `docs: audit simulator feature boundaries`）
2. [ ] シミュレーター全体、画像入力、彫刻マップ生成の詳細仕様を作成する（コミット: `docs: add simulator input and engraving specs`）
3. [ ] LED発光設定、アクリルサイズ、背景、カメラ、表示切替の詳細仕様を作成する（コミット: `docs: add lighting and display specs`）
4. [ ] PNG/JPG書き出し、彫刻画像書き出し、クロップ、セッション保存/復元の詳細仕様を作成する（コミット: `docs: add export and save specs`）
5. [ ] `feature-index.md` のカテゴリ、機能、リンクを詳細仕様に合わせて更新する（コミット: `docs: update feature index links`）
6. [ ] 各詳細仕様に `目的`, `利用者`, `入口`, `実装から分かる仕様`, `エラー・例外`, `関連実装`, `関連テスト`, `未確認・推定` があることを確認する

**受け入れ条件:**
- [ ] 各機能仕様が現行実装と関連テストに紐づいている
- [ ] 実装から断定できない内容が `未確認・推定` に分離されている
- [ ] `feature-index.md` は一覧とリンクだけを維持している
- [ ] 画像入力、彫刻生成、発光、表示、書き出し、保存復元の主要機能を網羅している

---

### Task 4: 仕様更新ワークフローと参照リンクの整備

**目的:** 今後のPRで仕様更新漏れを検出できるように、エージェント向け手順、PRチェック、READMEリンクを整備する。

**変更ファイル:**
- `README.md`
- `AGENTS.md`
- `.agents/implementation-change-rules.md`
- `.agents/skills/spec-update/SKILL.md`
- `.github/pull_request_template.md`
- 必要に応じて `.docs/plans/*.md`

**サブタスク:**
1. [ ] `README.md` に仕様入口 `docs/specs/README.md` と `docs/specs/feature-index.md` へのリンクを追加する（コミット: `docs: link specs from readme`）
2. [ ] `AGENTS.md` にリポジトリ作業ルール、仕様参照先、検証コマンドを追加する（コミット: `docs: add agent project guide`）
3. [ ] `.agents/implementation-change-rules.md` に仕様更新が必要な変更/不要な変更/判断例を定義する（コミット: `docs: add implementation change rules`）
4. [ ] `.agents/skills/spec-update/SKILL.md` にこのリポジトリ向けの仕様更新手順を追加する（コミット: `docs: add spec update skill`）
5. [ ] PRテンプレートに仕様更新確認欄を追加する（コミット: `docs: add pr spec checklist`）
6. [ ] `test ! -e specs` と `rg "docs/specs" README.md AGENTS.md .agents .github docs .docs` で配置と参照を確認する
7. [ ] ドキュメントのみの変更として、必要なら `pnpm test` を省略した理由をPR本文に明記する

**受け入れ条件:**
- [ ] `README.md` から仕様入口に到達できる
- [ ] エージェントが `AGENTS.md` から仕様更新ルールと `spec-update` 手順を辿れる
- [ ] PR作成時に仕様更新要否を確認できる
- [ ] 仕様に影響する変更と影響しない変更の判断例がある
- [ ] 旧 `docs/` 参照が不要に残っていない

## 依存関係

- Task 2 は Task 1 の完了後に着手する
- Task 3 は Task 1 の `feature-index.md` 作成後に着手できるが、最終リンク確認は Task 2 完了後に行う
- Task 4 は Task 1 完了後に並行可能だが、`spec-update` の対象一覧は Task 3 のカテゴリ確定後に更新する

## 検証方針

- 配置確認: `find docs/specs .agents .github -maxdepth 4 -type f | sort`
- 旧参照確認: `rg "docs/(MVP_|acceptance|user-flow|screen-spec|component-design|state-design|data-model|api-spec|error-handling)"`
- リンク確認: `rg "\\]\\(([^)]*)\\)" docs/specs README.md AGENTS.md .agents .github`
- ドキュメントのみの移行ではアプリテストは必須にしない
- 仕様内容が実装ファイル名やテスト名を参照する場合は、該当パスの存在を確認する

## 備考

- 参考PRは `.docs/specs/` を使っているが、このリポジトリでは元計画に合わせて `docs/specs/` を仕様の正とする
- `feature-index.md` は詳細説明を増やしすぎず、詳細仕様へのナビゲーションに徹する
- 既存仕様の内容修正は移行時には最小限にし、不整合や不足は `features/*.md` の `未確認・推定` か後続PRで扱う
- `.docs/topics/` は計画と実績記録の置き場所として使い、仕様本文とは分ける
