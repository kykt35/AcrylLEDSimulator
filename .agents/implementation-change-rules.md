# 実装変更時の仕様更新ルール

## 目的

Acryl LED Simulator の実装と仕様ドキュメントのずれを小さく保ち、変更時に参照すべき仕様を明確にする。

## 対象ドキュメント

| 種類 | 配置 |
|---|---|
| 仕様入口 | `specs/README.md` |
| 機能一覧 | `specs/feature-index.md` |
| 機能別仕様 | `specs/features/*.md` |
| 仕様運用ルール | `specs/operations/spec-maintenance.md` |

## 基本方針

- 実装の振る舞いが変わる変更では、同じPRまたは同じ作業単位で仕様も更新する。
- `feature-index.md` は一覧とリンクだけにする。
- 機能の振る舞い、例外、関連実装、関連テストは `specs/features/*.md` に書く。
- コードから意図を断定できない内容は、詳細仕様の `未確認・推定` に残す。
- 仕様に影響しない内部リファクタ、テスト追加、軽微な文言修正では、仕様更新は不要でよい。

## 更新先の選び方

| 変更内容 | 更新先 |
|---|---|
| 3Dプレビュー、WebGL、Canvas構成 | `specs/features/simulator.md` |
| PNG入力、ドラッグ&ドロップ、画像配置、アップロード検証 | `specs/features/image-input.md` |
| 彫刻用グレースケール生成、彫刻モード、彫刻PNG | `specs/features/engraving-map.md` |
| LED色、明るさ、高さ方向の減衰 | `specs/features/lighting-controls.md` |
| 背景、カメラ、アクリルサイズ | `specs/features/display-controls.md` |
| PNG/JPG書き出し、クロップ、セッション保存/復元 | `specs/features/export-save.md` |
| APIの入口、パラメータ、レスポンス、エラー | `specs/architecture/api.md` と該当する詳細仕様 |
| 状態モデル、保存スナップショット | `specs/architecture/state-design.md`, `specs/architecture/data-model.md`, 該当する詳細仕様 |
| 機能名、カテゴリ、詳細仕様ファイル名 | `specs/feature-index.md` |

## 更新しなくてよい変更

| 変更内容 | 条件 |
|---|---|
| 内部リファクタ | 外部仕様、状態、保存データ、エラー、書き出し結果に影響しない |
| テスト追加のみ | 実装仕様に変更がない |
| コメントやログの修正 | ユーザーが見る挙動に影響しない |
| 表示文言の微修正 | 操作フローや意味が変わらない |
| スタイル調整 | レイアウト、操作可否、表示内容の意味が変わらない |

## 作業手順

1. `specs/feature-index.md` で対象機能を確認する。
2. 該当する `specs/features/*.md` を開く。
3. 変更したコードから、入口、状態、エラー、保存データ、関連実装、関連テストを確認する。
4. 該当する詳細仕様を更新する。
5. 新機能や新カテゴリがある場合だけ、`feature-index.md` を更新する。
6. 判断が必要な点は `未確認・推定` に残す。
7. PRや作業報告で、仕様更新の有無を明記する。

## PR前チェック

- 仕様に影響する変更か確認した。
- 影響する場合、該当する詳細仕様を更新した。
- 新機能の場合、`feature-index.md` に行を追加した。
- API、状態、保存/復元、書き出し、エラーの変更が仕様に反映されている。
- 未確認事項を `未確認・推定` に残した。
- 関連実装と関連テストの記載が古くなっていない。
