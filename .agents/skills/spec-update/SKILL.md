---
name: spec-update
description: Update Acryl LED Simulator specification documents when implementation behavior changes. Use when changing features, image input, engraving generation, lighting/display controls, export/save behavior, API behavior, state models, or when the user asks to update specs.
---

# Spec Update

## Quick Start

実装変更が仕様に影響する場合は、`.agents/implementation-change-rules.md` と `docs/specs/operations/spec-maintenance.md` を基準に `docs/specs/` を更新する。

## 対象ドキュメント

- 仕様入口: `docs/specs/README.md`
- 機能一覧: `docs/specs/feature-index.md`
- 機能別仕様: `docs/specs/features/*.md`
- 仕様運用ルール: `docs/specs/operations/spec-maintenance.md`

## 基本ルール

- `feature-index.md` はカテゴリ、機能、詳細仕様リンクだけにする。
- 機能の振る舞い、例外、関連実装、関連テストは詳細仕様ファイルに書く。
- 新機能を追加した場合は、`feature-index.md` に行を追加する。
- 既存機能の振る舞いを変えた場合は、該当する詳細仕様を更新する。
- コードから意図を断定できない内容は、詳細仕様の `未確認・推定` に残す。

## 更新先の選び方

| 変更内容 | 更新先 |
|---|---|
| 3Dプレビュー、WebGL、Canvas構成 | `docs/specs/features/simulator.md` |
| PNG入力、ドラッグ&ドロップ、画像配置 | `docs/specs/features/image-input.md` |
| 彫刻用グレースケール生成、彫刻モード | `docs/specs/features/engraving-map.md` |
| LED色、明るさ、高さ方向の減衰 | `docs/specs/features/lighting-controls.md` |
| 背景、カメラ、アクリルサイズ | `docs/specs/features/display-controls.md` |
| PNG/JPG書き出し、クロップ、セッション保存/復元 | `docs/specs/features/export-save.md` |
| API変更 | `docs/specs/architecture/api.md` と該当機能仕様 |
| 状態/データ変更 | `docs/specs/architecture/state-design.md`, `docs/specs/architecture/data-model.md`, 該当機能仕様 |

## 作業フロー

1. `docs/specs/feature-index.md` で対象カテゴリと詳細仕様を確認する。
2. 変更したコードから、入口、状態、エラー、保存データ、関連実装、関連テストを確認する。
3. 該当する詳細仕様を更新する。
4. 新機能や新カテゴリがある場合だけ、`feature-index.md` を更新する。
5. 最後に `feature-index.md` が一覧とリンクだけになっていることを確認する。
6. 作業報告で、仕様更新したファイルと未確認事項を伝える。

## 詳細仕様の見出し

原則として以下を使う。

```md
# 機能名

## 目的
## 利用者
## 入口
## 実装から分かる仕様
## エラー・例外
## 関連実装
## 関連テスト
## 未確認・推定
```

## 確認コマンド

```bash
find docs/specs -maxdepth 3 -type f | sort
sed -n '1,160p' docs/specs/feature-index.md
```

ドキュメントのみの変更では、通常 `pnpm test` は不要。
